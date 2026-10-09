export const MBTI_TYPES = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP',
] as const

export type Mbti = (typeof MBTI_TYPES)[number]
export type Focus = 'career' | 'finance' | 'relationships' | 'growth' | 'balance'

export interface Place {
  id: string
  name: string
  country: string
  latitude: number
  longitude: number
  timezone: string
  source?: { provider: 'open-meteo'; id: number; license: 'CC BY-NC 4.0'; modified: boolean }
}

export interface BirthInput {
  name?: string
  date: string
  time: string
  placeId: string
  customPlace?: Place
  mbti: Mbti
  trueSolarTime?: boolean
  focus?: Focus
  startMonth?: string
}

export interface TimeResult {
  localIso: string
  utcIso: string
  timezone: string
  offsetMinutes: number
  calculationLocalIso: string
  trueSolarCorrectionMinutes?: number
  convention: string
}

export interface BaziPillar {
  label: string
  ganZhi: string
  stem: string
  branch: string
  hiddenStems: string[]
  naYin: string
}

export interface BaziResult {
  pillars: BaziPillar[]
  dayMaster: string
  zodiac: string
  lunarDate: string
  currentSolarTerm: string
  elements: Record<string, number>
  convention: string
}

export interface PlanetPosition {
  body: string
  longitude: number
  sign: string
  degreeInSign: number
}

export interface Aspect {
  bodies: [string, string]
  type: string
  angle: number
  orb: number
}

export interface AstrologyResult {
  zodiac: 'Tropical'
  positions: PlanetPosition[]
  aspects: Aspect[]
  source: string
  unavailable: string[]
}

export interface TarotCard {
  number: number
  name: string
  nameZh: string
  keywords: string[]
}

export interface NumerologyResult {
  lifePath: number
  birthdayNumber: number
  formula: string
  masterNumbers: number[]
}

export interface TimelineMonth {
  month: string
  personalYear: number
  personalMonth: number
  tarot: TarotCard
  baziMonth: string
  themes: string[]
  transitNote: string
  guidance: Record<Focus, string>
  reading: PeriodReading
}

export interface DestinyReport {
  schemaVersion: '1.1'
  engineVersion: string
  generatedAt: string
  input: BirthInput
  place: Place
  time: TimeResult
  numerology: NumerologyResult
  tarot: { birth: TarotCard; soul: TarotCard; yearly: Record<string, TarotCard> }
  bazi: BaziResult
  astrology: AstrologyResult
  personality: { type: Mbti; title: string; summary: string; strengths: string[]; cautions: string[] }
  timeline: TimelineMonth[]
  yearlyTimeline: TimelineYear[]
  explanation: ReportExplanation
  synthesis: { agreements: string[]; tensions: string[]; actions: string[] }
  limitations: string[]
}

export interface DomainReading {
  meaning: string
  actions: string[]
  watchOut: string
}

export interface PeriodReading {
  heading: string
  overview: string
  basis: string[]
  domains: Record<Focus, DomainReading>
}

export interface YearQuarter {
  label: string
  summary: string
  months: Array<{ month: string; personalMonth: number; themes: string[]; guidance: Record<Focus, string> }>
}

export interface TimelineYear {
  year: number
  personalYear: number
  tarot: TarotCard
  reading: PeriodReading
  quarters: YearQuarter[]
}

export interface ReportExplanation {
  introduction: string
  highlights: Array<{ title: string; meaning: string; basis: string; action: string }>
  firstSteps: string[]
}
