import { fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from '../src/App'
import * as engine from '../src/engines/report'

afterEach(() => {
  window.history.replaceState({}, '', '/')
  vi.restoreAllMocks()
})

function selectMode(name: '精简版' | '详细版') {
  fireEvent.click(within(screen.getByRole('group', { name: '阅读版本' })).getByRole('radio', { name }))
}

describe('report reading modes', () => {
  it('defaults to a short reading without mounting charts or the sixteen-image gallery', () => {
    render(<App />)
    expect(within(screen.getByRole('group', { name: '生成报告版本' })).getByRole('radio', { name: '精简版' })).toBeChecked()
    fireEvent.click(screen.getByRole('button', { name: /生成我的命运图谱/ }))
    const summary = screen.getByRole('region', { name: '精简报告' })
    expect(within(summary).getByRole('heading', { name: '先做这三件事' })).toBeInTheDocument()
    expect(within(summary).getAllByRole('listitem')).toHaveLength(3)
    expect(document.querySelector('.natal-chart')).toBeNull()
    expect(document.querySelectorAll('.personality-card')).toHaveLength(0)
  })

  it('switches views without recomputing or losing detailed selections', () => {
    const generate = vi.spyOn(engine, 'generateDestinyReport')
    render(<App />)
    fireEvent.click(screen.getByText('更多观测设置'))
    fireEvent.change(screen.getByLabelText(/时间轴起始月/), { target: { value: '2026-10' } })
    fireEvent.click(screen.getByRole('button', { name: /生成我的命运图谱/ }))
    fireEvent.click(screen.getByText('更多', { exact: true }))
    expect(screen.getByRole('button', { name: '导出完整 JSON' })).toBeInTheDocument()
    selectMode('详细版')
    expect(screen.getByText('更多', { exact: true }).closest('details')).not.toHaveAttribute('open')
    fireEvent.click(screen.getByRole('button', { name: '按年看 · 5 年' }))
    fireEvent.click(screen.getByRole('button', { name: '查看 2027 年' }))
    fireEvent.click(screen.getByRole('button', { name: '钱与消费' }))
    selectMode('精简版')
    expect(screen.queryByRole('button', { name: '查看 2027 年' })).not.toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: '关注领域' })).toHaveValue('finance')
    fireEvent.change(screen.getByRole('combobox', { name: '关注领域' }), { target: { value: 'career' } })
    selectMode('详细版')
    expect(screen.getByRole('button', { name: '查看 2027 年' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: '事业与学习' })).toHaveAttribute('aria-pressed', 'true')
    expect(generate).toHaveBeenCalledTimes(1)
  })

  it('opens the yearly details directly from the short reading', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /生成我的命运图谱/ }))
    fireEvent.click(screen.getByRole('button', { name: '展开五年解读' }))
    expect(within(screen.getByRole('group', { name: '阅读版本' })).getByRole('radio', { name: '详细版' })).toBeChecked()
    expect(screen.getByRole('button', { name: '按年看 · 5 年' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('allows a detailed link without putting birth information in the URL', () => {
    window.history.replaceState({}, '', '/?view=detailed')
    render(<App />)
    expect(within(screen.getByRole('group', { name: '生成报告版本' })).getByRole('radio', { name: '详细版' })).toBeChecked()
    fireEvent.click(screen.getByRole('button', { name: /生成我的命运图谱/ }))
    selectMode('精简版')
    expect(new URLSearchParams(window.location.search).get('view')).toBe('summary')
    expect(window.location.search).not.toContain('2002')
  })

  it('prints the active reading only and leaves hidden detailed explanations collapsed', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /生成我的命运图谱/ }))
    selectMode('详细版')
    const detail = screen.getByText('四柱信息怎么看').closest('details')!
    selectMode('精简版')
    fireEvent(window, new Event('beforeprint'))
    expect(detail.open).toBe(false)
    expect(screen.getByRole('region', { name: '精简报告' })).toBeInTheDocument()
    expect(document.querySelector('.detailed-pane')).toHaveAttribute('hidden')
    fireEvent(window, new Event('afterprint'))
  })

  it('starts fresh when generating for another person after exploring the detailed view', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /生成我的命运图谱/ }))
    selectMode('详细版')
    fireEvent.click(screen.getByRole('button', { name: '钱与消费' }))
    selectMode('精简版')
    fireEvent.click(screen.getByText('更多观测设置'))
    fireEvent.change(screen.getByPlaceholderText('如何称呼你'), { target: { value: '新朋友' } })
    fireEvent.click(screen.getByRole('button', { name: /生成我的命运图谱/ }))
    expect(screen.getByRole('heading', { name: '新朋友命运图谱' })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: '关注领域' })).toHaveValue('growth')
    expect(document.querySelector('.detailed-pane')).toBeNull()
  })
})
