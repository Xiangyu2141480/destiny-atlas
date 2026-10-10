import type { DestinyReport, Focus } from '../types'
import { PlaceSourceCredit } from './PlaceSourceCredit'

const focusNames: Record<Focus, string> = {
  career: '事业与学习', finance: '钱与消费', relationships: '人际与感情', growth: '成长与习惯', balance: '生活与精力',
}

export function CompactReport({ report, focus, onFocusChange, onYear, onDetailed }: {
  report: DestinyReport
  focus: Focus
  onFocusChange: (focus: Focus) => void
  onYear: () => void
  onDetailed: () => void
}) {
  const month = report.timeline[0]
  const year = report.yearlyTimeline[0]
  const advice = month.reading.domains[focus]
  const sun = report.astrology.positions.find((body) => body.body === '太阳')

  return (
    <article className="compact-report" role="region" aria-label="精简报告">
      <header className="compact-heading">
        <p className="eyebrow">精简版 · 先看重点</p>
        <h2>{report.input.name || '你的'}命运图谱</h2>
        <p className="compact-meta">{report.input.date} {report.input.time} · {report.place.name}</p>
        <PlaceSourceCredit place={report.place} />
      </header>
      <dl className="compact-facts">
        <div><dt>太阳星座</dt><dd>{sun?.sign ?? '—'}</dd></div>
        <div><dt>你选择的人格</dt><dd>{report.personality.type}</dd></div>
        <div><dt>本命牌</dt><dd>{report.tarot.birth.nameZh}</dd></div>
      </dl>
      <section className="compact-focus">
        <div className="compact-section-heading"><h3>近期的重点</h3><label>关注领域<select aria-label="关注领域" value={focus} onChange={(event) => onFocusChange(event.target.value as Focus)}>{Object.entries(focusNames).map(([value, name]) => <option value={value} key={value}>{name}</option>)}</select></label></div>
        <p className="compact-period">{month.month} · {focusNames[focus]}</p>
        <p>{advice.meaning}</p>
      </section>
      <section className="compact-actions">
        <h3>先做这三件事</h3>
        <p className="compact-hint">不用一次全做完，挑最容易的一条开始。</p>
        <ol>{advice.actions.map((action) => <li key={action}>{action}</li>)}</ol>
      </section>
      <aside className="compact-caution"><h3>留意这一点</h3><p>{advice.watchOut}</p></aside>
      <section className="compact-year"><h3>{year.year} 年的提醒</h3><p>{year.reading.domains[focus].meaning}</p><button type="button" onClick={onYear}>展开五年解读 <span aria-hidden="true">↗</span></button></section>
      <footer className="compact-footer"><span>用于文化探索与自我反思。</span><button type="button" onClick={onDetailed}>查看完整图谱 <span aria-hidden="true">↗</span></button></footer>
    </article>
  )
}
