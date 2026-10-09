import { CelestialInstrument } from './CelestialInstrument'

export function HeroIntro() {
  return (
    <section className="intro" aria-label="探索命运图谱">
      <p className="eyebrow"><i /> ARCANE OBSERVATORY <span className="edition">VOL. 01</span></p>
      <h1>Read the sky.<br /><em>Map the self.</em></h1>
      <p className="intro-subtitle">循星而行，观照自我。</p>
      <p className="lede">让时间、星辰与古老的文化符号，<br />成为理解自己的另一种视角。</p>
      <div className="hero-orbit" id="celestial-study"><CelestialInstrument /></div>
      <div className="system-list" aria-label="五种探索视角">
        <span><i aria-hidden="true">☷</i>八字</span><span><i aria-hidden="true">☉</i>天文</span>
        <span><i aria-hidden="true">✧</i>塔罗数字学</span><span><i aria-hidden="true">Ⅷ</i>生命灵数</span><span><i aria-hidden="true">◇</i>MBTI</span>
      </div>
      <div className="atlas-facts"><div><strong>82</strong><span>离线地点</span></div><div><strong>16</strong><span>人格原型</span></div><div><strong>24</strong><span>个月的探索</span></div><p>多种文化视角<br />一份专属图谱</p></div>
    </section>
  )
}
