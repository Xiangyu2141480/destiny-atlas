import { describe, expect, it } from 'vitest'
import { calculateTime } from '../src/engines/datetime'
import { calculateNumerology, reduceNumber } from '../src/engines/numerology'
import { yearCard } from '../src/engines/tarot'
import { birthInputSchema, generateDestinyReport } from '../src/engines/report'
import { getPlace, PLACES } from '../src/data/places'
import { personalityProfile } from '../src/engines/personality'
import { MBTI_TYPES } from '../src/types'

const sample = { date: '2002-10-03', time: '02:00', placeId: 'guangzhou', mbti: 'ENFJ' as const }

describe('numerology', () => {
  it('calculates the public sample life path', () => {
    expect(calculateNumerology('2002-10-03').lifePath).toBe(8)
  })
  it('preserves master numbers', () => {
    expect(reduceNumber(29)).toBe(11)
    expect(reduceNumber(38)).toBe(11)
  })
})

describe('tarot project convention', () => {
  it.each([[2026, 14, 'Temperance'], [2027, 6, 'The Lovers'], [2028, 7, 'The Chariot']])(
    '%i maps to card %i',
    (year, number, name) => {
      expect(yearCard(sample.date, year)).toMatchObject({ number, name })
    },
  )
})

describe('timezone and validation', () => {
  it('includes all mainland provincial capitals and municipalities', () => {
    expect(PLACES.length).toBeGreaterThanOrEqual(40)
    expect(['beijing', 'tianjin', 'shanghai', 'chongqing', 'urumqi'].every((id) => PLACES.some((place) => place.id === id))).toBe(true)
  })
  it('converts a cross-zone instant using IANA rules', () => {
    const result = calculateTime({ ...sample, placeId: 'new-york' }, getPlace('new-york'))
    expect(result.timezone).toBe('America/New_York')
    expect(result.utcIso).toContain('06:00:00')
  })
  it('rejects a nonexistent DST wall time', () => {
    expect(() => calculateTime(
      { ...sample, date: '2024-03-10', time: '02:30', placeId: 'new-york' },
      getPlace('new-york'),
    )).toThrow('NONEXISTENT_LOCAL_TIME')
  })
  it('validates leap years, invalid dates and MBTI', () => {
    expect(birthInputSchema.safeParse({ ...sample, date: '2024-02-29' }).success).toBe(true)
    expect(birthInputSchema.safeParse({ ...sample, date: '2023-02-29' }).success).toBe(false)
    expect(birthInputSchema.safeParse({ ...sample, mbti: 'XXXX' }).success).toBe(false)
  })
  it('validates and uses a custom IANA location deterministically', () => {
    const custom = {
      id: 'custom' as const,
      name: '测试城',
      country: '自定义地点',
      latitude: 35,
      longitude: 140,
      timezone: 'Asia/Tokyo',
    }
    const report = generateDestinyReport({ ...sample, placeId: 'custom', customPlace: custom, startMonth: '2026-01' }, new Date('2026-01-01T00:00:00Z'))
    expect(report.place).toEqual(custom)
    expect(report.time.utcIso).toContain('17:00:00')
    expect(() => generateDestinyReport({ ...sample, placeId: 'custom', customPlace: { ...custom, timezone: 'Invalid/Zone' } })).toThrow()
  })
})

describe('integrated deterministic report', () => {
  it('resolves a profile for all 16 MBTI types', () => {
    expect(MBTI_TYPES.map((type) => personalityProfile(type).title)).toHaveLength(16)
  })
  it('generates 24 months with traceable modules', () => {
    const report = generateDestinyReport({ ...sample, startMonth: '2026-01' }, new Date('2026-01-01T00:00:00Z'))
    expect(report.timeline).toHaveLength(24)
    expect(report.bazi.pillars).toHaveLength(4)
    expect(report.astrology.positions).toHaveLength(10)
    expect(report.timeline[0].month).toBe('2026-01')
  })
})
