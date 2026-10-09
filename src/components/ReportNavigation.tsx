const sections = ['摘要', '八字', '西方天文', '原型与人格', '24月时间轴', '综合建议', '方法与局限']

export function ReportNavigation({ onDownload }: { onDownload: () => void }) {
  return (
    <aside className="toc glass">
      <p className="eyebrow">✦ YOUR ATLAS</p>
      <nav className="toc-links" aria-label="报告章节">
        {sections.map((name, index) => (
          <a key={name} href={`#s${index + 1}`}><span>{String(index + 1).padStart(2, '0')}</span>{name}<i aria-hidden="true">↗</i></a>
        ))}
      </nav>
      <div className="report-actions">
        <button type="button" onClick={() => window.print()}>打印 / 另存 PDF</button>
        <button type="button" onClick={onDownload}>导出 JSON <span aria-hidden="true">↓</span></button>
      </div>
      <a className="back-to-form" href="#birth-form">↖ 调整出生坐标</a>
    </aside>
  )
}
