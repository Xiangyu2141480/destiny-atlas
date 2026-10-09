import type { ReportExplanation } from '../types'

export function PlainLanguageSummary({ explanation }: { explanation: ReportExplanation }) {
  return (
    <div className="plain-summary">
      <h3>先用大白话说重点</h3>
      <p className="reading-intro">{explanation.introduction}</p>
      <div className="explanation-grid">
        {explanation.highlights.map((item, index) => (
          <details className="reading-highlight" key={item.title} open={index < 2}>
            <summary>{item.title}<span aria-hidden="true">＋</span></summary>
            <p>{item.meaning}</p>
            <p className="practical-step"><b>可以试试：</b>{item.action}</p>
            <small>依据：{item.basis}</small>
          </details>
        ))}
      </div>
      <div className="first-steps"><b>如果不知道从哪开始，就做这三步</b><ol>{explanation.firstSteps.map((step) => <li key={step}>{step}</li>)}</ol></div>
      <details className="reading-sources">
        <summary>联网查证计算方法与资料</summary>
        <p>下面是计算工具及其公开说明。打开链接会前往第三方网站，不会附带你的出生信息。资料用于了解方法，不代表验证了命运预测。</p>
        <div><a href="https://github.com/cosinekitty/astronomy" target="_blank" rel="noreferrer">Astronomy Engine：天体位置计算 ↗</a><a href="https://github.com/6tail/lunar-javascript" target="_blank" rel="noreferrer">lunar-javascript：历法与基础四柱 ↗</a><a href="https://moment.github.io/luxon/#/zones" target="_blank" rel="noreferrer">Luxon：时区与日期换算 ↗</a><a href="https://www.bing.com/search?q=数字学+个人年+计算规则" target="_blank" rel="noreferrer">联网搜索：个人年计算规则 ↗</a><a href="https://www.bing.com/search?q=tarot+year+card+numerology+conventions" target="_blank" rel="noreferrer">联网搜索：年度塔罗的不同约定 ↗</a></div>
      </details>
    </div>
  )
}
