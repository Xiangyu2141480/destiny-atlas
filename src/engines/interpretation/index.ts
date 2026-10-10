import { DateTime } from 'luxon'
import { personalMonth, personalYear } from '../numerology'
import { yearCard } from '../tarot'
import type { BirthInput, DestinyReport, Focus, PeriodReading, ReportExplanation, TarotCard, TimelineYear } from '../../types'
import { CYCLE_PROFILES, DOMAIN_PLANS, TAROT_PLAIN } from './profiles'

const focuses: Focus[] = ['career', 'finance', 'relationships', 'growth', 'balance']

export function describePeriod(number: number, tarot: TarotCard, period: string, unit: 'month' | 'year'): PeriodReading {
  const profile = CYCLE_PROFILES[number]
  if (!profile) throw new RangeError('周期数字须在 1 至 9 之间')
  const periodWord = unit === 'year' ? '这一年' : '这个月'
  const review = unit === 'year'
    ? '每个季度花二十分钟复盘：做了什么、有什么实际变化、下一季度要调整哪一步。'
    : '月底花十分钟复盘：实际做了什么、有没有帮助、下个月只保留哪一个做法。'
  return {
    heading: `${period}：${profile.themes.join('，')}`,
    overview: `按本项目的数字学约定，${periodWord}可以围绕“${profile.themes.join('、')}”做观察。${profile.plain}塔罗原型“${tarot.nameZh}”补充的提醒是：${TAROT_PLAIN[tarot.number]}`,
    basis: [
      `${unit === 'year' ? '个人年' : '个人月'} ${number}：采用生日月日与公历年份的缩减规则；个人月再加上当月月份。`,
      `年度塔罗原型：${tarot.nameZh}（${tarot.number}），按本项目确定性数字缩减约定生成。`,
      '这些标签用来组织反思与行动，不是对具体事件、收益或结果的预测。',
    ],
    domains: Object.fromEntries(focuses.map((focus) => {
      const [meaning, first, second, watchOut] = DOMAIN_PLANS[focus][number]
      return [focus, { meaning: `${periodWord}，${meaning}`, actions: [first, second, review], watchOut }]
    })) as PeriodReading['domains'],
  }
}

export function createYearlyTimeline(input: BirthInput, startYear: number): TimelineYear[] {
  return Array.from({ length: 5 }, (_, index) => {
    const year = startYear + index
    const number = personalYear(input.date, year)
    const tarot = yearCard(input.date, year)
    const months = Array.from({ length: 12 }, (_, monthIndex) => {
      const month = monthIndex + 1
      const pm = personalMonth(input.date, year, month)
      return {
        month: DateTime.utc(year, month, 1).toFormat('yyyy-MM'),
        personalMonth: pm,
        themes: [...CYCLE_PROFILES[pm].themes],
        guidance: Object.fromEntries(focuses.map((focus) => [focus, DOMAIN_PLANS[focus][pm][1]])) as Record<Focus, string>,
      }
    })
    return {
      year,
      personalYear: number,
      tarot,
      reading: describePeriod(number, tarot, `${year} 年`, 'year'),
      quarters: Array.from({ length: 4 }, (_, quarter) => {
        const quarterMonths = months.slice(quarter * 3, quarter * 3 + 3)
        return {
          label: `第 ${quarter + 1} 季度 · ${quarter * 3 + 1}—${quarter * 3 + 3} 月`,
          summary: `这三个月的观察顺序是“${quarterMonths.map((month) => month.themes[0]).join(' → ')}”。可以按下面的月度小行动试一轮，再根据实际结果调整。`,
          months: quarterMonths,
        }
      }),
    }
  })
}

const zodiacHints: Record<string, string> = {
  白羊座: '主动、直接和开创', 金牛座: '稳定、体验和耐心', 双子座: '好奇、交流和多种可能', 巨蟹座: '照顾、归属和记忆',
  狮子座: '表达、创造和被看见', 处女座: '细节、整理和改进', 天秤座: '协调、关系和权衡', 天蝎座: '深度、信任和边界',
  射手座: '探索、意义和远方', 摩羯座: '责任、结构和长期积累', 水瓶座: '独立、群体和新想法', 双鱼座: '想象、感受和共情',
}

