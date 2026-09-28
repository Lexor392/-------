function MusicPlayer() {
  return (
    <div className="music-player" aria-label="Музыка пока недоступна" title="Музыка появится позже">
      <span className="music-player__dot" aria-hidden="true" />
      <span className="music-player__label">Тишина</span>
    </div>
  )
}

export default MusicPlayer
