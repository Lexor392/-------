const PARTICLES = Array.from({ length: 10 }, (_, index) => index)

function CinematicBackground() {
  return (
    <div className="cinematic-background" aria-hidden="true">
      <div className="cinematic-background__glow cinematic-background__glow--top" />
      <div className="cinematic-background__glow cinematic-background__glow--bottom" />
      <div className="cinematic-background__grain" />
      <div className="cinematic-background__particles">
        {PARTICLES.map((particle) => <span key={particle} />)}
      </div>
    </div>
  )
}

export default CinematicBackground
