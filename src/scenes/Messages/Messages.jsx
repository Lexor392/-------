import ChapterScene from '../../components/ChapterScene/ChapterScene.jsx'

function MessagesScene({ onContinue }) {
  return <ChapterScene id="messages" kicker="Четвёртая глава" title="Сообщения" description="Здесь появятся короткие слова, которые хочется сохранить." onContinue={onContinue} />
}

export default MessagesScene
