import ChapterScene from '../../components/ChapterScene/ChapterScene.jsx'

function LetterScene({ onContinue }) {
  return <ChapterScene id="letter" kicker="Пятая глава" title="Письмо" description="Здесь появится письмо — не для всех, а только для одного человека." onContinue={onContinue} nextLabel="Дальше" />
}

export default LetterScene
