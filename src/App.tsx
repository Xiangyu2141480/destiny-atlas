import { useEffect, useRef, useState, type FormEvent, type PointerEvent } from 'react'
import { ZodError } from 'zod'
import { ReportReader } from './components/ReportReader'
import type { ReportMode } from './components/ReportModeSelector'
import { BirthForm } from './components/BirthForm'
import { HeroIntro } from './components/HeroIntro'
import { generateDestinyReport } from './engines/report'
import { type BirthInput, type DestinyReport } from './types'

const initial: BirthInput = {
  date: '2002-10-03',
  time: '02:00',
  placeId: 'guangzhou',
  mbti: 'ENFJ',
  focus: 'growth',
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
  const [reportMode, setReportMode] = useState<ReportMode>(() => new URLSearchParams(window.location.search).get('view') === 'detailed' ? 'detailed' : 'summary')
  const [hasOpenedDetailed, setHasOpenedDetailed] = useState(reportMode === 'detailed')
  const [reportGeneration, setReportGeneration] = useState(0)
  const [motionPaused, setMotionPaused] = useState(false)
  const heroRef = useRef<HTMLElement>(null)

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
  }, [report, reportMode])

  useEffect(() => {
    const closedForScreen = new Set<HTMLDetailsElement>()
    const expandForPrint = () => {
      document.querySelectorAll<HTMLDetailsElement>('#report .report-pane:not([hidden]) details:not([open])').forEach((detail) => {
        closedForScreen.add(detail)
        detail.open = true
      })
    }
    const restoreAfterPrint = () => {
      closedForScreen.forEach((detail) => { detail.open = false })
      closedForScreen.clear()
    }
    window.addEventListener('beforeprint', expandForPrint)
    window.addEventListener('afterprint', restoreAfterPrint)
    return () => {
      window.removeEventListener('beforeprint', expandForPrint)
      window.removeEventListener('afterprint', restoreAfterPrint)
      restoreAfterPrint()
    }
  }, [])

  function changeReportMode(mode: ReportMode) {
    setReportMode(mode)
    if (mode === 'detailed') setHasOpenedDetailed(true)
    try {
      const url = new URL(window.location.href)
      url.searchParams.set('view', mode)
      window.history.replaceState(null, '', url)
    } catch {
      // Reading still works in embedded browsers that restrict history updates.
    }
  }

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
      setHasOpenedDetailed(reportMode === 'detailed')
      setReportGeneration((value) => value + 1)
      requestAnimationFrame(() => {
        const section = document.querySelector('#report')
        const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
        if (section && 'scrollIntoView' in section) section.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })
      })
    } catch (reason) {
      setError(reason instanceof ZodError ? reason.issues[0]?.message : reason instanceof Error ? reason.message : '计算失败')
    }
  }

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
          <BirthForm input={input} setInput={setInput} submit={submit} error={error} mode={reportMode} onModeChange={changeReportMode} />
        </div>
        <div className="observatory-footer"><span>✦ <b>AS ABOVE, SO WITHIN.</b></span><p>以星辰为镜，探索属于你的内在宇宙</p><a href="#birth-form">从出生坐标开始 ↓</a></div>

      </header>
      {report && <ReportReader key={reportGeneration} report={report} mode={reportMode} hasOpenedDetailed={hasOpenedDetailed} onModeChange={changeReportMode} onDownload={() => downloadJson(report)} />}
      <footer>Destiny Atlas · Open-source cultural exploration toolkit · 数据默认不离开设备</footer>
    </>
  )
}

export default App
