import { useRef, useState } from 'react'
import type { DestinyReport, Focus } from '../types'
import { CompactReport } from './CompactReport'
import { DetailedReport } from './DetailedReport'
import { ReportModeSelector, type ReportMode } from './ReportModeSelector'

export function ReportReader({ report, mode, hasOpenedDetailed, onModeChange, onDownload }: {
  report: DestinyReport
  mode: ReportMode
  hasOpenedDetailed: boolean
  onModeChange: (mode: ReportMode) => void
  onDownload: () => void
}) {
  const [periodUnit, setPeriodUnit] = useState<'month' | 'year'>('month')
  const [focus, setFocus] = useState<Focus>(report.input.focus ?? 'growth')
  const moreRef = useRef<HTMLDetailsElement>(null)

  function closeTools() {
    const menu = moreRef.current
    if (!menu) return
    const hadFocus = menu.contains(document.activeElement)
    menu.open = false
    if (hadFocus) menu.querySelector<HTMLElement>('summary')?.focus()
  }

  function changeReadingMode(next: ReportMode) {
    closeTools()
    onModeChange(next)
    requestAnimationFrame(() => document.getElementById('report')?.scrollIntoView?.({
      behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start',
    }))
  }

  function openDetailed(target: 'report' | 's5') {
    if (target === 's5') setPeriodUnit('year')
    onModeChange('detailed')
    requestAnimationFrame(() => {
      const section = document.getElementById(target)
      const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
      section?.scrollIntoView?.({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
      section?.focus({ preventScroll: true })
    })
  }

  return (
    <main id="report" className="report-reader report-reveal" data-view={mode} tabIndex={-1}>
      <div className="reader-toolbar">
        <div className="reader-choice"><strong>选择报告版本</strong><ReportModeSelector value={mode} onChange={changeReadingMode} label="阅读版本" /></div>
        <div className="reader-tools">
          <button type="button" onClick={() => window.print()}>保存为 PDF</button>
          <details className="reader-more" ref={moreRef} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) closeTools() }} onKeyDown={(event) => { if (event.key === 'Escape') { event.preventDefault(); closeTools() } }}><summary>更多</summary><div><button type="button" onClick={() => { onDownload(); closeTools() }}>导出完整 JSON</button><a href="#birth-form" onClick={closeTools}>修改出生信息</a></div></details>
        </div>
      </div>
      <div className="report-pane compact-pane" hidden={mode !== 'summary'}>
        <CompactReport report={report} focus={focus} onFocusChange={setFocus} onYear={() => openDetailed('s5')} onDetailed={() => openDetailed('report')} />
      </div>
      {hasOpenedDetailed && <div className="report-pane detailed-pane" hidden={mode !== 'detailed'}><DetailedReport report={report} periodUnit={periodUnit} onPeriodChange={setPeriodUnit} focus={focus} onFocusChange={setFocus} /></div>}
    </main>
  )
}
