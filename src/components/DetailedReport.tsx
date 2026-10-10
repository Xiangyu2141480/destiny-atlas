import { useMemo, useState } from 'react'
import type { DestinyReport, Focus } from '../types'
import { PlainLanguageSummary } from './PlainLanguageSummary'
import { PlaceSourceCredit } from './PlaceSourceCredit'
import { ReportNavigation } from './ReportNavigation'
import { NatalChart } from './NatalChart'
import { PersonalityCards } from './PersonalityCards'
import { PeriodExplorer } from './PeriodExplorer'

export function DetailedReport({ report, periodUnit, onPeriodChange, focus, onFocusChange }: {
  report: DestinyReport
  periodUnit: 'month' | 'year'
  onPeriodChange: (unit: 'month' | 'year') => void
  focus: Focus
  onFocusChange: (focus: Focus) => void
}) {
  const [tarotFlipped, setTarotFlipped] = useState(false)
  const elementMax = useMemo(() => Math.max(...Object.values(report.bazi.elements), 1), [report])
  return (
    <div className="detailed-report-layout" role="region" aria-label="详细报告">
        <ReportNavigation />
        <article className="report">
          <section id="s1" className="report-hero">
            <div className="reveal-rule"><span>OBSERVATION COMPLETE</span><i /></div>
            <p className="eyebrow">YOUR PERSONAL CELESTIAL ATLAS</p>
            <h2>{report.input.name || '你的'}命运图谱</h2>
            <p>{report.input.date} {report.input.time} · {report.place.name} · {report.input.mbti}</p>
            <PlaceSourceCredit place={report.place} />
            <div className="metric-grid">
              <div><small>生命路径</small><strong>{report.numerology.lifePath}</strong><p>{report.numerology.formula}</p></div>
              <div><small>日主</small><strong>{report.bazi.dayMaster}</strong><p>{report.bazi.lunarDate}</p></div>
              <div><small>本命原型</small><strong>{report.tarot.birth.number}</strong><p>{report.tarot.birth.nameZh} · {report.tarot.birth.name}</p></div>
              <div><small>人格框架</small><strong>{report.personality.type}</strong><p>{report.personality.title}</p></div>
            </div>
            <div className="trace"><b>时间追踪</b><code>{report.time.localIso}</code><span>→</span><code>{report.time.utcIso}</code></div>
            <PlainLanguageSummary explanation={report.explanation} />
          </section>

          <section id="s2" className="panel">
            <div className="section-title"><span>02</span><div><h2>Eastern Destiny</h2><p>节气四柱与显式五行计数</p></div></div>
            <div className="pillars">{report.bazi.pillars.map((pillar, index) => <div key={pillar.label}><small>{pillar.label}</small><strong>{pillar.ganZhi}</strong><i>{['年', '月', '日', '时'][index]}</i><p>{pillar.naYin}</p><p>藏干 {pillar.hiddenStems.join('·')}</p></div>)}</div>
            <div className="elements">{Object.entries(report.bazi.elements).map(([name, count]) => <div key={name}><span>{name}</span><div><i style={{ width: `${count / elementMax * 100}%` }} /></div><b>{count}</b></div>)}</div>
            <p className="method">{report.bazi.convention}</p>
          </section>

          <section id="s3" className="panel">
            <div className="section-title"><span>03</span><div><h2>Western Astronomy</h2><p>热带黄道 · 地心视黄经</p></div></div>
            <div className="astro-grid"><NatalChart data={report.astrology} /></div>
            <h3>本命主要相位</h3>
            <div className="chips">{report.astrology.aspects.map((a) => <span key={a.bodies.join()}>{a.bodies.join('–')} {a.type} · {a.orb}°</span>)}</div>
            <p className="method">{report.astrology.source}</p>
          </section>

          <section id="s4" className="panel split">
            <div className="tarot-reading">
              <p className="eyebrow">04 · DETERMINISTIC ARCHETYPE</p>
              <button type="button" className={`tarot-card ${tarotFlipped ? 'is-flipped' : ''}`} onClick={() => setTarotFlipped((value) => !value)} aria-pressed={tarotFlipped} aria-label={`翻开本命塔罗牌：${report.tarot.birth.nameZh}`}>
                <span className="tarot-card-inner">
                  <span className="tarot-back"><i>✦</i><b>DESTINY<br />ATLAS</b><small>点击揭示</small></span>
                  <span className="tarot-front"><small>{String(report.tarot.birth.number).padStart(2, '0')}</small><i>☾</i><b>{report.tarot.birth.nameZh}</b><em>{report.tarot.birth.name}</em></span>
                </span>
              </button>
              <p className="tarot-note">牌面由出生日期确定，不含随机抽取</p>
              <h2>{report.tarot.birth.nameZh}</h2><p>{report.tarot.birth.keywords.join(' · ')}</p><p>灵魂牌：{report.tarot.soul.nameZh}（{report.tarot.soul.number}）</p>
            </div>
            <div className="personality-reading"><p className="eyebrow">PERSONALITY · ORIGINAL SIGIL ATLAS</p><h2>{report.personality.type} · {report.personality.title}</h2><p>{report.personality.summary}</p><ul>{report.personality.cautions.map((item) => <li key={item}>{item}</li>)}</ul><PersonalityCards key={report.personality.type} selected={report.personality.type} /></div>
          </section>

          <PeriodExplorer report={report} unit={periodUnit} onUnitChange={onPeriodChange} focus={focus} onFocusChange={onFocusChange} />

          <section id="s6" className="panel">
            <div className="section-title"><span>06</span><div><h2>Cross-System Insights</h2><p>保留一致与冲突，不计算“准确率”</p></div></div>
            <div className="insights"><div><h3>可以怎样看自己</h3>{report.synthesis.agreements.map((x) => <p key={x}>{x}</p>)}</div><div><h3>哪些话别当成定论</h3>{report.synthesis.tensions.map((x) => <p key={x}>{x}</p>)}</div><div><h3>下一步怎么做</h3>{report.synthesis.actions.map((x) => <p key={x}>{x}</p>)}</div></div>
          </section>

          <section id="s7" className="panel limitations">
            <div className="section-title"><span>07</span><div><h2>Methodology & Limitations</h2><p>可追溯，不制造虚假确定性</p></div></div>
            <p>{report.time.convention}</p>
            <ul>{report.limitations.map((item) => <li key={item}>{item}</li>)}</ul>
            <p>详细算法、隐私与参考资料见仓库 <code>docs/</code>。生成时间：{report.generatedAt}</p>
          </section>
        </article>
    </div>
  )
}

