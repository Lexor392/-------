import { useEffect, useRef, useState } from 'react'
import Icon from '../Icon/Icon.jsx'

function MusicPlayer({ startSignal = '' }) {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return undefined

    audio.volume = 0.25
    audio.muted = false
    audio.loop = true

    const startMusic = () => {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => {})
    }

    const unlockMusic = () => {
      startMusic()
      window.removeEventListener('pointerdown', unlockMusic)
      window.removeEventListener('keydown', unlockMusic)
    }

    startMusic()
    window.addEventListener('pointerdown', unlockMusic, { once: true })
    window.addEventListener('keydown', unlockMusic, { once: true })

    return () => {
      window.removeEventListener('pointerdown', unlockMusic)
      window.removeEventListener('keydown', unlockMusic)
      audio.pause()
    }
  }, [])

  useEffect(() => {
    if (!startSignal) return undefined

    const audio = audioRef.current
    if (!audio) return undefined

    audio.play()
      .then(() => setIsPlaying(true))
      .catch(() => {})

    return undefined
  }, [startSignal])

  const toggleSound = () => {
    const audio = audioRef.current
    if (!audio) return

    if (!isPlaying) {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => {})
      return
    }

    audio.muted = !isMuted
    setIsMuted((muted) => !muted)
  }

  const soundIcon = !isPlaying || isMuted ? 'volume_off' : 'volume_up'
  const soundLabel = !isPlaying || isMuted ? 'Включить музыку' : 'Выключить звук'

  return (
    <div className={`music-player${isPlaying && !isMuted ? ' is-playing' : ''}`}>
      <audio ref={audioRef} src="/sound/sleep-lofi-radio.mp3" preload="auto" autoPlay loop />
      <span className="music-player__status" aria-hidden="true" />
      <span className="music-player__label">Sleep lofi</span>
      <button
        className="music-player__toggle"
        type="button"
        onClick={toggleSound}
        aria-label={soundLabel}
        title={soundLabel}
      >
        <Icon name={soundIcon} />
      </button>
    </div>
  )
}

export default MusicPlayer
