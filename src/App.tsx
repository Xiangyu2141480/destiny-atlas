import { useEffect, useMemo, useRef, useState, type FormEvent, type PointerEvent } from 'react'
import { ZodError } from 'zod'
import { BirthForm } from './components/BirthForm'
import { HeroIntro } from './components/HeroIntro'
import { ReportNavigation } from './components/ReportNavigation'
import { NatalChart } from './components/NatalChart'
import { PersonalityCards } from './components/PersonalityCards'
import { generateDestinyReport } from './engines/report'
import { type BirthInput, type DestinyReport, type Focus } from './types'

const initial: BirthInput = {
  date: '2002-10-03',
  time: '02:00',
  placeId: 'guangzhou',
  mbti: 'ENFJ',
  focus: 'growth',
}

const focusLabels: Record<Focus, string> = {
  career: '事业', finance: '财富', relationships: '关系', growth: '成长', balance: '平衡',
}

function downloadJson(report: DestinyReport) {
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `destiny-atlas-${report.input.date}.json`
  anchor.click()
  URL.revokeObjectURL(url)
}

function App() {
  const [input, setInput] = useState<BirthInput>(initial)
  const [report, setReport] = useState<DestinyReport>()
  const [error, setError] = useState('')
  const [selectedMonth, setSelectedMonth] = useState(0)
  const [tarotFlipped, setTarotFlipped] = useState(false)
  const [motionPaused, setMotionPaused] = useState(false)
  const heroRef = useRef<HTMLElement>(null)
  const current = report?.timeline[selectedMonth]
  const selectedFocus = input.focus ?? 'growth'

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('.panel, .report-hero'))
    sections.forEach((section) => section.classList.add('scroll-reveal'))
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion || !('IntersectionObserver' in window)) {
      sections.forEach((section) => section.classList.add('is-visible'))
      return
    }
    const observer = new window.IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      }),
      { threshold: 0.08, rootMargin: '0px 0px 12% 0px' },
    )
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= window.innerHeight * 0.92) section.classList.add('is-visible')
      else observer.observe(section)
    })
    const fallback = window.setTimeout(() => sections.forEach((section) => section.classList.add('is-visible')), 1800)
    return () => {
      window.clearTimeout(fallback)
      observer.disconnect()
    }
  }, [report])

  function moveHero(event: PointerEvent<HTMLElement>) {
    if (motionPaused || event.pointerType === 'touch' || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width - 0.5
    const y = (event.clientY - bounds.top) / bounds.height - 0.5
    event.currentTarget.style.setProperty('--pointer-x', x.toFixed(3))
    event.currentTarget.style.setProperty('--pointer-y', y.toFixed(3))
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    try {
      setReport(generateDestinyReport(input))
      setError('')
      setSelectedMonth(0)
      setTarotFlipped(false)
      requestAnimationFrame(() => {
        const section = document.querySelector('#report')
        const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
        if (section && 'scrollIntoView' in section) section.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })
      })
    } catch (reason) {
      setError(reason instanceof ZodError ? reason.issues[0]?.message : reason instanceof Error ? reason.message : '计算失败')
    }
  }

  const elementMax = useMemo(() => report ? Math.max(...Object.values(report.bazi.elements), 1) : 1, [report])

  return (
    <>
      <a className="skip-link" href="#birth-form">跳到出生信息表单</a>
      <div className="atmosphere" aria-hidden="true">
        <div className="aurora aurora-one" />
        <div className="aurora aurora-two" />
        <div className="starfield" />
        <div className="star-trails" />
        <div className="meteor meteor-one" />
        <div className="meteor meteor-two" />
        <div className="noise" />
      </div>
      <header className="hero" ref={heroRef} onPointerMove={moveHero} onPointerLeave={() => {
        heroRef.current?.style.setProperty('--pointer-x', '0')
        heroRef.current?.style.setProperty('--pointer-y', '0')
      }}>

        <nav>
          <a className="brand" href="#" aria-label="Destiny Atlas 首页"><i className="brand-mark" aria-hidden="true">✧</i><span className="brand-name">DESTINY ATLAS<small>命运图谱 · 私人观测室</small></span></a>
          <div className="nav-meta">
            <span className="nav-caption">A LITTLE CLOSER TO YOURSELF</span>
            <button
              type="button"
              className="motion-toggle"
              aria-label={motionPaused ? '开启动态' : '暂停动态'}
              aria-pressed={motionPaused}
              onClick={() => {
                const paused = !motionPaused
                setMotionPaused(paused)
                document.documentElement.dataset.motion = paused ? 'paused' : 'running'
              }}
            >
              {motionPaused ? '开启动态' : '暂停动态'}
            </button>
            <a className="nav-start" href="#birth-form">开始观测 <span aria-hidden="true">↗</span></a>
          </div>
        </nav>
        <div className="hero-grid">
          <HeroIntro />
          <BirthForm input={input} setInput={setInput} submit={submit} error={error} />
        </div>
        <div className="observatory-footer"><span>✦ <b>AS ABOVE, SO WITHIN.</b></span><p>以星辰为镜，探索属于你的内在宇宙</p><a href="#birth-form">从出生坐标开始 ↓</a></div>

      </header>
      {report && <main id="report" className="report-reveal">
        <ReportNavigation onDownload={() => downloadJson(report)} />
        <article className="report">
          <section id="s1" className="report-hero">
            <div className="reveal-rule"><span>OBSERVATION COMPLETE</span><i /></div>
            <p className="eyebrow">YOUR PERSONAL CELESTIAL ATLAS</p>
            <h2>{report.input.name || '你的'}命运图谱</h2>
            <p>{report.input.date} {report.input.time} · {report.place.name} · {report.input.mbti}</p>
            <div className="metric-grid">
              <div><small>生命路径</small><strong>{report.numerology.lifePath}</strong><p>{report.numerology.formula}</p></div>
              <div><small>日主</small><strong>{report.bazi.dayMaster}</strong><p>{report.bazi.lunarDate}</p></div>
              <div><small>本命原型</small><strong>{report.tarot.birth.number}</strong><p>{report.tarot.birth.nameZh} · {report.tarot.birth.name}</p></div>
              <div><small>人格框架</small><strong>{report.personality.type}</strong><p>{report.personality.title}</p></div>
            </div>
            <div className="trace"><b>时间追踪</b><code>{report.time.localIso}</code><span>→</span><code>{report.time.utcIso}</code></div>
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

          <section id="s5" className="panel">
            <div className="section-title"><span>05</span><div><h2>Your Next 24 Months</h2><p>点击月份查看计算依据与行动提示</p></div></div>
            <p className="interaction-hint"><span>24 个月 · 每月一个新的观察角度</span><span>左右滑动探索 ↔</span></p><div className="timeline-wrap"><div className="timeline" role="list">{report.timeline.map((item, index) => <button key={item.month} className={selectedMonth === index ? 'active' : ''} onClick={() => setSelectedMonth(index)} aria-pressed={selectedMonth === index}><i /><small>{item.month}</small><b>{item.personalMonth}</b><span>{item.themes[0]}</span></button>)}</div></div>
            {current && <div className="month-detail">
              <div><p className="eyebrow">{current.month}</p><h3>{current.themes.join(' · ')}</h3><p>个人年 {current.personalYear} / 个人月 {current.personalMonth} · 流月 {current.baziMonth} · 年度牌 {current.tarot.nameZh}</p></div>
              <div><b>天文采样</b><p>{current.transitNote}</p></div>
              <div><b>{focusLabels[selectedFocus]}行动提示</b><p>{current.guidance[selectedFocus]}</p></div>
            </div>}
          </section>

          <section id="s6" className="panel">
            <div className="section-title"><span>06</span><div><h2>Cross-System Insights</h2><p>保留一致与冲突，不计算“准确率”</p></div></div>
            <div className="insights"><div><h3>可比较主题</h3>{report.synthesis.agreements.map((x) => <p key={x}>{x}</p>)}</div><div><h3>方法张力</h3>{report.synthesis.tensions.map((x) => <p key={x}>{x}</p>)}</div><div><h3>现实路线</h3>{report.synthesis.actions.map((x) => <p key={x}>{x}</p>)}</div></div>
          </section>

          <section id="s7" className="panel limitations">
            <div className="section-title"><span>07</span><div><h2>Methodology & Limitations</h2><p>可追溯，不制造虚假确定性</p></div></div>
            <p>{report.time.convention}</p>
            <ul>{report.limitations.map((item) => <li key={item}>{item}</li>)}</ul>
            <p>详细算法、隐私与参考资料见仓库 <code>docs/</code>。生成时间：{report.generatedAt}</p>
          </section>
        </article>
      </main>}
      <footer>Destiny Atlas · Open-source cultural exploration toolkit · 数据默认不离开设备</footer>
    </>
  )
}

export default App