export function explainReport(report: Pick<DestinyReport, 'input' | 'numerology' | 'bazi' | 'astrology' | 'tarot' | 'personality'>): ReportExplanation {
  const lifePath = report.numerology.lifePath
  const lifeText = CYCLE_PROFILES[lifePath]?.plain ?? ({
    11: '把敏感的观察和灵感写下来，再用具体行动检验它，而不是只凭感觉作决定。',
    22: '把大的想法拆成明确的小步骤，先搭一个可以使用的版本。',
    33: '关照他人的同时也照顾自己的容量，帮助别人不等于包办一切。',
  } as Record<number, string>)[lifePath]
  const sun = report.astrology.positions.find((position) => position.body === '太阳')!
  const moon = report.astrology.positions.find((position) => position.body === '月亮')!
  const elementCounts = Object.entries(report.bazi.elements).map(([name, count]) => `${name} ${count}`).join('、')
  const mbtiTip = report.input.mbti[0] === 'I'
    ? '准备一件需要表达的事时，可以先独自写清想法，再拿去沟通。'
    : '遇到拿不准的问题，可以先找人讨论，再把讨论结果独立整理一遍。'
  return {
    introduction: '先抓重点：这份图谱把你的出生时刻转换成基础四柱、天体位置和数字学标签，再用大白话给出反思与行动建议。它适合帮你找观察角度，真正的决定仍要结合眼前的生活。',
    highlights: [
      { title: '你的做事主题', meaning: `你的生命路径数是 ${lifePath}。可以把它理解成一个反思主题：${lifeText}`, basis: report.numerology.formula, action: '选一个最近在意的目标，写下“我真正想得到什么”和“这周能做的第一步”。' },
      { title: '你如何表达自己', meaning: `出生时太阳在${sun.sign}。传统象征常把它与${zodiacHints[sun.sign]}联系起来。你可以据此回看自己的做事方式，看看哪些符合实际、哪些不符合。`, basis: `太阳地心视黄经 ${sun.longitude.toFixed(4)}°，${sun.sign}内 ${sun.degreeInSign.toFixed(2)}°。`, action: '回想最近一次做得顺手的事：你用了什么长处，下一次能怎样复用？' },
      { title: '你怎样照顾感受', meaning: `出生时月亮在${moon.sign}。它的传统象征偏向${zodiacHints[moon.sign]}。这不是对情绪的诊断，更适合作为发现个人需要的提问线索。`, basis: `月亮地心视黄经 ${moon.longitude.toFixed(4)}°，不涉及未验证的上升点或宫位。`, action: '列出三件能让自己恢复精力的小事，在忙碌的时候保留其中一件。' },
      { title: '本命牌给你的提醒', meaning: `你的本命牌是“${report.tarot.birth.nameZh}”。用大白话说：${TAROT_PLAIN[report.tarot.birth.number]}`, basis: `出生牌 ${report.tarot.birth.number}；灵魂牌 ${report.tarot.soul.nameZh}（${report.tarot.soul.number}），没有随机抽牌或正逆位。`, action: '把这句提醒换成一个具体情境，写下你准备采取的行动。' },
      { title: '人格偏好怎么用', meaning: `你选择了 ${report.personality.type}，描述主题是“${report.personality.title}”。${mbtiTip}这是一种沟通与习惯偏好，不是能力高低或固定命运。`, basis: '来自你自行选择的 MBTI，不是本项目替你做的人格测评。', action: `${report.input.mbti[3] === 'J' ? '计划里留一段缓冲时间，避免安排过满。' : '为正在做的一件事设一个收尾时间，帮助想法落地。'}再观察这个调整是否适合你。` },
      { title: '四柱信息怎么看', meaning: `基础盘的日干是“${report.bazi.dayMaster}”，四柱为 ${report.bazi.pillars.map((pillar) => pillar.ganZhi).join('、')}。显式五行计数是 ${elementCounts}。这只是八个字的分布，不能直接解释成旺衰或需要补什么。`, basis: `lunar-javascript 节气四柱；显式干支总计 ${Object.values(report.bazi.elements).reduce((sum, count) => sum + count, 0)} 个。`, action: '把它作为基础排盘记录保存。需要讨论更复杂的传统命理时，先确认换日、真太阳时和流派约定。' },
    ],
    firstSteps: [
      '先选一个最在意的领域，不必同时改造所有方面。',
      '把建议改写成自己一周内能做的一件小事，写下时间和完成标准。',
      '定期回看真实变化：有用的留下，不符合自己的放下。',
    ],
  }
}
