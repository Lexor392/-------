import { useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import Button from '../../components/Button/Button.jsx'
import finale from '../../data/finale.js'
import './Finale.scss'

const CONFETTI_COLORS = ['#C58B9B', '#8E6A80', '#EDE9E3']

function FinaleScene({ onRestart }) {
  const [revealStep, setRevealStep] = useState(0)
  const hasCelebrated = useRef(false)

  useEffect(() => {
    const isReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    if (isReducedMotion) {
      setRevealStep(4)
      return undefined
    }

    const timers = [
      window.setTimeout(() => setRevealStep(1), 420),
      window.setTimeout(() => setRevealStep(2), 1250),
      window.setTimeout(() => setRevealStep(3), 2250),
      window.setTimeout(() => setRevealStep(4), 3550),
    ]

    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [])

  useEffect(() => {
    if (revealStep < 4 || hasCelebrated.current) return undefined
    hasCelebrated.current = true

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined

    const burst = (options) => confetti({
      colors: CONFETTI_COLORS,
      disableForReducedMotion: true,
      gravity: 0.78,
      ticks: 170,
      scalar: 0.78,
      ...options,
    })

    burst({ particleCount: 24, spread: 42, startVelocity: 20, origin: { x: 0.08, y: 0.7 } })
    burst({ particleCount: 24, spread: 42, startVelocity: 20, origin: { x: 0.92, y: 0.7 } })

    const centerBurst = window.setTimeout(() => {
      burst({ particleCount: 30, spread: 56, startVelocity: 24, origin: { x: 0.5, y: 0.64 } })
    }, 260)

    return () => window.clearTimeout(centerBurst)
  }, [revealStep])

  const isVisible = (step) => revealStep >= step

  return (
    <section className={`scene scene--finale${isVisible(4) ? ' is-complete' : ''}`} aria-labelledby="finale-title">
      <div className="finale__halo" aria-hidden="true" />
      <div className="finale__content">
        <p className={`eyebrow finale__reveal finale__reveal--eyebrow${isVisible(1) ? ' is-visible' : ''}`}>
          {finale.eyebrow}
        </p>

        <h1 id="finale-title" className={`finale__reveal finale__reveal--title${isVisible(2) ? ' is-visible' : ''}`}>
          {finale.title}
        </h1>

        <div className={`finale__message finale__reveal${isVisible(3) ? ' is-visible' : ''}`}>
          {finale.message.map((paragraph, index) => (
            <p key={`${paragraph}-${index}`}>{paragraph}</p>
          ))}
        </div>

        <p className={`finale__last-line finale__reveal${isVisible(4) ? ' is-visible' : ''}`}>
          {finale.finalLine}
        </p>

        <span className={`finale__divider finale__reveal${isVisible(4) ? ' is-visible' : ''}`} aria-hidden="true" />

        <div className={`finale__restart finale__reveal${isVisible(4) ? ' is-visible' : ''}`}>
          <Button variant="text" onClick={onRestart}>Начать сначала</Button>
        </div>
      </div>
    </section>
  )
}

export default FinaleScene
