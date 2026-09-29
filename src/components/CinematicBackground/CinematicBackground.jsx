import Icon from '../Icon/Icon.jsx'

const PARTICLES = Array.from({ length: 10 }, (_, index) => index)
const HEART_FIELD = [
  [8, 18, 0.58, -3.5],
  [22, 72, 0.38, -6],
  [34, 28, 0.7, -8.5],
  [48, 84, 0.42, -4],
  [62, 17, 0.5, -10],
  [76, 62, 0.66, -7],
  [90, 28, 0.36, -2],
  [14, 91, 0.44, -9],
  [87, 88, 0.52, -5.5],
]

function CinematicBackground() {
  return (
    <div className="cinematic-background" aria-hidden="true">
      <div className="cinematic-background__glow cinematic-background__glow--top" />
      <div className="cinematic-background__glow cinematic-background__glow--bottom" />
      <div className="cinematic-background__grain" />
      <div className="cinematic-background__heart-field">
        {HEART_FIELD.map(([left, top, scale, delay], index) => (
          <span
            key={index}
            style={{ '--heart-left': `${left}%`, '--heart-top': `${top}%`, '--heart-scale': scale, '--heart-delay': `${delay}s` }}
          >
            <Icon name="heart-fill" library="bootstrap" />
          </span>
        ))}
      </div>
      <div className="cinematic-background__particles">
        {PARTICLES.map((particle) => <span key={particle} />)}
      </div>
    </div>
  )
}

export default CinematicBackground
