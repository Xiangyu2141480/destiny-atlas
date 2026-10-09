import { DateTime } from 'luxon'
import { Solar } from 'lunar-javascript'
import type { BaziPillar, BaziResult, TimeResult } from '../../types'

const elementByStem: Record<string, string> = { 甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土', 己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水' }
const elementByBranch: Record<string, string> = { 寅: '木', 卯: '木', 巳: '火', 午: '火', 辰: '土', 戌: '土', 丑: '土', 未: '土', 申: '金', 酉: '金', 亥: '水', 子: '水' }

export function calculateBazi(time: TimeResult): BaziResult {
  const local = DateTime.fromISO(time.calculationLocalIso, { setZone: true })
  const lunar = Solar.fromYmdHms(local.year, local.month, local.day, local.hour, local.minute, 0).getLunar()
  const eight = lunar.getEightChar()
  const values = [
    ['年柱', eight.getYear(), eight.getYearGan(), eight.getYearZhi(), eight.getYearHideGan(), eight.getYearNaYin()],
    ['月柱', eight.getMonth(), eight.getMonthGan(), eight.getMonthZhi(), eight.getMonthHideGan(), eight.getMonthNaYin()],
    ['日柱', eight.getDay(), eight.getDayGan(), eight.getDayZhi(), eight.getDayHideGan(), eight.getDayNaYin()],
    ['时柱', eight.getTime(), eight.getTimeGan(), eight.getTimeZhi(), eight.getTimeHideGan(), eight.getTimeNaYin()],
  ] as Array<[string, string, string, string, string[], string]>
  const pillars: BaziPillar[] = values.map(([label, ganZhi, stem, branch, hiddenStems, naYin]) => ({
    label, ganZhi, stem, branch, hiddenStems, naYin,
  }))
  const elements: Record<string, number> = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 }
  pillars.forEach(({ stem, branch }) => {
    elements[elementByStem[stem]] += 1
    elements[elementByBranch[branch]] += 1
  })
  return {
    pillars,
    dayMaster: eight.getDayGan(),
    zodiac: lunar.getYearShengXiao(),
    lunarDate: lunar.toString(),
    currentSolarTerm: lunar.getPrevJieQi().getName(),
    elements,
    convention: 'lunar-javascript 1.7.7：以节气定年/月柱；五行仅统计四柱显式干支，不等同旺衰、格局或喜用神；子初换日依赖库约定',
  }
}
