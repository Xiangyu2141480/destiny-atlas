import type { Mbti } from '../../types'

const temperament: Record<string, { title: string; lens: string }> = {
  NT: { title: '理性探索者', lens: '偏好以逻辑、系统与长期可能性理解问题' },
  NF: { title: '价值联结者', lens: '偏好以意义、成长与人的潜能理解问题' },
  SJ: { title: '稳健建设者', lens: '偏好以经验、责任与可执行秩序理解问题' },
  SP: { title: '灵活实践者', lens: '偏好以当下反馈、体验与适应性理解问题' },
}

export function personalityProfile(type: Mbti) {
  const groupKey = type[1] === 'N' ? `${type[1]}${type[2]}` : `${type[1]}${type[3]}`
  const group = temperament[groupKey]
  const intro = type[0] === 'I' ? '独处恢复精力' : '互动中获得能量'
  const structure = type[3] === 'J' ? '倾向提前形成结构' : '倾向保留探索空间'
  return {
    type,
    title: group.title,
    summary: `${type} 常被描述为${group.lens}，并可能${intro}、${structure}。这是自我描述框架，不是诊断或能力测量。`,
    strengths: [group.lens, intro, structure],
    cautions: ['偏好不等于固定行为', '不用于推断智力、收入或心理健康', '情境、文化与成长经历同样重要'],
  }
}
