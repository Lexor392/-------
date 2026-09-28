import ChapterScene from '../../components/ChapterScene/ChapterScene.jsx'

function StoryScene({ onContinue }) {
  return <ChapterScene id="story" kicker="Первая глава" title="История" description="Здесь появится история, которую хочется перечитать." onContinue={onContinue} />
}

export default StoryScene
