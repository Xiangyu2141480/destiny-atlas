import type { NumerologyResult } from '../../types'

export const MASTER_NUMBERS = [11, 22, 33]

export function reduceNumber(value: number, preserveMasters = true): number {
  let current = Math.abs(Math.trunc(value))
  while (current > 9 && !(preserveMasters && MASTER_NUMBERS.includes(current))) {
    current = String(current).split('').reduce((sum, digit) => sum + Number(digit), 0)
  }
  return current
}

export function digitSum(value: string): number {
  return value.replace(/\D/g, '').split('').reduce((sum, digit) => sum + Number(digit), 0)
}

export function calculateNumerology(date: string): NumerologyResult {
  const [, , dayText] = date.split('-')
  const raw = digitSum(date)
  return {
    lifePath: reduceNumber(raw),
    birthdayNumber: reduceNumber(Number(dayText)),
    formula: `${date.replaceAll('-', '').split('').join('+')} = ${raw} → ${reduceNumber(raw)}`,
    masterNumbers: MASTER_NUMBERS,
  }
}

export function personalYear(date: string, year: number): number {
  const [, month, day] = date.split('-').map(Number)
  return reduceNumber(digitSum(`${month}${day}${year}`), false)
}

export function personalMonth(date: string, year: number, month: number): number {
  return reduceNumber(personalYear(date, year) + month, false)
}
