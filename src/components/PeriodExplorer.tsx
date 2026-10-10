import { useState } from 'react'
import type { DestinyReport, Focus } from '../types'

const focusNames: Record<Focus, string> = {
  career: '事业与学习', finance: '钱与消费', relationships: '人际与感情', growth: '成长与习惯', balance: '生活与精力',
}

export function PeriodExplorer({ report, unit, onUnitChange: setUnit, focus, onFocusChange: setFocus }: {
  report: DestinyReport
  unit: 'month' | 'year'
  onUnitChange: (unit: 'month' | 'year') => void
  focus: Focus
  onFocusChange: (focus: Focus) => void
}) {
  const [selectedMonth, setSelectedMonth] = useState(0)
  const [selectedYear, setSelectedYear] = useState(0)
  const month = report.timeline[selectedMonth]
  const year = report.yearlyTimeline[selectedYear]
  const reading = unit === 'month' ? month.reading : year.reading
  const advice = reading.domains[focus]

  return (
    <section id="s5" className="panel period-explorer" tabIndex={-1}>
      <div className="section-title"><span>05</span><div><h2>{unit === 'month' ? 'Your Next 24 Months' : 'Year by Year'}</h2><p>按月看小行动，按年看大方向</p></div></div>
      <div className="period-tabs" role="group" aria-label="选择时间粒度">
        <button type="button" aria-pressed={unit === 'month'} onClick={() => setUnit('month')}>按月看 · 24 个月</button>
        <button type="button" aria-pressed={unit === 'year'} onClick={() => setUnit('year')}>按年看 · 5 年</button>
      </div>
      {unit === 'month' ? <>
        <p className="interaction-hint"><span>点击月份查看详细解读与建议</span><span>左右滑动 ↔</span></p>
        <div className="timeline-wrap"><div className="timeline" role="list">{report.timeline.map((item, index) => <button type="button" key={item.month} className={selectedMonth === index ? 'active' : ''} onClick={() => setSelectedMonth(index)} aria-pressed={selectedMonth === index}><i /><small>{item.month}</small><b>{item.personalMonth}</b><span>{item.themes[0]}</span></button>)}</div></div>
      </> : <>
        <p className="interaction-hint">从 {report.yearlyTimeline[0].year} 年起，每年覆盖完整的 1—12 月；季度安排是行动建议，不是事件发生时间表。</p>
        <div className="year-selector">{report.yearlyTimeline.map((item, index) => <button type="button" key={item.year} aria-label={`查看 ${item.year} 年`} aria-pressed={selectedYear === index} onClick={() => setSelectedYear(index)}><strong>{item.year}</strong><span>个人年 {item.personalYear}</span><small>{item.tarot.nameZh}</small></button>)}</div>
      </>}
      <div className="period-reading" role="region" aria-label="当前阶段解读" aria-live="polite">
        <div className="period-overview"><p className="eyebrow">{unit === 'month' ? `${month.month} · 月度解读` : `${year.year} 年 1—12 月 · 年度解读`}</p><h3>{reading.heading}</h3><p>{reading.overview}</p></div>
        <div className="focus-tabs" role="group" aria-label="选择建议领域">{Object.entries(focusNames).map(([key, label]) => <button type="button" key={key} aria-pressed={focus === key} onClick={() => setFocus(key as Focus)}>{label}</button>)}</div>
        <div className="domain-reading">
          <div><h4>这对你有什么参考</h4><p>{advice.meaning}</p></div>
          <div className="action-list"><h4>具体可以怎么做</h4><ol>{advice.actions.map((action) => <li key={action}>{action}</li>)}</ol></div>
          <div className="watch-out"><h4>别踩这个坑</h4><p>{advice.watchOut}</p></div>
        </div>
        {unit === 'month' && <details className="reading-basis"><summary>查看计算依据和天文采样</summary><p>个人年 {month.personalYear} / 个人月 {month.personalMonth} · 流月 {month.baziMonth} · 年度牌 {month.tarot.nameZh}</p><p>{month.transitNote}</p><p>“月初采样”只看每月 1 日的天体角度，不是整个月会发生的具体事件。</p><ul>{reading.basis.map((basis) => <li key={basis}>{basis}</li>)}</ul></details>}
        {unit === 'year' && <>
          <div className="quarter-heading"><h4>这一年可以怎么安排</h4><p>下面按“{focusNames[focus]}”列出每个月可试的一步，按自己的现实安排调整即可。</p></div>
          <div className="quarter-grid">{year.quarters.map((quarter) => <article key={quarter.label}><h4>{quarter.label}</h4><p>{quarter.summary}</p><ol>{quarter.months.map((item) => <li key={item.month}><b>{Number(item.month.slice(5))} 月 · {item.themes.join(' / ')}</b><span>{item.guidance[focus]}</span></li>)}</ol></article>)}</div>
          <details className="reading-basis"><summary>这份年度解读根据什么生成</summary><ul>{reading.basis.map((basis) => <li key={basis}>{basis}</li>)}</ul><p>季度小行动使用各月份的个人月主题组织；没有新增未经验证的大运、宫位或现实事件推断。</p></details>
        </>}
      </div>
    </section>
  )
}
