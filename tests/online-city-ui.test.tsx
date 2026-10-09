import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from '../src/App'

const result = { id: 1806097, name: '宁德市', country: '中国', country_code: 'CN', admin1: '福建省', latitude: 26.66167, longitude: 119.52278, timezone: 'Asia/Shanghai' }
afterEach(() => vi.unstubAllGlobals())

describe('online lookup consent and selection', () => {
  it('does not query on mount or opening the panel, then applies only the chosen result', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({ results: [result] })))
    vi.stubGlobal('fetch', fetcher)
    render(<App />)
    fireEvent.click(screen.getByText('联网查找更多城市'))
    fireEvent.change(screen.getByLabelText('联网城市关键词'), { target: { value: 'Ningde' } })
    expect(fetcher).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: '联网搜索' }))
    const option = await screen.findByRole('button', { name: '使用联网地点：宁德市 中国·福建省' })
    expect(screen.getByRole('button', { name: '选择出生城市' })).toHaveTextContent('广州')
    fireEvent.click(option)
    expect(screen.getByLabelText('自定义城市名称')).toHaveValue('宁德市')
    expect(screen.getByLabelText('纬度')).toHaveValue(26.66167)
    expect(screen.getByLabelText('经度')).toHaveValue(119.52278)
    expect(screen.getByLabelText('IANA 时区')).toHaveValue('Asia/Shanghai')
  })

  it('discards a pending response if the keyword is changed', async () => {
    let finish: (response: Response) => void = () => undefined
    vi.stubGlobal('fetch', vi.fn(() => new Promise<Response>((resolve) => { finish = resolve })))
    render(<App />)
    fireEvent.click(screen.getByText('联网查找更多城市'))
    fireEvent.change(screen.getByLabelText('联网城市关键词'), { target: { value: 'Ningde' } })
    fireEvent.click(screen.getByRole('button', { name: '联网搜索' }))
    fireEvent.change(screen.getByLabelText('联网城市关键词'), { target: { value: 'Suzhou' } })
    await act(async () => finish(new Response(JSON.stringify({ results: [result] }))))
    await waitFor(() => expect(screen.getByRole('button', { name: '联网搜索' })).toBeEnabled())
    expect(screen.queryByRole('button', { name: /使用联网地点/ })).not.toBeInTheDocument()
  })
})
