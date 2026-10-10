import { useId } from 'react'

export type ReportMode = 'summary' | 'detailed'

export function ReportModeSelector({ value, onChange, label }: {
  value: ReportMode
  onChange: (mode: ReportMode) => void
  label: string
}) {
  const id = useId()
  return (
    <fieldset className="report-mode-selector" aria-label={label}>
      <legend>{label}</legend>
      <div className="mode-options">
        <label><input type="radio" aria-label="精简版" name={id} value="summary" checked={value === 'summary'} onChange={() => onChange('summary')} /><span>精简版</span></label>
        <label><input type="radio" aria-label="详细版" name={id} value="detailed" checked={value === 'detailed'} onChange={() => onChange('detailed')} /><span>详细版</span></label>
      </div>
      <p>{value === 'summary' ? '先看重点和三条建议，随时可以展开。' : '完整图谱、五年与月度解读，以及计算依据。'}</p>
    </fieldset>
  )
}
