import { DateTime } from 'luxon'
import type { BirthInput, Place, TimeResult } from '../types'

function equationOfTimeMinutes(date: DateTime): number {
  const day = date.ordinal
  const b = (2 * Math.PI * (day - 81)) / 364
  return 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b)
}

export function calculateTime(input: BirthInput, place: Place): TimeResult {
  const requested = `${input.date}T${input.time}`
  const local = DateTime.fromISO(requested, { zone: place.timezone, setZone: true })
  if (!local.isValid) throw new Error(`INVALID_LOCAL_TIME: ${local.invalidExplanation ?? 'invalid date/time'}`)

  // Luxon may normalize a nonexistent DST wall time; reject if the wall clock changed.
  if (local.toFormat("yyyy-MM-dd'T'HH:mm") !== requested) {
    throw new Error('NONEXISTENT_LOCAL_TIME')
  }

  let calculation = local
  let correction: number | undefined
  if (input.trueSolarTime) {
    const standardMeridian = (local.offset / 60) * 15
    correction = 4 * (place.longitude - standardMeridian) + equationOfTimeMinutes(local)
    calculation = local.plus({ minutes: correction })
  }

  return {
    localIso: local.toISO()!,
    utcIso: local.toUTC().toISO()!,
    timezone: place.timezone,
    offsetMinutes: local.offset,
    calculationLocalIso: calculation.toISO()!,
    trueSolarCorrectionMinutes: correction === undefined ? undefined : Number(correction.toFixed(2)),
    convention: input.trueSolarTime
      ? '当地民用时区（含历史DST）转换UTC；八字时刻另以经度差+均时差近似修正'
      : '当地民用时区（含历史DST）转换UTC；八字采用当地标准时间',
  }
}
