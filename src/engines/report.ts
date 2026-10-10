import { DateTime } from 'luxon'
import { z } from 'zod'
import { Solar } from 'lunar-javascript'
import { calculateAstrology, monthlyTransitNote } from './astrology'
import { calculateBazi } from './bazi'
import { calculateTime } from './datetime'
import { calculateNumerology, personalMonth, personalYear } from './numerology'
import { personalityProfile } from './personality'
import { birthCards, yearCard } from './tarot'
import { getPlace } from '../data/places'
import { createYearlyTimeline, describePeriod, explainReport } from './interpretation'
import { MBTI_TYPES, type BirthInput, type DestinyReport, type Focus, type TimelineMonth } from '../types'

export const birthInputSchema = z.object({
  name: z.string().trim().max(50).optional(),
  date: z.iso.date(),
  time: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/),
  placeId: z.string().min(1),
  customPlace: z.object({
    id: z.literal('custom'),
    name: z.string().trim().min(1, '请输入自定义城市名称').max(80),
    country: z.string().trim().min(1).max(80),
    latitude: z.number().min(-90, '纬度须在 -90 至 90 之间').max(90, '纬度须在 -90 至 90 之间'),
    longitude: z.number().min(-180, '经度须在 -180 至 180 之间').max(180, '经度须在 -180 至 180 之间'),
    source: z.object({ provider: z.literal('open-meteo'), id: z.number().int().positive(), license: z.literal('CC BY-NC 4.0'), modified: z.boolean() }).optional(),
    timezone: z.string().trim().min(1, '请输入 IANA 时区').refine((zone) => {
      try {
        new Intl.DateTimeFormat('en', { timeZone: zone }).format()
        return zone.includes('/')
      } catch {
        return false
      }
    }, '请输入有效的 IANA 时区，例如 Asia/Shanghai'),
  }).optional(),
  mbti: z.enum(MBTI_TYPES),
  trueSolarTime: z.boolean().optional(),
  focus: z.enum(['career', 'finance', 'relationships', 'growth', 'balance']).optional(),
  startMonth: z.string().regex(/^\d{4}-(?:0[1-9]|1[0-2])$/, '起始月须为有效的 YYYY-MM').optional(),
}).superRefine((input, context) => {
  if (input.placeId === 'custom' && !input.customPlace) {
    context.addIssue({ code: 'custom', path: ['customPlace'], message: '请完整填写自定义城市信息' })
  }
})

const themeByNumber: Record<number, string[]> = {
  1: ['启动', '自主'], 2: ['协作', '耐心'], 3: ['表达', '创造'], 4: ['结构', '落实'],
  5: ['变化', '试验'], 6: ['关系', '责任'], 7: ['反思', '研究'], 8: ['资源', '执行'], 9: ['完成', '整合'],
}

const guidance: Record<Focus, Record<number, string>> = {
  career: { 1: '定义一个可控的新起点', 2: '先协调关键关系', 3: '用作品表达观点', 4: '完善流程与基本功', 5: '用小实验测试变化', 6: '平衡责任与边界', 7: '留出复盘与学习时间', 8: '聚焦资源配置与交付', 9: '收尾并沉淀经验' },
  finance: { 1: '建立新的预算目标', 2: '审阅共同财务约定', 3: '控制表达型消费', 4: '核对现金流与储备', 5: '为波动保留余量', 6: '评估家庭责任支出', 7: '研究后再决策', 8: '量化投入与回报', 9: '清理低效订阅和负担' },
  relationships: { 1: '坦诚表达个人需要', 2: '练习倾听与协商', 3: '创造轻松交流机会', 4: '建立可靠的相处节奏', 5: '为彼此保留弹性', 6: '谈清承诺与边界', 7: '尊重独处与思考', 8: '避免把控制当作安全感', 9: '完成必要的告别或和解' },
  growth: { 1: '选择一个新习惯', 2: '观察情绪与关系反馈', 3: '记录并分享所学', 4: '依靠稳定练习推进', 5: '主动接触陌生经验', 6: '把关照落实为行动', 7: '深读、复盘、减少噪音', 8: '承担有边界的挑战', 9: '总结一个阶段的变化' },
  balance: { 1: '为新节奏留出空间', 2: '放慢并关注身体信号', 3: '安排恢复性的兴趣', 4: '固定睡眠与运动时段', 5: '在变化中保留锚点', 6: '照顾他人前确认容量', 7: '减少输入并恢复专注', 8: '在高投入后安排恢复', 9: '清理过期承诺' },
}

