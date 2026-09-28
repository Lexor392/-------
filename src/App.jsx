import { useRef, useState } from 'react'
import Button from './components/Button/Button.jsx'
import CinematicBackground from './components/CinematicBackground/CinematicBackground.jsx'
import MusicPlayer from './components/MusicPlayer/MusicPlayer.jsx'
import PageTransition from './components/PageTransition/PageTransition.jsx'
import ProgressIndicator from './components/ProgressIndicator/ProgressIndicator.jsx'
import IntroScene from './scenes/Intro/Intro.jsx'
import WelcomeScene from './scenes/Welcome/Welcome.jsx'
import StoryScene from './scenes/Story/Story.jsx'
import MemoriesScene from './scenes/Memories/Memories.jsx'
import QuizScene from './scenes/Quiz/Quiz.jsx'
import MessagesScene from './scenes/Messages/Messages.jsx'
import LetterScene from './scenes/Letter/Letter.jsx'
import FutureScene from './scenes/Future/Future.jsx'
import FinaleScene from './scenes/Finale/Finale.jsx'

export const SCENES = ['intro', 'welcome', 'story', 'memories', 'quiz', 'messages', 'letter', 'future', 'finale']
const NEXT_SCENE = Object.fromEntries(SCENES.slice(0, -1).map((scene, index) => [scene, SCENES[index + 1]]))

function App() {
  const [currentScene, setCurrentScene] = useState('intro')
  const transitionLock = useRef(false)

  const goToScene = (scene) => {
    if (!SCENES.includes(scene) || scene === currentScene || transitionLock.current) return

    transitionLock.current = true
    setCurrentScene(scene)
    window.setTimeout(() => {
      transitionLock.current = false
    }, 700)
  }

  const continueCurrentScene = () => goToScene(NEXT_SCENE[currentScene])

  const renderScene = () => {
    switch (currentScene) {
      case 'intro':
        return <IntroScene onContinue={() => goToScene('welcome')} />
      case 'welcome':
        return <WelcomeScene onContinue={() => goToScene('story')} />
      case 'story':
        return <StoryScene onContinue={continueCurrentScene} />
      case 'memories':
        return <MemoriesScene onContinue={continueCurrentScene} />
      case 'quiz':
        return <QuizScene onContinue={continueCurrentScene} />
      case 'messages':
        return <MessagesScene onContinue={continueCurrentScene} />
      case 'letter':
        return <LetterScene onContinue={continueCurrentScene} />
      case 'future':
        return <FutureScene onContinue={continueCurrentScene} />
      case 'finale':
        return <FinaleScene />
      default:
        return <IntroScene onContinue={() => goToScene('welcome')} />
    }
  }

  return (
    <main className="app-shell">
      <CinematicBackground />
      <PageTransition sceneKey={currentScene}>
        <>
          <header className="app-header">
            <ProgressIndicator currentScene={currentScene} scenes={SCENES} />
            <MusicPlayer />
          </header>
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
