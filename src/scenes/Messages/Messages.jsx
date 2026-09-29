import AnimatedLetters from '../../components/AnimatedLetters/AnimatedLetters.jsx'

function MessagesScene() {
  return <section className="scene scene--placeholder" aria-labelledby="messages-title"><div className="scene__content"><p className="eyebrow">Следующая глава</p><h1 id="messages-title"><AnimatedLetters text="Сообщения" /></h1><p className="scene__lead"><AnimatedLetters text="Раздел готовится." /></p></div></section>
}

export default MessagesScene
