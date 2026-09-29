import { createPortal } from 'react-dom'
import { useEffect, useRef } from 'react'
import Icon from '../Icon/Icon.jsx'

const HEART_COUNT = 8

function CursorEffects() {
  const cursorRef = useRef(null)
  const heartRefs = useRef([])
  const heartIndex = useRef(0)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return undefined

    const cursor = cursorRef.current
    if (!cursor) return undefined

    let animationFrame = null
    let lastHeartAt = 0
    const interactiveSelector = 'button, a, input, textarea, select, [role="button"]'

    const handlePointerMove = (event) => {
      cursor.classList.toggle('is-hovering', Boolean(event.target.closest?.(interactiveSelector)))

      if (animationFrame) cancelAnimationFrame(animationFrame)
      animationFrame = requestAnimationFrame(() => {
        cursor.style.setProperty('--cursor-x', `${event.clientX}px`)
        cursor.style.setProperty('--cursor-y', `${event.clientY}px`)
      })

      const now = performance.now()
      if (now - lastHeartAt < 96) return
      lastHeartAt = now

      const heart = heartRefs.current[heartIndex.current]
      heartIndex.current = (heartIndex.current + 1) % HEART_COUNT
      if (!heart) return

      heart.style.left = `${event.clientX}px`
      heart.style.top = `${event.clientY}px`
      heart.style.setProperty('--heart-size', `${0.65 + Math.random() * 0.7}`)
      heart.style.setProperty('--heart-drift', `${-28 + Math.random() * 56}px`)
      heart.style.setProperty('--heart-rotation', `${-24 + Math.random() * 48}deg`)
      heart.classList.remove('is-visible')
      requestAnimationFrame(() => heart.classList.add('is-visible'))
    }

    const handlePointerLeave = () => {
      cursor.classList.add('is-hidden')
      cursor.classList.remove('is-hovering')
    }
    const handlePointerEnter = () => cursor.classList.remove('is-hidden')

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', handlePointerLeave)
    document.documentElement.addEventListener('pointerenter', handlePointerEnter)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      document.documentElement.removeEventListener('pointerleave', handlePointerLeave)
      document.documentElement.removeEventListener('pointerenter', handlePointerEnter)
      if (animationFrame) cancelAnimationFrame(animationFrame)
    }
  }, [])

  const cursorMarkup = (
    <div ref={cursorRef} className="cursor-effects" aria-hidden="true">
      <span className="cursor-effects__dot" />
      {Array.from({ length: HEART_COUNT }, (_, index) => (
        <span
          key={index}
          ref={(element) => { heartRefs.current[index] = element }}
          className="cursor-effects__heart"
        >
          <Icon name="heart-fill" library="bootstrap" />
        </span>
      ))}
    </div>
  )

  return createPortal(cursorMarkup, document.body)
}

export default CursorEffects
