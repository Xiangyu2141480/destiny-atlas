import { describe, expect, it } from 'vitest'
import { generateDestinyReport, birthInputSchema } from '../src/engines/report'

const sample = { date: '2002-10-03', time: '02:00', placeId: 'guangzhou', mbti: 'ENFJ' as const, startMonth: '2026-10' }
const now = new Date('2026-10-09T12:00:00Z')

describe('detailed monthly and yearly readings', () => {
  it('provides five complete calendar years even when the monthly view begins in October', () => {
    const report = generateDestinyReport(sample, now)
    expect(report.yearlyTimeline.map((year) => year.year)).toEqual([2026, 2027, 2028, 2029, 2030])
    expect(report.yearlyTimeline.map((year) => year.personalYear)).toEqual([5, 6, 7, 8, 9])
    expect(report.yearlyTimeline[0].tarot.number).toBe(14)
    expect(report.yearlyTimeline[1].tarot.number).toBe(6)
    for (const year of report.yearlyTimeline) {
      expect(year.quarters).toHaveLength(4)
      expect(year.quarters.flatMap((quarter) => quarter.months).map((month) => month.month)).toEqual(
        Array.from({ length: 12 }, (_, i) => `${year.year}-${String(i + 1).padStart(2, '0')}`),
      )
    }
    expect(report.timeline).toHaveLength(24)
    expect(report.timeline[0].month).toBe('2026-10')
    expect(report.timeline[23].month).toBe('2028-09')
  })

  it('explains each area with actions, a caution and traceable period evidence', () => {
    const report = generateDestinyReport(sample, now)
    const reading = report.timeline[0].reading
    expect(reading.basis.join(' ')).toContain('个人月 6')
    for (const focus of ['career', 'finance', 'relationships', 'growth', 'balance'] as const) {
      expect(reading.domains[focus].actions).toHaveLength(3)
      expect(reading.domains[focus].meaning.length).toBeGreaterThan(20)
      expect(reading.domains[focus].watchOut.length).toBeGreaterThan(10)
    }
    expect(reading.domains.career.actions).not.toEqual(reading.domains.finance.actions)
    expect(report.explanation.highlights.length).toBeGreaterThanOrEqual(4)
    expect(report.explanation.highlights.every((item) => item.basis && item.action)).toBe(true)
  })

  it('uses the supplied clock for both default period views instead of the machine clock', () => {
    const withoutStart = { ...sample, startMonth: undefined }
    const report = generateDestinyReport(withoutStart, new Date('2027-12-31T23:30:00Z'))
    expect(report.timeline[0].month).toBe('2027-12')
    expect(report.yearlyTimeline[0].year).toBe(2027)
    expect(report.generatedAt).toBe('2027-12-31T23:30:00.000Z')
  })

  it('rejects invalid month values rather than silently changing the requested period', () => {
    for (const startMonth of ['2026-00', '2026-13']) {
      expect(birthInputSchema.safeParse({ ...sample, startMonth }).success).toBe(false)
    }
  })
})
