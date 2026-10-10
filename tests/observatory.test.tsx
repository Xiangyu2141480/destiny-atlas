import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../src/App'
import { selectDetailedReport } from './helpers'

describe('observatory interactions', () => {
  it('reveals a reflection question from the central body and resets it when switching bodies', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: '探索月亮' }))
    fireEvent.click(screen.getByRole('button', { name: '观照月亮：切换思考提示' }))
    expect(screen.getByText('什么能让你重新获得安定？')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '探索水星' }))
    expect(screen.queryByText('什么能让你重新获得安定？')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '观照水星：切换思考提示' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('lets each celestial body reveal its own cultural reading before report generation', () => {
    render(<App />)
    for (const name of ['太阳', '月亮', '水星', '金星', '火星', '木星', '土星', '天王星', '海王星', '冥王星']) {
      const control = screen.getByRole('button', { name: `探索${name}` })
      fireEvent.click(control)
      expect(control).toHaveAttribute('aria-pressed', 'true')
      expect(document.querySelector('.instrument-reading h3')).toHaveTextContent(name)
    }
    expect(screen.queryByRole('heading', { name: '你的命运图谱' })).not.toBeInTheDocument()
  })

  it('keeps optional observation settings in the generated report after collapsing them', () => {
    render(<App />)
    selectDetailedReport()
    const summary = screen.getByText('更多观测设置')
    fireEvent.click(summary)
    fireEvent.change(screen.getByPlaceholderText('如何称呼你'), { target: { value: '观测者' } })
    fireEvent.change(screen.getByLabelText(/时间轴起始月/), { target: { value: '2027-01' } })
    fireEvent.click(summary)
    fireEvent.click(screen.getByRole('button', { name: /生成我的命运图谱/ }))
    expect(screen.getByRole('heading', { name: '观测者命运图谱' })).toBeInTheDocument()
    expect(document.querySelector('.timeline button')).toHaveTextContent('2027-01')
  })

  it('selects overlapping planets through the readable planet controls', () => {
    render(<App />)
    selectDetailedReport()
    fireEvent.click(screen.getByRole('button', { name: /生成我的命运图谱/ }))
    fireEvent.click(screen.getByRole('button', { name: /^选择月亮/ }))
    expect(document.querySelector('.chart-readout')).toHaveTextContent('月亮')
    expect(screen.getByRole('button', { name: /^选择月亮/ })).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(screen.getByRole('button', { name: /^选择木星/ }))
    expect(document.querySelector('.chart-readout')).toHaveTextContent('木星')
    expect(screen.getByRole('button', { name: /^选择月亮/ })).toHaveAttribute('aria-pressed', 'false')
  })

  it('stops pointer parallax as well as continuous animations when paused', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: '暂停动态' }))
    const hero = screen.getByRole('banner')
    const before = hero.style.getPropertyValue('--pointer-x')
    fireEvent.pointerMove(hero, { clientX: 200, clientY: 100, pointerType: 'mouse' })
    expect(hero.style.getPropertyValue('--pointer-x')).toBe(before)
    fireEvent.click(screen.getByRole('button', { name: '开启动态' }))
  })
})
