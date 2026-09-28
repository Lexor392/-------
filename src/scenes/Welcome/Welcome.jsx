import Button from '../../components/Button/Button.jsx'

function WelcomeScene({ onContinue }) {
  return (
    <section className="scene scene--welcome" aria-labelledby="welcome-title">
      <div className="scene__content welcome-content">
        <p className="eyebrow">Для одного особенного человека</p>
        <h1 id="welcome-title">У тебя есть один подарок.</h1>
        <p className="scene__lead">Но он немного необычный.</p>
        <div className="scene__action">
          <Button onClick={onContinue}>Открыть подарок</Button>
        </div>
      </div>
      <div className="welcome-mark" aria-hidden="true"><span /></div>
    </section>
  )
}

export default WelcomeScene
