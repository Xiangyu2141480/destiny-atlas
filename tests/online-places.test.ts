import { afterEach, describe, expect, it, vi } from 'vitest'
import { searchOnlinePlaces } from '../src/services/onlinePlaces'

afterEach(() => vi.unstubAllGlobals())

describe('optional online place lookup', () => {
  it('sends only the city query and converts verified coordinates and timezone into a selectable place', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({ results: [
      { id: 1806097, name: '宁德市', country: '中国', country_code: 'CN', admin1: '福建省', latitude: 26.66167, longitude: 119.52278, timezone: 'Asia/Shanghai' },
    ] }), { status: 200 }))
    vi.stubGlobal('fetch', fetcher)
    const results = await searchOnlinePlaces('宁德')
    expect(results[0].place).toEqual({ id: 'custom', name: '宁德市', country: '中国·福建省', latitude: 26.66167, longitude: 119.52278, timezone: 'Asia/Shanghai', source: { provider: 'open-meteo', id: 1806097, license: 'CC BY-NC 4.0', modified: false } })
    const url = new URL(String(fetcher.mock.calls[0][0]))
    expect(url.origin).toBe('https://geocoding-api.open-meteo.com')
    expect(url.searchParams.get('name')).toBe('宁德')
    expect([...url.searchParams.keys()].sort()).toEqual(['count', 'format', 'language', 'name'])
    expect(fetcher.mock.calls[0][1].credentials).toBe('omit')
  })

  it('filters unverified coordinates and invalid IANA zones instead of guessing', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ results: [
      { id: 1, name: 'Bad latitude', latitude: 100, longitude: 0, timezone: 'Europe/London' },
      { id: 2, name: 'Bad timezone', latitude: 35, longitude: 140, timezone: 'Invalid/Zone' },
      { id: 3, name: 'Missing longitude', latitude: 35, timezone: 'Asia/Tokyo' },
    ] }))))
    expect(await searchOnlinePlaces('Test')).toEqual([])
  })

  it('normalizes mainland zones and retains provenance while allowing missing region names', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ results: [
      { id: 4, name: '乌鲁木齐', country_code: 'CN', country: '中国', latitude: 43.8, longitude: 87.6, timezone: 'Asia/Urumqi' },
      { id: 5, name: 'Unnamed region', country: '', latitude: 35, longitude: 140, timezone: 'Asia/Tokyo' },
    ] }))))
    const results = await searchOnlinePlaces('Test')
    expect(results[0].place.timezone).toBe('Asia/Shanghai')
    expect(results[0].place.source).toMatchObject({ provider: 'open-meteo', modified: true })
    expect(results[1].place.country).toBe('未知地区')
  })

  it('reports network failures and does not attempt any request for a short query', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response('', { status: 429 }))
    vi.stubGlobal('fetch', fetcher)
    await expect(searchOnlinePlaces('京')).rejects.toThrow(/至少/)
    expect(fetcher).not.toHaveBeenCalled()
    await expect(searchOnlinePlaces('Beijing')).rejects.toThrow(/稍后/)
  })
})
