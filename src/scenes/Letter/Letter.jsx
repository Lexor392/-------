import { useEffect, useRef, useState } from 'react'
import Button from '../../components/Button/Button.jsx'
import letter from '../../data/letter.js'
import './Letter.scss'

function LetterOpening({ onBack, onOpen }) {
  return (
    <div className="letter-opening">
      <button className="letter-back" type="button" onClick={onBack}>← Назад</button>
      <div className="letter-opening__content">
        <p className="eyebrow">{letter.eyebrow}</p>
        <h1 id="letter-title">{letter.title}</h1>
        <p className="letter-opening__subtitle">{letter.subtitle}</p>
        <div className="scene__action is-visible">
          <Button onClick={onOpen}>Открыть письмо</Button>
        </div>
      </div>
      <span className="letter-opening__mark" aria-hidden="true">✦</span>
    </div>
  )
}

function LetterMedia({ media }) {
  const images = media?.filter((item) => item.type === 'image' && item.src)

  if (!images?.length) return null

  return (
    <div className="letter-media" aria-label="Дополнительные материалы письма">
      {images.map((item) => (
        <figure className="letter-media__item" key={item.src}>
          <img src={item.src} alt={item.alt || 'Иллюстрация к письму'} loading="lazy" />
          {item.caption && <figcaption>{item.caption}</figcaption>}
        </figure>
      ))}
    </div>
  )
}

function LetterReading({ onBack, onContinue }) {
  const [revealedParagraphs, setRevealedParagraphs] = useState(() => new Set())
  const paragraphRefs = useRef([])

  useEffect(() => {
    const paragraphs = paragraphRefs.current.filter(Boolean)

    if (!('IntersectionObserver' in window)) {
      setRevealedParagraphs(new Set(letter.paragraphs.map((_, index) => index)))
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        setRevealedParagraphs((current) => {
          const next = new Set(current)
          entries.forEach((entry) => {
            if (entry.isIntersecting) next.add(Number(entry.target.dataset.paragraphIndex))
          })
          return next
        })
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
    )

    paragraphs.forEach((paragraph) => observer.observe(paragraph))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="letter-reading">
      <div className="letter-reading__topline">
        <button className="letter-back" type="button" onClick={onBack}>← Назад</button>
        <span>ЛИЧНОЕ ПИСЬМО</span>
      </div>

      <header className="letter-reading__header">
        <p className="eyebrow">{letter.eyebrow}</p>
        <h1 id="letter-title">{letter.title}</h1>
        <span className="letter-divider" aria-hidden="true" />
      </header>

      <article className="letter-body" aria-label="Текст личного письма">
        {letter.paragraphs.map((paragraph, index) => (
          <p
            key={`${paragraph}-${index}`}
            ref={(element) => { paragraphRefs.current[index] = element }}
            data-paragraph-index={index}
            className={revealedParagraphs.has(index) ? 'is-visible' : ''}
          >
            {paragraph}
          </p>
        ))}
      </article>

      <LetterMedia media={letter.media} />

      <footer className="letter-ending">
        <div className="letter-ending__signature">
          <span>С теплом,</span>
          <strong>{letter.signature}</strong>
        </div>
        <span className="letter-divider" aria-hidden="true" />
        <p>И это ещё не конец.</p>
        <Button onClick={onContinue}>Продолжить →</Button>
      </footer>
    </div>
  )
}

function LetterScene({ onBack, onContinue }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <section className={`scene scene--letter ${isOpen ? 'is-open' : ''}`} aria-labelledby="letter-title">
      {!isOpen
        ? <LetterOpening onBack={onBack} onOpen={() => setIsOpen(true)} />
        : <LetterReading onBack={onBack} onContinue={onContinue} />}
    </section>
  )
}

export default LetterScene
