import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../src/App'

describe('printing detailed readings', () => {
  it('temporarily includes collapsed explanations and restores the reading state after printing', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /生成我的命运图谱/ }))
    const closed = screen.getByText('四柱信息怎么看').closest('details')!
    const open = screen.getByText('你的做事主题').closest('details')!
    expect(closed.open).toBe(false)
    expect(open.open).toBe(true)
    fireEvent(window, new Event('beforeprint'))
    expect(closed.open).toBe(true)
    fireEvent(window, new Event('afterprint'))
    expect(closed.open).toBe(false)
    expect(open.open).toBe(true)
  })
})
