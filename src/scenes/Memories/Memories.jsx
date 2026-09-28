import ChapterScene from '../../components/ChapterScene/ChapterScene.jsx'

function MemoriesScene({ onContinue }) {
  return <ChapterScene id="memories" kicker="Вторая глава" title="Воспоминания" description="Здесь появятся моменты, к которым можно возвращаться." onContinue={onContinue} />
}

export default MemoriesScene
