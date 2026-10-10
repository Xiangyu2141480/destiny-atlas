const sections = ['摘要', '八字', '西方天文', '原型与人格', '年度与月度', '综合建议', '方法与局限']

export function ReportNavigation() {
  return (
    <aside className="toc glass">
      <p className="eyebrow">✦ YOUR ATLAS</p>
      <nav className="toc-links" aria-label="报告章节">
        {sections.map((name, index) => (
          <a key={name} href={`#s${index + 1}`}><span>{String(index + 1).padStart(2, '0')}</span>{name}<i aria-hidden="true">↗</i></a>
        ))}
      </nav>
      <a className="back-to-form" href="#report">↑ 切换阅读版本 / 保存</a>
    </aside>
  )
}
