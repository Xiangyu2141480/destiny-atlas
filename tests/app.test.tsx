import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../src/App'
import { selectDetailedReport } from './helpers'

describe('application flow', () => {
  it('lets the user pause and resume continuous motion', () => {
    render(<App />)
    const pause = screen.getByRole('button', { name: '暂停动态' })
    fireEvent.click(pause)
    expect(screen.getByRole('button', { name: '开启动态' })).toHaveAttribute('aria-pressed', 'true')
    expect(document.documentElement.dataset.motion).toBe('paused')
    fireEvent.click(screen.getByRole('button', { name: '开启动态' }))
    expect(document.documentElement.dataset.motion).toBe('running')
  })

  it('uses the themed city picker and updates the selected place', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: '选择出生城市' }))
    expect(screen.getByRole('listbox', { name: '选择出生城市' })).toBeInTheDocument()
    fireEvent.change(screen.getByRole('searchbox', { name: '搜索出生城市' }), { target: { value: '新疆' } })
    expect(screen.getByRole('option', { name: /乌鲁木齐/ })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: /上海 \/ Shanghai/ })).not.toBeInTheDocument()
    fireEvent.change(screen.getByRole('searchbox', { name: '搜索出生城市' }), { target: { value: 'urumqi' } })
    expect(screen.getByRole('option', { name: /乌鲁木齐/ })).toBeInTheDocument()
    fireEvent.change(screen.getByRole('searchbox', { name: '搜索出生城市' }), { target: { value: 'Shanghai' } })
    fireEvent.click(screen.getByRole('option', { name: /上海 \/ Shanghai/ }))
    expect(screen.getByRole('button', { name: '选择出生城市' })).toHaveTextContent('上海 / Shanghai')
    expect(screen.queryByRole('listbox', { name: '选择出生城市' })).not.toBeInTheDocument()
  })

  it('renders and generates a report from the public sample', () => {
    render(<App />)
    selectDetailedReport()
    fireEvent.click(screen.getByText('更多观测设置'))
    fireEvent.change(screen.getByLabelText(/时间轴起始月/), { target: { value: '2026-10' } })
    fireEvent.click(screen.getByRole('button', { name: /生成我的命运图谱/ }))
    expect(screen.getByText('Your Next 24 Months')).toBeInTheDocument()
    expect(screen.getByText('生命路径').parentElement).toHaveTextContent('8')
    expect(screen.getByText(/年度牌 节制/)).toBeInTheDocument()
    expect(screen.getByLabelText('选择要预览的人格插画').children).toHaveLength(16)
    expect(screen.getByRole('button', { name: '预览 ENFJ 外交家插画' })).toHaveClass('is-selected')
    fireEvent.click(screen.getByRole('button', { name: '预览 INTJ 分析家插画' }))
    expect(screen.getByRole('button', { name: '预览 INTJ 分析家插画' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('正在预览 · 本命人格 ENFJ')).toBeInTheDocument()
  })

  it('accepts a custom city and shows it in the deterministic report', () => {
    render(<App />)
    selectDetailedReport()
    fireEvent.click(screen.getByRole('button', { name: '自定义城市' }))
    fireEvent.change(screen.getByLabelText('自定义城市名称'), { target: { value: '测试城' } })
    fireEvent.change(screen.getByLabelText('IANA 时区'), { target: { value: 'Asia/Tokyo' } })
    fireEvent.change(screen.getByLabelText('纬度'), { target: { value: '35' } })
    fireEvent.change(screen.getByLabelText('经度'), { target: { value: '140' } })
    fireEvent.click(screen.getByRole('button', { name: /生成我的命运图谱/ }))
    expect(within(screen.getByRole('region', { name: '详细报告' })).getByText(/测试城/)).toBeInTheDocument()
    expect(screen.getByText(/2002-10-02T17:00:00/)).toBeInTheDocument()
  })

  it('creates a custom city from an unmatched search and prefills its name', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: '选择出生城市' }))
    fireEvent.change(screen.getByRole('searchbox', { name: '搜索出生城市' }), { target: { value: '阿勒泰地区' } })
    fireEvent.click(screen.getByRole('button', { name: '使用“阿勒泰地区”创建自定义城市' }))
    expect(screen.getByLabelText('自定义城市名称')).toHaveValue('阿勒泰地区')
    expect(screen.getByLabelText('IANA 时区')).toHaveValue('Asia/Shanghai')
    expect(screen.getByRole('button', { name: '自定义城市' })).toHaveClass('active')
  })
})
