import { Body, Ecliptic, GeoVector } from 'astronomy-engine'
import type { Aspect, AstrologyResult, PlanetPosition } from '../../types'

const signs = ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座']
const bodies: Array<[string, Body]> = [
  ['太阳', Body.Sun], ['月亮', Body.Moon], ['水星', Body.Mercury], ['金星', Body.Venus],
  ['火星', Body.Mars], ['木星', Body.Jupiter], ['土星', Body.Saturn], ['天王星', Body.Uranus],
  ['海王星', Body.Neptune], ['冥王星', Body.Pluto],
]
const aspectAngles = [
  { type: '合相', angle: 0, orb: 8 },
  { type: '六分相', angle: 60, orb: 4 },
  { type: '四分相', angle: 90, orb: 6 },
  { type: '三分相', angle: 120, orb: 6 },
  { type: '对分相', angle: 180, orb: 8 },
]

export function longitude(body: Body, date: Date): number {
  return Ecliptic(GeoVector(body, date, true)).elon
}

export function angularDistance(a: number, b: number): number {
  const distance = Math.abs(a - b) % 360
  return distance > 180 ? 360 - distance : distance
}

export function calculateAstrology(utcIso: string): AstrologyResult {
  const date = new Date(utcIso)
  const positions: PlanetPosition[] = bodies.map(([name, body]) => {
    const value = longitude(body, date)
    return {
      body: name,
      longitude: Number(value.toFixed(4)),
      sign: signs[Math.floor(value / 30)],
      degreeInSign: Number((value % 30).toFixed(2)),
    }
  })
  const aspects: Aspect[] = []
  for (let i = 0; i < positions.length; i += 1) {
    for (let j = i + 1; j < positions.length; j += 1) {
      const distance = angularDistance(positions[i].longitude, positions[j].longitude)
      const match = aspectAngles.find((item) => Math.abs(distance - item.angle) <= item.orb)
      if (match) {
        aspects.push({
          bodies: [positions[i].body, positions[j].body],
          type: match.type,
          angle: match.angle,
          orb: Number(Math.abs(distance - match.angle).toFixed(2)),
        })
      }
    }
  }
  return {
    zodiac: 'Tropical',
    positions,
    aspects,
    source: 'Astronomy Engine 2.1.19；地心视黄经，光行时修正；主要相位采用项目文档所列容许度',
    unavailable: ['上升点、MC与宫位尚未完成独立验证，本MVP不展示', '行运仅作月初采样，不声称精确发生时刻'],
  }
}

export function monthlyTransitNote(date: Date, natal: AstrologyResult): string {
  const natalSun = natal.positions.find((position) => position.body === '太阳')!.longitude
  const candidates: Array<[string, Body]> = [['木星', Body.Jupiter], ['土星', Body.Saturn]]
  for (const [name, body] of candidates) {
    const value = longitude(body, date)
    const distance = angularDistance(value, natalSun)
    const match = aspectAngles.find((item) => Math.abs(distance - item.angle) <= 2)
    if (match) {
      return `${name} ${value.toFixed(2)}° 与本命太阳 ${natalSun.toFixed(2)}° 形成${match.type}，月初采样容许度 ${Math.abs(distance - match.angle).toFixed(2)}°`
    }
  }
  return '月初采样未发现木星/土星与本命太阳在 2° 容许度内的主要相位'
}
