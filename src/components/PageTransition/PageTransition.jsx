import { useEffect, useState } from 'react'

function PageTransition({ sceneKey, children }) {
  const [renderedChildren, setRenderedChildren] = useState(children)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(false)
    const swap = window.setTimeout(() => {
      setRenderedChildren(children)
      requestAnimationFrame(() => setVisible(true))
    }, 220)

    return () => window.clearTimeout(swap)
  }, [sceneKey])

  return (
    <div className={`page-transition${visible ? ' is-visible' : ''}`} role="region" aria-live="polite">
      {renderedChildren}
    </div>
  )
}

export default PageTransition
