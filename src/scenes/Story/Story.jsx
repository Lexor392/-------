function StoryScene() {
  return <PlaceholderScene title="История" text="Здесь появится история." />
}

function PlaceholderScene({ title, text }) {
  return <section className="scene scene--placeholder" aria-labelledby="placeholder-title"><div className="scene__content"><p className="eyebrow">Следующая глава</p><h1 id="placeholder-title">{title}</h1><p className="scene__lead">{text}</p></div></section>
}

export default StoryScene
