import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../src/App'
import { selectDetailedReport } from './helpers'

describe('plain-language period explorer', () => {
  it('switches from months to a complete annual reading and another focus area', () => {
    render(<App />)
    fireEvent.click(screen.getByText('更多观测设置'))
    fireEvent.change(screen.getByLabelText(/时间轴起始月/), { target: { value: '2026-10' } })
    fireEvent.click(screen.getByRole('button', { name: /生成我的命运图谱/ }))
    selectDetailedReport()
    expect(screen.getByRole('heading', { name: '先用大白话说重点' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '按年看 · 5 年' }))
    fireEvent.click(screen.getByRole('button', { name: /查看 2027 年/ }))
    const panel = screen.getByRole('region', { name: '当前阶段解读' })
    expect(within(panel).getByRole('heading', { name: /2027 年/ })).toBeInTheDocument()
    expect(screen.getByText('第 4 季度 · 10—12 月')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '钱与消费' }))
    expect(within(panel).getByText(/承诺超过能力会让关系更难受/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '按月看 · 24 个月' }))
    expect(document.querySelectorAll('.timeline button')).toHaveLength(24)
    expect(screen.queryByText('第 4 季度 · 10—12 月')).not.toBeInTheDocument()
  })
})
