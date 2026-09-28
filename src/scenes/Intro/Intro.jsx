import { useEffect, useState } from 'react'
import Button from '../../components/Button/Button.jsx'

const lines = ['Некоторые вещи невозможно купить.', 'Но их можно сделать самому.', 'Для тебя.']

function IntroScene({ onContinue }) {
  const [revealedLines, setRevealedLines] = useState(0)

  useEffect(() => {
    const timers = lines.map((_, index) => setTimeout(() => setRevealedLines(index + 1), 700 + index * 850))
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <section className="scene scene--intro" aria-labelledby="intro-title">
      <div className="scene__content intro-content">
        <p className="eyebrow">Небольшая история</p>
        <h1 id="intro-title" className="intro-lines">
          {lines.map((line, index) => (
            <span key={line} className={`intro-lines__line ${revealedLines > index ? 'is-visible' : ''}`}>
              {line}
            </span>
          ))}
        </h1>
        <div className={`scene__action ${revealedLines === lines.length ? 'is-visible' : ''}`}>
          <Button onClick={onContinue}>Продолжить</Button>
        </div>
      </div>
    </section>
  )
}

export default IntroScene
