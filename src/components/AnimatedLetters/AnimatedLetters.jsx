import { useEffect, useRef } from 'react'

function AnimatedLetters({ text }) {
  const rootRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof IntersectionObserver === 'undefined') {
      root.classList.add('is-visible')
      return undefined
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      root.classList.add('is-visible')
      observer.disconnect()
    }, { threshold: 0.2 })

    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  return <span ref={rootRef} className="animated-letters">{text}</span>
}

export default AnimatedLetters
