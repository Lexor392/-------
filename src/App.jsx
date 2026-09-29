import { useEffect, useRef, useState } from 'react'
import Button from './components/Button/Button.jsx'
import CinematicBackground from './components/CinematicBackground/CinematicBackground.jsx'
import CursorEffects from './components/CursorEffects/CursorEffects.jsx'
import MusicPlayer from './components/MusicPlayer/MusicPlayer.jsx'
import PageTransition from './components/PageTransition/PageTransition.jsx'
import ProgressIndicator from './components/ProgressIndicator/ProgressIndicator.jsx'
import IntroScene from './scenes/Intro/Intro.jsx'
import WelcomeScene from './scenes/Welcome/Welcome.jsx'
import StoryScene from './scenes/Story/Story.jsx'
import QuizScene from './scenes/Quiz/Quiz.jsx'
import MessagesScene from './scenes/Messages/Messages.jsx'
import LetterScene from './scenes/Letter/Letter.jsx'
import FutureScene from './scenes/Future/Future.jsx'
import FinaleScene from './scenes/Finale/Finale.jsx'

export const SCENES = ['intro', 'welcome', 'story', 'quiz', 'messages', 'letter', 'future', 'finale']

function App() {
  const [currentScene, setCurrentScene] = useState('intro')
  const transitionLock = useRef(false)

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [currentScene])

  const goToScene = (scene) => {
    if (!SCENES.includes(scene) || scene === currentScene || transitionLock.current) return

    transitionLock.current = true
    setCurrentScene(scene)
    window.setTimeout(() => {
      transitionLock.current = false
    }, 700)
  }

  const renderScene = () => {
    switch (currentScene) {
      case 'intro':
        return <IntroScene onContinue={() => goToScene('welcome')} />
      case 'welcome':
        return <WelcomeScene onContinue={() => goToScene('story')} />
      case 'story':
        return <StoryScene onContinue={() => goToScene('quiz')} />
      case 'quiz':
        return <QuizScene onBack={() => goToScene('story')} onContinue={() => goToScene('messages')} />
      case 'messages':
        return <MessagesScene />
      case 'letter':
        return <LetterScene />
      case 'future':
        return <FutureScene />
      case 'finale':
        return <FinaleScene />
      default:
        return <IntroScene onContinue={() => goToScene('welcome')} />
    }
  }

  return (
    <main className="app-shell">
      <CinematicBackground />
      <CursorEffects />
      <header className="app-header">
        <ProgressIndicator currentScene={currentScene} scenes={SCENES} />
        <MusicPlayer />
      </header>
      <PageTransition sceneKey={currentScene}>
        <>
          {renderScene()}
          {currentScene !== 'intro' && currentScene !== 'welcome' && (
            <nav className="scene-nav" aria-label="Навигация по разделам">
              <Button variant="text" onClick={() => goToScene('welcome')}>В начало</Button>
            </nav>
          )}
        </>
      </PageTransition>
    </main>
  )
}

export default App
