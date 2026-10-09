import type { TarotCard } from '../../types'

const names = [
  ['The Fool', '愚者', '开始,开放,未知'], ['The Magician', '魔术师', '意志,资源,行动'],
  ['The High Priestess', '女祭司', '直觉,内省,等待'], ['The Empress', '皇后', '滋养,创造,丰盛'],
  ['The Emperor', '皇帝', '结构,责任,秩序'], ['The Hierophant', '教皇', '传统,学习,价值'],
  ['The Lovers', '恋人', '选择,联结,一致'], ['The Chariot', '战车', '方向,推进,自律'],
  ['Strength', '力量', '勇气,耐心,整合'], ['The Hermit', '隐者', '反思,独处,洞察'],
  ['Wheel of Fortune', '命运之轮', '周期,转变,适应'], ['Justice', '正义', '平衡,因果,判断'],
  ['The Hanged Man', '倒吊人', '暂停,换位,放下'], ['Death', '死神', '结束,转化,更新'],
  ['Temperance', '节制', '调和,节奏,整合'], ['The Devil', '恶魔', '依附,欲望,觉察'],
  ['The Tower', '高塔', '冲击,重构,真相'], ['The Star', '星星', '希望,疗愈,愿景'],
  ['The Moon', '月亮', '不确定,感受,想象'], ['The Sun', '太阳', '清晰,活力,表达'],
  ['Judgement', '审判', '召唤,复盘,觉醒'], ['The World', '世界', '完成,整合,展开'],
] as const

export function card(number: number): TarotCard {
  const normalized = Math.max(0, Math.min(21, number))
  const [name, nameZh, words] = names[normalized]
  return { number: normalized, name, nameZh, keywords: words.split(',') }
}

export function reduceTarot(value: number): number {
  let current = value
  while (current > 21) current = String(current).split('').reduce((a, b) => a + Number(b), 0)
  return current
}

// Project convention: sum digits of birth month + birth day + target Gregorian year.
export function yearCard(date: string, year: number): TarotCard {
  const [, month, day] = date.split('-').map(Number)
  const raw = String(month + day + year).split('').reduce((sum, n) => sum + Number(n), 0)
  return card(reduceTarot(raw))
}

export function birthCards(date: string): { birth: TarotCard; soul: TarotCard } {
  const [year, month, day] = date.split('-').map(Number)
  const birthNumber = reduceTarot(year + month + day)
  const soulNumber = birthNumber > 9
    ? String(birthNumber).split('').reduce((sum, n) => sum + Number(n), 0)
    : birthNumber
  return { birth: card(birthNumber), soul: card(soulNumber) }
}
