function ProgressIndicator({ currentScene, scenes }) {
  const currentIndex = scenes.indexOf(currentScene)
  const progress = currentIndex < 0 ? 0 : ((currentIndex + 1) / scenes.length) * 100

  return (
    <div className="progress-indicator" aria-label={`Раздел ${currentIndex + 1} из ${scenes.length}`}>
      <span className="progress-indicator__current">{String(currentIndex + 1).padStart(2, '0')}</span>
      <span className="progress-indicator__line" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </span>
      <span className="progress-indicator__total">{String(scenes.length).padStart(2, '0')}</span>
    </div>
  )
}

export default ProgressIndicator
