import { useState } from 'react'
import type { AstrologyResult } from '../types'

export function NatalChart({ data }: { data: AstrologyResult }) {
  const center = 150
  const radius = 112
  const [selected, setSelected] = useState(data.positions[0]?.body ?? '')
  const active = data.positions.find((planet) => planet.body === selected)
  return (
    <div className="chart-shell">
      <svg className="natal-chart" viewBox="0 0 300 300" role="img" aria-label="可交互本命行星黄经圆盘">
        <defs>
          <radialGradient id="chart-glow">
            <stop stopColor="#cba7ff" stopOpacity=".28" />
            <stop offset="1" stopColor="#0a0b16" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={center} cy={center} r="142" className="chart-aura" />
        <circle cx={center} cy={center} r="131" className="orbit outer" />
        <circle cx={center} cy={center} r={radius} className="orbit zodiac" />
        <circle cx={center} cy={center} r={74} className="orbit inner" />
        <circle cx={center} cy={center} r="40" fill="url(#chart-glow)" />
        {Array.from({ length: 36 }, (_, index) => {
          const angle = (index * 10 - 90) * Math.PI / 180
          const innerRadius = index % 3 === 0 ? 112 : 120
          return <line className="tick" key={index} x1={center + innerRadius * Math.cos(angle)} y1={center + innerRadius * Math.sin(angle)} x2={center + 131 * Math.cos(angle)} y2={center + 131 * Math.sin(angle)} />
        })}
        {Array.from({ length: 12 }, (_, index) => {
          const angle = (index * 30 - 90) * Math.PI / 180
          const textRadius = 101
          return <g key={index}>
            <line x1={center + 74 * Math.cos(angle)} y1={center + 74 * Math.sin(angle)} x2={center + radius * Math.cos(angle)} y2={center + radius * Math.sin(angle)} />
            <text className="zodiac-label" x={center + textRadius * Math.cos(angle + Math.PI / 12)} y={center + textRadius * Math.sin(angle + Math.PI / 12) + 2}>{index + 1}</text>
          </g>
        })}
        {data.aspects.slice(0, 12).map((aspect) => {
          const first = data.positions.find((planet) => planet.body === aspect.bodies[0])
          const second = data.positions.find((planet) => planet.body === aspect.bodies[1])
          if (!first || !second) return null
          const a = (first.longitude - 90) * Math.PI / 180
          const b = (second.longitude - 90) * Math.PI / 180
          return <line className="aspect-line" key={aspect.bodies.join()} x1={center + 70 * Math.cos(a)} y1={center + 70 * Math.sin(a)} x2={center + 70 * Math.cos(b)} y2={center + 70 * Math.sin(b)} />
        })}
        {data.positions.map((planet, index) => {
          const angle = (planet.longitude - 90) * Math.PI / 180
          const r = radius - 18 - (index % 2) * 13
          const x = center + r * Math.cos(angle)
          const y = center + r * Math.sin(angle)
          return (
            <g key={planet.body} className={`planet-node ${selected === planet.body ? 'selected' : ''}`} role="button" tabIndex={0}
              aria-label={`${planet.body} ${planet.sign} ${planet.degreeInSign.toFixed(2)}度`}
              onClick={() => setSelected(planet.body)}
              onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') setSelected(planet.body) }}>
              <circle cx={x} cy={y} r="10" className="planet-halo" />
              <circle cx={x} cy={y} r="5" className="planet" />
              <text x={x} y={y + 2.5}>{planet.body[0]}</text>
            </g>
          )
        })}
        <circle cx={center} cy={center} r="2.5" className="chart-center" />
      </svg>
      {active && <div className="chart-readout" aria-live="polite"><span>{active.body}</span><strong>{active.sign} {active.degreeInSign.toFixed(2)}°</strong><small>黄经 {active.longitude.toFixed(4)}°</small></div>}
    </div>
  )
}
