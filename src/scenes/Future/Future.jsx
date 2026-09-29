import AnimatedLetters from '../../components/AnimatedLetters/AnimatedLetters.jsx'

function FutureScene() {
  return <section className="scene scene--placeholder" aria-labelledby="future-title"><div className="scene__content"><p className="eyebrow">Следующая глава</p><h1 id="future-title"><AnimatedLetters text="Вперёд" /></h1><p className="scene__lead"><AnimatedLetters text="Раздел готовится." /></p></div></section>
}

export default FutureScene
