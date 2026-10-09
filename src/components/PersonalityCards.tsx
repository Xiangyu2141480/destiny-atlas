import { useState, type CSSProperties } from 'react'
import { MBTI_TYPES, type Mbti } from '../types'

const palettes = {
  NT: { ink: '#8571d9', glow: '#c7baff', name: '分析家' },
  NF: { ink: '#39a879', glow: '#a9e8cb', name: '外交家' },
  SJ: { ink: '#4d91c9', glow: '#b7dcf6', name: '守护者' },
  SP: { ink: '#d79736', glow: '#f4d79d', name: '探险家' },
}

function groupOf(type: Mbti) {
  return (type[1] === 'N' ? `${type[1]}${type[2]}` : `${type[1]}${type[3]}`) as keyof typeof palettes
}

function Sigil({ type }: { type: Mbti }) {
  const palette = palettes[groupOf(type)]
  const introverted = type[0] === 'I'
  const judging = type[3] === 'J'
  return (
    <svg viewBox="0 0 160 104" role="img" aria-label={`${type} 原创星图符印`}>
      <defs>
        <linearGradient id={`personality-${type}`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={palette.glow} stopOpacity=".92" />
          <stop offset="1" stopColor={palette.ink} stopOpacity=".35" />
        </linearGradient>
      </defs>
      <path className="sigil-orbit" d={introverted ? 'M25 76Q80 8 135 76' : 'M18 58Q80 5 142 58Q80 111 18 58'} />
      <path className="sigil-axis" d={judging ? 'M80 17V87M46 52H114' : 'M43 82L80 18L117 82M31 59H129'} />
      <circle className="sigil-core" cx="80" cy="52" r={type[1] === 'N' ? 12 : 8} fill={`url(#personality-${type})`} />
      <circle cx={introverted ? 47 : 35} cy={judging ? 52 : 70} r="3" fill={palette.glow} />
      <circle cx={introverted ? 113 : 125} cy={judging ? 52 : 35} r="3" fill={palette.glow} />
      <path className="sigil-spark" d={type[2] === 'T' ? 'M80 34l4 14 14 4-14 4-4 14-4-14-14-4 14-4z' : 'M80 66C58 52 67 35 80 46c13-11 22 6 0 20z'} />
    </svg>
  )
}

export function PersonalityCards({ selected }: { selected: Mbti }) {
  const [previewed, setPreviewed] = useState<Mbti>(selected)
  const previewGroup = groupOf(previewed)
  const previewPalette = palettes[previewGroup]
  const imagePath = (type: Mbti) => `${import.meta.env.BASE_URL}assets/mbti/${type.toLowerCase()}.webp`

  return (
    <div className="personality-gallery" aria-label="原创四色 MBTI 16 人格插画">
      <div className="personality-gallery-heading">
        <div><b>16 型人格插画图鉴</b><small>点击卡片可预览，标有 NATAL 的卡片是你的本命人格</small></div>
        {previewed !== selected && <button type="button" onClick={() => setPreviewed(selected)}>返回本命 {selected}</button>}
      </div>
      <figure
        className="personality-feature"
        style={{ '--personality-color': previewPalette.ink, '--personality-glow': previewPalette.glow } as CSSProperties}
      >
        <img src={imagePath(previewed)} alt={`${previewed} ${previewPalette.name}原创星象人格插画`} decoding="async" />
        <span className="personality-feature-sigil" aria-hidden="true"><Sigil type={previewed} /></span>
        <figcaption aria-live="polite">
          <span>{previewPalette.name} · ARCANE PERSONA</span>
          <strong>{previewed}</strong>
          <small>{previewed === selected ? '你的本命人格' : `正在预览 · 本命人格 ${selected}`}</small>
        </figcaption>
      </figure>
      <div className="personality-atlas" aria-label="选择要预览的人格插画">
        {MBTI_TYPES.map((type) => {
          const group = groupOf(type)
          const palette = palettes[group]
          return (
            <button
              type="button"
              className={`personality-card ${type === selected ? 'is-selected' : ''} ${type === previewed ? 'is-previewed' : ''}`}
              key={type}
              aria-label={`预览 ${type} ${palette.name}插画`}
              aria-pressed={type === previewed}
              onClick={() => setPreviewed(type)}
              style={{ '--personality-color': palette.ink, '--personality-glow': palette.glow } as CSSProperties}
            >
              <img src={imagePath(type)} alt="" loading="lazy" />
              <span className="personality-card-sigil" aria-hidden="true"><Sigil type={type} /></span>
              <span className="personality-card-label"><b>{type}</b><small>{palette.name}</small></span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
