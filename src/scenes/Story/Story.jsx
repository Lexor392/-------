import { useEffect } from 'react'
import AnimatedLetters from '../../components/AnimatedLetters/AnimatedLetters.jsx'
import Button from '../../components/Button/Button.jsx'
import story from '../../data/story.js'
import StoryEvent from './StoryEvent.jsx'
import './story.scss'

function StoryScene({ onContinue }) {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [])

  return (
    <section className="scene scene--story" aria-labelledby="story-title">
      <header className="story-intro scene__content">
        <p className="eyebrow">Наша история</p>
        <h1 id="story-title"><AnimatedLetters text="С того самого сообщения" /></h1>
        <p className="scene__lead"><AnimatedLetters text="Иногда всё начинается с нескольких совершенно обычных слов." /></p>
        <p className="story-intro__meta">{story.length} событий · август — сентябрь 2026</p>
      </header>

      <div className="story-timeline" aria-label="Хронология истории">
        <div className="story-timeline__line" aria-hidden="true" />
        {story.map((event, index) => <StoryEvent key={event.id} event={event} index={index} />)}
      </div>

      <div className="story-end scene__content">
        <p className="eyebrow">Продолжение следует</p>
        <Button onClick={onContinue}>Продолжить</Button>
      </div>
    </section>
  )
}

export default StoryScene
