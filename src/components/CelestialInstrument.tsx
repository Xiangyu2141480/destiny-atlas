import { useState, type CSSProperties } from 'react'
import { CELESTIAL_BODIES } from '../data/celestialBodies'

const zodiac = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓']

export function CelestialInstrument() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [reflection, setReflection] = useState(false)
  const [pulse, setPulse] = useState(0)
  const active = CELESTIAL_BODIES[selectedIndex]
  return (
    <div className="celestial-instrument">
      <div className="celestial-stage">
        <div className="instrument-glow" aria-hidden="true" />
        <svg viewBox="0 0 400 400" aria-hidden="true">
          <defs>
            <radialGradient id="hero-core" cx="34%" cy="28%" r="75%">
              <stop stopColor="#fff0c5" /><stop offset=".35" stopColor="#d7b77b" /><stop offset=".74" stopColor="#776040" /><stop offset="1" stopColor="#1b1717" />
            </radialGradient>
            <radialGradient id="hero-aura"><stop stopColor="#c49b58" stopOpacity=".18" /><stop offset=".6" stopColor="#8b6aa5" stopOpacity=".05" /><stop offset="1" stopColor="#080a10" stopOpacity="0" /></radialGradient>
            <linearGradient id="hero-metal" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f3dfb0" /><stop offset=".35" stopColor="#aa8954" /><stop offset=".65" stopColor="#77627f" /><stop offset="1" stopColor="#d7b77b" /></linearGradient>
          </defs>
          <circle cx="200" cy="200" r="195" fill="url(#hero-aura)" />
          <g className="instrument-guide"><path d="M200 4V396M4 200H396M62 62L338 338M62 338L338 62" /><circle cx="200" cy="200" r="188" /><circle cx="200" cy="200" r="172" /><circle cx="200" cy="200" r="128" /></g>
          <g className="instrument-ring ring-one">
            <circle cx="200" cy="200" r="166" /><circle cx="200" cy="200" r="142" />
            {Array.from({ length: 120 }, (_, i) => <line key={i} x1="200" y1="34" x2="200" y2={i % 10 === 0 ? '46' : i % 5 === 0 ? '42' : '38'} transform={`rotate(${i * 3} 200 200)`} />)}
            {zodiac.map((sign, i) => <text className="instrument-zodiac" key={sign} x="200" y="62" transform={`rotate(${i * 30 + 15} 200 200)`}>{`${sign}\uFE0E`}</text>)}
          </g>
          <g className="instrument-ring ring-two"><ellipse cx="200" cy="200" rx="156" ry="65" transform="rotate(-30 200 200)" /><ellipse cx="200" cy="200" rx="156" ry="65" transform="rotate(60 200 200)" /><circle cx="65" cy="276" r="4" className="instrument-satellite" /><circle cx="278" cy="334" r="3" className="instrument-satellite" /></g>
          <g className="instrument-ring ring-three"><circle cx="200" cy="200" r="96" /><path d="M200 104L283 248H117ZM200 296L117 152H283Z" /><circle cx="200" cy="104" r="3" className="instrument-satellite" /></g>
          <g className="instrument-sunrays">{Array.from({ length: 24 }, (_, i) => <path key={i} d={i % 2 ? 'M200 147V142' : 'M200 147V135'} transform={`rotate(${i * 15} 200 200)`} />)}</g>
          <g className="orbiting-comet"><circle cx="200" cy="31" r="3" fill="#f7dfaa" /><path d="M151 38Q175 31 200 31" fill="none" stroke="#e5c899" strokeWidth="1.2" opacity=".5" /></g>
          <circle className="core-pulse" cx="200" cy="200" r="52" fill="none" stroke="#d7b77b" strokeWidth=".6" />
          <circle cx="200" cy="200" r="39" fill="url(#hero-core)" />
          <path d="M216 165a39 39 0 0 1 0 70 43 43 0 0 0 0-70" fill="#141116" fillOpacity=".85" />
          <ellipse cx="200" cy="200" rx="57" ry="14" transform="rotate(-30 200 200)" fill="none" stroke="#efdbab" strokeWidth=".8" strokeOpacity=".55" />
          <g className="instrument-cardinals"><text x="200" y="13">N</text><text x="390" y="203">E</text><text x="200" y="395">S</text><text x="10" y="203">W</text></g>
        </svg>
        <div className="wish-sparks" aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <i key={i} style={{ left: `${7 + (i * 23 % 87)}%`, top: `${5 + (i * 31 % 87)}%`, animationDelay: `${-i * .7}s` }}>✦</i>)}</div>
        <div className="instrument-planets" role="group" aria-label="探索十颗天体的文化象征">
          {CELESTIAL_BODIES.map((body, index) => {
            const angle = (index * 36 - 90) * Math.PI / 180
            return <button key={body.name} type="button" className="instrument-planet"
              style={{ left: `${50 + 34 * Math.cos(angle)}%`, top: `${50 + 34 * Math.sin(angle)}%`, '--float-delay': `${-index * .5}s` } as CSSProperties}
              aria-label={`探索${body.name}`} aria-pressed={selectedIndex === index}
              onClick={() => { setSelectedIndex(index); setReflection(false); setPulse((value) => value + 1) }}>
              <span aria-hidden="true">{body.symbol}</span><small>{body.name}</small>
            </button>
          })}
        </div>
        <button className={`instrument-core ${reflection ? 'is-reflecting' : ''}`} type="button" aria-label={`观照${active.name}：切换思考提示`} aria-pressed={reflection} onClick={() => { setReflection((value) => !value); setPulse((value) => value + 1) }}><span>轻触 · 观照</span></button>
        {pulse > 0 && <div key={pulse} className="selection-ripple" aria-hidden="true" />}
      </div>
      <div className="instrument-reading" aria-live="polite" aria-atomic="true">
        <p className="eyebrow">{String(selectedIndex + 1).padStart(2, '0')} / {active.english}</p>
        <h3><span aria-hidden="true">{active.symbol}</span> {active.name}<small>{active.theme}</small></h3>
        <p>{reflection ? active.question : active.note}</p>
        <span className="instrument-disclaimer">点击星体探索 · 象征示意，非实时星盘</span>
      </div>

    </div>
  )
}
