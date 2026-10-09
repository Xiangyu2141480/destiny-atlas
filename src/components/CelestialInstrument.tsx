const constellations = [
  'M28 92 L74 51 L111 71 L151 35 L193 73 L236 46 L274 88',
  'M41 183 L88 145 L126 171 L166 129 L209 158 L263 121',
]

export function CelestialInstrument() {
  return (
    <div className="celestial-instrument" aria-hidden="true">
      <div className="instrument-glow" />
      <svg viewBox="0 0 320 320">
        <defs>
          <radialGradient id="hero-core">
            <stop offset="0" stopColor="#f3d99c" stopOpacity=".95" />
            <stop offset=".25" stopColor="#bf8cff" stopOpacity=".32" />
            <stop offset="1" stopColor="#080914" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hero-metal" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#f4dca5" />
            <stop offset=".5" stopColor="#8e6fc9" />
            <stop offset="1" stopColor="#c8a86b" />
          </linearGradient>
        </defs>
        <circle cx="160" cy="160" r="151" className="instrument-halo" />
        <g className="instrument-stars">
          {constellations.map((path) => <path key={path} d={path} />)}
          {[['28', '92'], ['74', '51'], ['111', '71'], ['151', '35'], ['193', '73'], ['236', '46'], ['274', '88'],
            ['41', '183'], ['88', '145'], ['126', '171'], ['166', '129'], ['209', '158'], ['263', '121']].map(([x, y]) =>
            <circle key={`${x}-${y}`} cx={x} cy={y} r="1.8" />,
          )}
        </g>
        <g className="instrument-ring ring-one">
          <circle cx="160" cy="160" r="116" />
          {Array.from({ length: 24 }, (_, index) => (
            <line key={index} x1="160" y1="35" x2="160" y2="43" transform={`rotate(${index * 15} 160 160)`} />
          ))}
        </g>
        <g className="instrument-ring ring-two">
          <ellipse cx="160" cy="160" rx="136" ry="58" />
          <ellipse cx="160" cy="160" rx="58" ry="136" />
        </g>
        <g className="instrument-ring ring-three">
          <circle cx="160" cy="160" r="83" />
          <path d="M77 160H243M160 77V243" />
          <path d="M101 101L219 219M219 101L101 219" />
        </g>
        <circle cx="160" cy="160" r="62" fill="url(#hero-core)" />
        <path className="crescent" d="M180 105a58 58 0 1 0 0 110 49 49 0 1 1 0-110Z" />
        <g className="instrument-axis">
          <path d="M53 250C93 279 226 281 269 222" />
          <circle cx="53" cy="250" r="4" />
          <circle cx="269" cy="222" r="4" />
        </g>
      </svg>
      <span className="instrument-label label-a">CELESTIAL LONGITUDE</span>
      <span className="instrument-label label-b">LOCAL SKY · 23.1°</span>
    </div>
  )
}
