import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

function StoryEvent({ event, index }) {
  const [activeImage, setActiveImage] = useState(null)
  const shouldReduceMotion = useReducedMotion()
  const media = Array.isArray(event.media) ? event.media : []

  useEffect(() => {
    if (!activeImage) return undefined

    const handleKeyDown = (keyboardEvent) => {
      if (keyboardEvent.key === 'Escape') setActiveImage(null)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeImage])

  return (
    <motion.article
      className={`story-event ${index % 2 === 0 ? 'story-event--left' : 'story-event--right'}`}
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 28, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.65, delay: shouldReduceMotion ? 0 : 0.04, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="story-event__node" aria-hidden="true" />
      <div className="story-event__card">
        <time className="story-event__date">{event.date}</time>
        <h2 className="story-event__title">{event.title}</h2>
        <p className="story-event__text">{event.text}</p>
        {media.length > 0 && (
          <div className={`story-event__media story-event__media--${media.length > 1 ? 'grid' : 'single'}`}>
            {media.map((item, mediaIndex) => (
              <StoryMedia
                key={`${event.id}-media-${mediaIndex}`}
                item={item}
                fallbackAlt={event.title}
                onImageClick={setActiveImage}
              />
            ))}
          </div>
        )}
      </div>

      {activeImage && (
        <div className="story-lightbox" role="dialog" aria-modal="true" aria-label="Просмотр изображения" onClick={() => setActiveImage(null)}>
          <button className="story-lightbox__close" type="button" aria-label="Закрыть изображение" onClick={() => setActiveImage(null)}>×</button>
          <div className="story-lightbox__content" onClick={(clickEvent) => clickEvent.stopPropagation()}>
            <img src={activeImage.src} alt={activeImage.alt || event.title} />
          </div>
        </div>
      )}
    </motion.article>
  )
}

function StoryMedia({ item, fallbackAlt, onImageClick }) {
  if (item.type === 'image') {
    return (
      <button className="story-media story-media--image" type="button" onClick={() => onImageClick(item)} aria-label={`Открыть изображение: ${item.alt || fallbackAlt}`}>
        <img src={item.src} alt={item.alt || fallbackAlt} loading="lazy" />
        <span className="story-media__zoom" aria-hidden="true">+</span>
      </button>
    )
  }

  if (item.type === 'video') {
    return (
      <video className="story-media story-media--video" controls playsInline preload="metadata" poster={item.poster}>
        <source src={item.src} />
        Ваш браузер не поддерживает воспроизведение видео.
      </video>
    )
  }

  return null
}

export default StoryEvent
