import { createPortal } from 'react-dom'
import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

function StoryEvent({ event, index }) {
  const [activeMedia, setActiveMedia] = useState(null)
  const [cardHeight, setCardHeight] = useState(null)
  const cardRef = useRef(null)
  const shouldReduceMotion = useReducedMotion()
  const media = Array.isArray(event.media) ? event.media : []
  const hasMedia = media.length > 0

  useEffect(() => {
    if (!activeMedia) return undefined

    const handleKeyDown = (keyboardEvent) => {
      if (keyboardEvent.key === 'Escape') setActiveMedia(null)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeMedia])

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
    if (!activeMedia) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [activeMedia])

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
        <h2 className="story-event__title">{event.title}</h2>
        <p className="story-event__text">{event.text}</p>
      </div>

      {hasMedia && (
        <div
          className={`story-event__media story-event__media--${media.length > 1 ? 'grid' : 'single'}`}
          style={media.length === 1 && cardHeight ? { '--story-card-height': `${cardHeight}px` } : undefined}
          aria-label={`Медиа к событию: ${event.date}`}
        >
          {media.map((item, mediaIndex) => (
            <StoryMedia
              key={`${event.id}-media-${mediaIndex}`}
              item={item}
              fallbackAlt={event.title}
              onMediaClick={setActiveMedia}
            />
          ))}
        </div>
      )}

      {activeMedia && (
        <StoryLightbox
          media={activeMedia}
          title={event.title}
          onClose={() => setActiveMedia(null)}
        />
      )}
    </motion.article>
  )
}

function StoryMedia({ item, fallbackAlt, onMediaClick }) {
  const [detectedOrientation, setDetectedOrientation] = useState(null)
  const orientation = item.orientation || detectedOrientation || 'landscape'
  const orientationClass = `story-media--${orientation}`

  const handleMediaLoad = (mediaElement) => {
    const width = mediaElement.naturalWidth || mediaElement.videoWidth
    const height = mediaElement.naturalHeight || mediaElement.videoHeight

    if (!width || !height) return

    setDetectedOrientation(height > width * 1.08 ? 'portrait' : 'landscape')
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
        <span className="story-media__zoom" aria-hidden="true">+</span>
      </button>
    )
  }

  if (item.type === 'video') {
    return (
      <div className={`story-media story-media--video ${orientationClass}`}>
        <video
          controls
          playsInline
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
          ⛶
        </button>
      </div>
    )
  }

  return null
}

function StoryLightbox({ media, title, onClose }) {
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
        ×
      </button>
      <div className="story-lightbox__content" onClick={(event) => event.stopPropagation()}>
        {media.type === 'video' ? (
          <video controls autoPlay playsInline preload="auto" poster={media.poster}>
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
