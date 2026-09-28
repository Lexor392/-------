import { useEffect, useState } from 'react'

function PageTransition({ sceneKey, children }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(false)
    const frame = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(frame)
  }, [sceneKey])

  return (
    <div className={`page-transition${visible ? ' is-visible' : ''}`} role="region" aria-live="polite">
      {children}
    </div>
  )
}

export default PageTransition