function monthPillar(month: DateTime): string {
  const lunar = Solar.fromYmdHms(month.year, month.month, 15, 12, 0, 0).getLunar()
  return lunar.getEightChar().getMonth()
}

function createTimeline(input: BirthInput, natal: ReturnType<typeof calculateAstrology>, now: Date): TimelineMonth[] {
  const rawStart = input.startMonth
    ? DateTime.fromFormat(input.startMonth, 'yyyy-MM', { zone: 'utc' })
    : DateTime.fromJSDate(now, { zone: 'utc' }).startOf('month')
  const start = rawStart.isValid ? rawStart : DateTime.fromJSDate(now, { zone: 'utc' }).startOf('month')
  return Array.from({ length: 24 }, (_, index) => {
    const current = start.plus({ months: index })
    const py = personalYear(input.date, current.year)
    const pm = personalMonth(input.date, current.year, current.month)
    const tarot = yearCard(input.date, current.year)
    const guide = Object.fromEntries(
      (Object.keys(guidance) as Focus[]).map((focus) => [focus, guidance[focus][pm]]),
    ) as Record<Focus, string>
    return {
      month: current.toFormat('yyyy-MM'),
      personalYear: py,
      personalMonth: pm,
      tarot,
      baziMonth: monthPillar(current),
      themes: [...themeByNumber[pm], ...tarot.keywords.slice(0, 1)],
      transitNote: monthlyTransitNote(current.toJSDate(), natal),
      guidance: guide,
      reading: describePeriod(pm, tarot, current.toFormat('yyyy-MM'), 'month'),
    }
  })
}

export function generateDestinyReport(raw: BirthInput, now = new Date()): DestinyReport {
  const input = birthInputSchema.parse(raw)
  const place = input.placeId === 'custom' && input.customPlace ? input.customPlace : getPlace(input.placeId)
  const time = calculateTime(input, place)
  const numerology = calculateNumerology(input.date)
  const bazi = calculateBazi(time)
  const astrology = calculateAstrology(time.utcIso)
  const born = birthCards(input.date)
  const timeline = createTimeline(input, astrology, now)
  const years = [...new Set(timeline.map((item) => Number(item.month.slice(0, 4))))]
  const yearly = Object.fromEntries(years.map((year) => [String(year), yearCard(input.date, year)]))
  const personality = personalityProfile(input.mbti)
  const tarot = { ...born, yearly }
  const yearlyTimeline = createYearlyTimeline(input, Number(timeline[0].month.slice(0, 4)))
  return {
    schemaVersion: '1.1',
    engineVersion: '0.2.0',
    generatedAt: now.toISOString(),
    input,
    place,
    time,
    numerology,
    tarot,
    bazi,
    astrology,
    personality,
    timeline,
    yearlyTimeline,
    explanation: explainReport({ input, numerology, tarot, bazi, astrology, personality }),
    synthesis: {
      agreements: [`生命路径 ${numerology.lifePath} 可以用来回看自己的做事方式；个人年和个人月帮助你安排不同层级的反思。`, `${input.mbti} 和本命牌“${born.birth.nameZh}”提供了两种提问角度。符合自己的部分可以试用，不符合的部分不必勉强认同。`],
      tensions: ['不同体系有时说法相近，有时相互矛盾。它们不是互相证明，也不会因为放在一起就变得更准。', '天文采样记录了某个时刻的角度关系，不能据此断定整个月会发生什么。'],
      actions: ['从上面的建议中只挑一件，写清什么时候做、做到什么程度。', '涉及钱、健康、法律或重要关系时，先看事实、资源和专业意见。', '每月回看哪些建议真的有帮助，也记录没有对上的地方。'],
    },
    limitations: [
      '本产品用于文化、娱乐与自我探索，不提供科学预测。',
      '预置城市来自离线精选清单；自定义地点经纬度由用户提供，历史时区由运行环境的 IANA/Intl 数据提供。',
      '八字未判旺衰、格局、喜用神或大运；未擅自推测性别。',
      '占星未展示未验证的上升点、MC与宫位；行运为月初采样而非精确过境搜索。',
      '打印功能使用浏览器打印对话框，可选择“另存为 PDF”；未实现独立PDF生成器。',
    ],
  }
}
