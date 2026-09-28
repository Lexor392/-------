import { motion } from 'motion/react'
import Button from '../Button/Button.jsx'

function ChapterScene({ id, kicker, title, description, onContinue, nextLabel = 'Продолжить', isFinal = false }) {
  return (
    <section className={`scene scene--chapter scene--${id}`} aria-labelledby={`${id}-title`}>
      <div className="chapter-orbit" aria-hidden="true">
        <span className="chapter-orbit__ring chapter-orbit__ring--outer" />
        <span className="chapter-orbit__ring chapter-orbit__ring--inner" />
        <span className="chapter-orbit__point" />
      </div>
      <motion.div
        className="scene__content chapter-content"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="eyebrow">{kicker}</p>
        <h1 id={`${id}-title`}>{title}</h1>
        <p className="scene__lead">{description}</p>
        {!isFinal && <div className="scene__action is-visible"><Button onClick={onContinue}>{nextLabel}</Button></div>}
      </motion.div>
    </section>
  )
}

export default ChapterScene
