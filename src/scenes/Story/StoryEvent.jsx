import { createPortal } from 'react-dom'
import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import AnimatedLetters from '../../components/AnimatedLetters/AnimatedLetters.jsx'
import Icon from '../../components/Icon/Icon.jsx'

function StoryEvent({ event, index }) {
  const [activeMediaIndex, setActiveMediaIndex] = useState(null)
  const [cardHeight, setCardHeight] = useState(null)
  const [mediaOrientations, setMediaOrientations] = useState({})
  const cardRef = useRef(null)
  const shouldReduceMotion = useReducedMotion()
  const media = Array.isArray(event.media) ? event.media : []
  const hasMedia = media.length > 0
  const activeMedia = activeMediaIndex === null ? null : media[activeMediaIndex]
  const isHorizontalPhotoGallery =
    media.length > 1 &&
    media.length <= 3 &&
    media.every((item) => item.type === 'image') &&
    media.every((item, mediaIndex) => (item.orientation || mediaOrientations[mediaIndex]) === 'landscape')

  useEffect(() => {
    const card = cardRef.current
    if (!card || typeof ResizeObserver === 'undefined') return undefined

    const updateCardHeight = () => {
      setCardHeight(Math.round(card.getBoundingClientRect().height))
    }

    updateCardHeight()
    const observer = new ResizeObserver(updateCardHeight)
    observer.observe(card)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (activeMediaIndex === null) return undefined

    const handleKeyDown = (keyboardEvent) => {
      if (keyboardEvent.key === 'Escape') setActiveMediaIndex(null)
      if (media.length < 2) return

      if (keyboardEvent.key === 'ArrowRight') {
        keyboardEvent.preventDefault()
        setActiveMediaIndex((currentIndex) => (currentIndex + 1) % media.length)
      }

      if (keyboardEvent.key === 'ArrowLeft') {
        keyboardEvent.preventDefault()
        setActiveMediaIndex((currentIndex) => (currentIndex - 1 + media.length) % media.length)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeMediaIndex, media.length])

  useEffect(() => {
    if (activeMediaIndex === null) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [activeMediaIndex])

  return (
    <motion.article
      className={`story-event ${index % 2 === 0 ? 'story-event--left' : 'story-event--right'}${hasMedia ? ' story-event--has-media' : ''}`}
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 28, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.65, delay: shouldReduceMotion ? 0 : 0.04, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="story-event__node" aria-hidden="true" />
      <div ref={cardRef} className="story-event__card">
        <time className="story-event__date">{event.date}</time>
        <h2 className="story-event__title"><AnimatedLetters text={event.title} /></h2>
        <p className="story-event__text"><AnimatedLetters text={event.text} /></p>
      </div>

      {hasMedia && (
        <div
          className={`story-event__media story-event__media--${media.length > 1 ? 'grid' : 'single'}${isHorizontalPhotoGallery ? ` story-event__media--${media.length}-horizontal` : ''}`}
          style={cardHeight ? { '--story-card-height': `${cardHeight}px` } : undefined}
          aria-label={`Медиа к событию: ${event.date}`}
        >
          {media.map((item, mediaIndex) => (
            <StoryMedia
              key={`${event.id}-media-${mediaIndex}`}
              item={item}
              fallbackAlt={event.title}
              onMediaClick={() => setActiveMediaIndex(mediaIndex)}
              onOrientationChange={(orientation) => setMediaOrientations((current) => ({ ...current, [mediaIndex]: orientation }))}
            />
          ))}
        </div>
      )}

      {activeMedia && (
        <StoryLightbox
          mediaItems={media}
          activeIndex={activeMediaIndex}
          media={activeMedia}
          title={event.title}
          onClose={() => setActiveMediaIndex(null)}
          onChange={setActiveMediaIndex}
        />
      )}
    </motion.article>
  )
}

function StoryMedia({ item, fallbackAlt, onMediaClick, onOrientationChange }) {
  const [detectedOrientation, setDetectedOrientation] = useState(null)
  const videoRef = useRef(null)
  const orientation = item.orientation || detectedOrientation || 'landscape'
  const orientationClass = `story-media--${orientation}`

  useEffect(() => {
    const video = videoRef.current
    if (!video) return undefined

    video.muted = true

    if (typeof IntersectionObserver === 'undefined') {
      video.play().catch(() => {})
      return () => video.pause()
    }

    const observer = new IntersectionObserver(([entry]) => {
      video.muted = true

      if (entry.isIntersecting) {
        video.play().catch(() => {})
      } else {
        video.pause()
      }
    }, { threshold: 0.35 })

    observer.observe(video)
    return () => {
      observer.disconnect()
      video.pause()
    }
  }, [item.src])

  const handleMediaLoad = (mediaElement) => {
    const width = mediaElement.naturalWidth || mediaElement.videoWidth
    const height = mediaElement.naturalHeight || mediaElement.videoHeight

    if (!width || !height) return

    const nextOrientation = height > width * 1.08 ? 'portrait' : 'landscape'
    setDetectedOrientation(nextOrientation)
    onOrientationChange?.(nextOrientation)
  }

  if (item.type === 'image') {
    return (
      <button
        className={`story-media story-media--image ${orientationClass}`}
        type="button"
        onClick={() => onMediaClick(item)}
        aria-label={`Открыть изображение: ${item.alt || fallbackAlt}`}
      >
        <img
          src={item.src}
          alt={item.alt || fallbackAlt}
          loading="lazy"
          onLoad={(event) => handleMediaLoad(event.currentTarget)}
        />
      </button>
    )
  }

  if (item.type === 'video') {
    return (
      <div className={`story-media story-media--video ${orientationClass}`}>
        <video
          ref={videoRef}
          playsInline
          muted
          loop
          preload="metadata"
          poster={item.poster}
          onLoadedMetadata={(event) => handleMediaLoad(event.currentTarget)}
          aria-label={item.alt || fallbackAlt}
        >
          <source src={item.src} />
          Ваш браузер не поддерживает воспроизведение видео.
        </video>
        <button
          className="story-media__fullscreen"
          type="button"
          onClick={() => onMediaClick(item)}
          aria-label={`Открыть видео на весь экран: ${item.alt || fallbackAlt}`}
        >
          <Icon name="fullscreen" />
        </button>
      </div>
    )
  }

  return null
}

function StoryLightbox({ mediaItems, activeIndex, media, title, onClose, onChange }) {
  const hasNavigation = mediaItems.length > 1

  const showPrevious = (event) => {
    event.stopPropagation()
    onChange((activeIndex - 1 + mediaItems.length) % mediaItems.length)
  }

  const showNext = (event) => {
    event.stopPropagation()
    onChange((activeIndex + 1) % mediaItems.length)
  }

  return createPortal(
    <div
      className="story-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={media.type === 'video' ? 'Просмотр видео' : 'Просмотр изображения'}
      onClick={onClose}
    >
      <button
        className="story-lightbox__close"
        type="button"
        aria-label="Закрыть просмотр"
        onClick={onClose}
      >
        <Icon name="close" />
      </button>
      {hasNavigation && (
        <>
          <button
            className="story-lightbox__arrow story-lightbox__arrow--previous"
            type="button"
            aria-label="Предыдущее медиа"
            onClick={showPrevious}
          >
            <Icon name="chevron_left" />
          </button>
          <button
            className="story-lightbox__arrow story-lightbox__arrow--next"
            type="button"
            aria-label="Следующее медиа"
            onClick={showNext}
          >
            <Icon name="chevron_right" />
          </button>
        </>
      )}
      <div className="story-lightbox__content" onClick={(event) => event.stopPropagation()}>
        {media.type === 'video' ? (
          <video controls autoPlay muted loop playsInline preload="auto" poster={media.poster}>
            <source src={media.src} />
            Ваш браузер не поддерживает воспроизведение видео.
          </video>
        ) : (
          <img src={media.src} alt={media.alt || title} />
        )}
      </div>
    </div>,
    document.body,
  )
}

export default StoryEvent
