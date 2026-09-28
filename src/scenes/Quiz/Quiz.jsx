import ChapterScene from '../../components/ChapterScene/ChapterScene.jsx'

function QuizScene({ onContinue }) {
  return <ChapterScene id="quiz" kicker="Третья глава" title="Небольшая игра" description="Здесь появятся вопросы, на которые хочется отвечать." onContinue={onContinue} nextLabel="Продолжить игру" />
}

export default QuizScene
