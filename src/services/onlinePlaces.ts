import { z } from 'zod'
import type { Place } from '../types'

const geocodedPlace = z.object({
  id: z.number().int().positive(),
  name: z.string().trim().min(1).max(80),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  timezone: z.string().refine((zone) => {
    try { new Intl.DateTimeFormat('en', { timeZone: zone }).format(); return zone.includes('/') } catch { return false }
  }),
  country: z.string().optional(),
  country_code: z.string().optional(),
  admin1: z.string().optional(),
})

export interface OnlinePlace {
  sourceId: string
  place: Place
}

export async function searchOnlinePlaces(query: string, signal?: AbortSignal): Promise<OnlinePlace[]> {
  const keyword = query.trim()
  if (keyword.length < 2 || keyword.length > 80) throw new Error('请至少输入 2 个字符，最多 80 个字符。')
  const url = new URL('https://geocoding-api.open-meteo.com/v1/search')
  url.search = new URLSearchParams({ name: keyword, count: '10', language: 'zh', format: 'json' }).toString()
  const response = await fetch(url.toString(), { signal, credentials: 'omit', referrerPolicy: 'no-referrer', headers: { Accept: 'application/json' } })
  if (!response.ok) throw new Error(response.status === 429 ? '查询过于频繁，请稍后再试。' : '联网查询暂时不可用，可以继续用离线城市或手动填写坐标。')
  const payload = z.object({ results: z.array(z.unknown()).optional(), error: z.boolean().optional() }).parse(await response.json())
  if (payload.error) throw new Error('地点服务未能完成查询，请稍后再试。')
  return (payload.results ?? []).slice(0, 10).flatMap((raw) => {
    const parsed = geocodedPlace.safeParse(raw)
    if (!parsed.success) return []
    const result = parsed.data
    return [{
      sourceId: String(result.id),
      place: {
        id: 'custom',
        name: result.name,
        country: [result.country?.trim() || '未知地区', result.admin1?.trim()].filter(Boolean).join('·').slice(0, 80),
        latitude: result.latitude,
        longitude: result.longitude,
        timezone: result.country_code === 'CN' ? 'Asia/Shanghai' : result.timezone,
        source: { provider: 'open-meteo', id: result.id, license: 'CC BY-NC 4.0', modified: result.country_code === 'CN' && result.timezone !== 'Asia/Shanghai' },
      },
    }]
  })
}
