import { useEffect, useMemo, useRef, useState, type FormEvent, type PointerEvent } from 'react'
import { ZodError } from 'zod'
import { ArcaneSelect } from './components/ArcaneSelect'
import { CelestialInstrument } from './components/CelestialInstrument'
import { NatalChart } from './components/NatalChart'
import { PersonalityCards } from './components/PersonalityCards'
import { PLACES } from './data/places'
import { generateDestinyReport } from './engines/report'
import { MBTI_TYPES, type BirthInput, type DestinyReport, type Focus } from './types'

const initial: BirthInput = {
  date: '2002-10-03',
  time: '02:00',
  placeId: 'guangzhou',
  mbti: 'ENFJ',
  focus: 'growth',
}

const emptyCustomPlace = {
  id: 'custom' as const,
  name: '',
  country: '自定义地点',
  latitude: 31.2304,
  longitude: 121.4737,
  timezone: 'Asia/Shanghai',
}

const focusLabels: Record<Focus, string> = {
  career: '事业', finance: '财富', relationships: '关系', growth: '成长', balance: '平衡',
}

function placeMeta(place: (typeof PLACES)[number]) {
  return place.timezone === 'Asia/Shanghai'
    ? `${place.country} · 中国标准时间 UTC+8`
    : `${place.country} · ${place.timezone}`
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
  const heroRef = useRef<HTMLElement>(null)
  const current = report?.timeline[selectedMonth]
  const selectedFocus = input.focus ?? 'growth'
  const customPlace = input.customPlace ?? emptyCustomPlace

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
    if (event.pointerType === 'touch' || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
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
        <div className="rune-field" aria-hidden="true"><span>☿</span><span>△</span><span>☉</span><span>♄</span><span>◇</span></div>
        <nav>
          <a className="brand" href="#" aria-label="Destiny Atlas 首页"><i>✦</i> DESTINY <span>ATLAS</span></a>
          <div className="nav-meta"><span>ARCANE OBSERVATORY</span><span className="privacy-pill">本地计算 · 不上传</span></div>
        </nav>
        <div className="hero-grid">
          <section className="intro">
            <p className="eyebrow"><i /> PRIVATE CELESTIAL READING</p>
            <h1>Read the sky.<br /><em>Map the self.</em></h1>
            <p className="lede">从确定性的时间、历法与天文位置出发，以多种文化框架探索过去、理解当下、规划未来。</p>
            <div className="system-list"><span>八字</span><span>天文</span><span>塔罗数字学</span><span>生命灵数</span><span>MBTI</span></div>
            <div className="hero-orbit"><CelestialInstrument /></div>
          </section>
          <form className="birth-form glass" onSubmit={submit}>
            <div className="form-heading"><span>Ⅰ</span><div><p className="eyebrow">BEGIN THE RITUAL</p><h2>校准你的出生坐标</h2><p>所有信息仅在当前浏览器中处理；带 * 项为必填</p></div></div>
            <label><span>昵称 <small>可选</small></span><input value={input.name ?? ''} onChange={(e) => setInput({ ...input, name: e.target.value })} placeholder="如何称呼你" /></label>
            <div className="two">
              <label><span>出生日期 *</span><input type="date" required value={input.date} onChange={(e) => setInput({ ...input, date: e.target.value })} /></label>
              <label><span>出生时间 *</span><input type="time" required aria-describedby="birth-time-hint" value={input.time} onChange={(e) => setInput({ ...input, time: e.target.value })} /><small id="birth-time-hint" className="field-hint">请填写出生地当时的当地钟表时间</small></label>
            </div>
            <div className="place-mode" role="group" aria-label="城市输入方式">
              <button type="button" className={input.placeId !== 'custom' ? 'active' : ''} onClick={() => setInput({ ...input, placeId: initial.placeId })}>搜索城市</button>
              <button type="button" className={input.placeId === 'custom' ? 'active' : ''} onClick={() => setInput({ ...input, placeId: 'custom', customPlace })}>自定义城市</button>
            </div>
            {input.placeId !== 'custom' ? (
              <label><span>出生城市 * <small>{PLACES.length} 个离线地点</small></span>
                <ArcaneSelect
                  ariaLabel="选择出生城市"
                  value={input.placeId}
                  searchable
                  searchPlaceholder="搜索中文、拼音或省份"
                  options={PLACES.map((place) => ({ value: place.id, label: place.name, meta: placeMeta(place) }))}
                  onChange={(placeId) => setInput({ ...input, placeId })}
                  onCreateFromQuery={(name) => setInput({
                    ...input,
                    placeId: 'custom',
                    customPlace: { ...customPlace, name },
                  })}
                />
                <small className="field-hint">城市用于时区与经纬度换算；无匹配时可按当前输入创建</small>
              </label>
            ) : (
              <fieldset className="custom-place">
                <legend>自定义坐标 <small>经校验后进入相同确定性计算</small></legend>
                <label><span>城市名称 *</span><input required aria-label="自定义城市名称" value={customPlace.name} onChange={(event) => setInput({ ...input, customPlace: { ...customPlace, name: event.target.value } })} placeholder="例如：阿勒泰" /></label>
                <label><span>IANA 时区 *</span><input required aria-label="IANA 时区" aria-describedby="timezone-hint" value={customPlace.timezone} onChange={(event) => setInput({ ...input, customPlace: { ...customPlace, timezone: event.target.value } })} placeholder="例如：Asia/Shanghai" /><small id="timezone-hint" className="field-hint">中国大陆统一使用 Asia/Shanghai</small></label>
                <div className="two">
                  <label><span>纬度 *</span><input required type="number" min="-90" max="90" step="any" aria-label="纬度" value={customPlace.latitude} onChange={(event) => setInput({ ...input, customPlace: { ...customPlace, latitude: event.target.valueAsNumber } })} /></label>
                  <label><span>经度 *</span><input required type="number" min="-180" max="180" step="any" aria-label="经度" value={customPlace.longitude} onChange={(event) => setInput({ ...input, customPlace: { ...customPlace, longitude: event.target.valueAsNumber } })} /></label>
                </div>
                <p className="field-hint">请输入十进制度数：北纬、东经为正；南纬、西经为负</p>
              </fieldset>
            )}
            <div className="two">
              <label><span>人格坐标 · MBTI</span>
                <ArcaneSelect
                  ariaLabel="选择 MBTI"
                  value={input.mbti}
                  options={MBTI_TYPES.map((type) => ({ value: type, label: type }))}
                  onChange={(mbti) => setInput({ ...input, mbti: mbti as BirthInput['mbti'] })}
                />
              </label>
              <label><span>本次观测主题</span>
                <ArcaneSelect
                  ariaLabel="选择观测主题"
                  value={selectedFocus}
                  options={Object.entries(focusLabels).map(([value, label]) => ({ value, label }))}
                  onChange={(focus) => setInput({ ...input, focus: focus as Focus })}
                />
              </label>
            </div>
            <label><span>时间轴起始月 <small>可选 · 默认本月</small></span><input type="month" value={input.startMonth ?? ''} onChange={(e) => setInput({ ...input, startMonth: e.target.value || undefined })} /></label>
            <label className="check"><input type="checkbox" checked={!!input.trueSolarTime} onChange={(e) => setInput({ ...input, trueSolarTime: e.target.checked })} /><span>使用真太阳时近似修正<small>按经度差与均时差修正八字计算时间</small></span></label>
            {error && <p className="error" role="alert">{error}</p>}
            <button className="primary" type="submit"><span>开启观测 · 生成我的命运图谱</span><b>↗</b></button>
            <p className="fine">文化娱乐与自我探索用途，不构成医疗、法律、投资或人生决策建议。</p>
          </form>
        </div>
        <div className="scroll-cue" aria-hidden="true"><span>SCROLL TO OBSERVE</span><i /></div>
      </header>

      {report && <main id="report" className="report-reveal">
        <aside className="toc glass">
          <p className="eyebrow">YOUR ATLAS</p>
          {['摘要', '八字', '西方天文', '原型与人格', '24月时间轴', '综合建议', '方法与局限'].map((name, i) => <a key={name} href={`#s${i + 1}`}>{String(i + 1).padStart(2, '0')} {name}</a>)}
          <button onClick={() => window.print()}>打印 / 另存 PDF</button>
          <button onClick={() => downloadJson(report)}>导出 JSON</button>
        </aside>
        <article className="report">
          <section id="s1" className="report-hero">
            <div className="reveal-rule"><span>OBSERVATION COMPLETE</span><i /></div>
            <p className="eyebrow">PERSONAL REPORT · ENGINE {report.engineVersion}</p>
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
            <div className="astro-grid"><NatalChart data={report.astrology} /><div className="planet-list">{report.astrology.positions.map((p) => <div key={p.body}><b>{p.body}</b><span>{p.sign} {p.degreeInSign.toFixed(2)}°</span><code>{p.longitude.toFixed(4)}°</code></div>)}</div></div>
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
            <div className="personality-reading"><p className="eyebrow">PERSONALITY · ORIGINAL SIGIL ATLAS</p><h2>{report.personality.type} · {report.personality.title}</h2><p>{report.personality.summary}</p><ul>{report.personality.cautions.map((item) => <li key={item}>{item}</li>)}</ul><PersonalityCards selected={report.personality.type} /></div>
          </section>

          <section id="s5" className="panel">
            <div className="section-title"><span>05</span><div><h2>Your Next 24 Months</h2><p>点击月份查看计算依据与行动提示</p></div></div>
            <div className="timeline-wrap"><div className="timeline" role="list">{report.timeline.map((item, index) => <button key={item.month} className={selectedMonth === index ? 'active' : ''} onClick={() => setSelectedMonth(index)} aria-pressed={selectedMonth === index}><i /><small>{item.month}</small><b>{item.personalMonth}</b><span>{item.themes[0]}</span></button>)}</div></div>
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
