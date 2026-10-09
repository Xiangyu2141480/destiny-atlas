import { useEffect, useRef, useState } from 'react'
import { searchOnlinePlaces, type OnlinePlace } from '../services/onlinePlaces'
import type { Place } from '../types'

export function OnlineCitySearch({ onChoose }: { onChoose: (place: Place) => void }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<OnlinePlace[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)
  const controllerRef = useRef<AbortController | null>(null)

  useEffect(() => () => controllerRef.current?.abort(), [])

  async function search() {
    if (loading) return
    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller
    setLoading(true)
    setError('')
    setResults([])
    setSearched(false)
    const timeout = window.setTimeout(() => {
      if (controllerRef.current !== controller) return
      controller.abort()
      setLoading(false)
      setError('查询超时了，可以重试，或继续用离线城市和手动坐标。')
    }, 8000)
    try {
      const places = await searchOnlinePlaces(query, controller.signal)
      if (controller.signal.aborted) return
      setResults(places)
      setSearched(true)
    } catch (reason) {
      if (controller.signal.aborted) return
      setError(reason instanceof Error && reason.message.includes('请') ? reason.message : '网络没有连上，可以重试，或继续用离线城市和手动坐标。')
    } finally {
      window.clearTimeout(timeout)
      if (!controller.signal.aborted) setLoading(false)
    }
  }

  return (
    <details className="online-city-search">
      <summary>联网查找更多城市</summary>
      <p>点击“联网搜索”会把城市关键词发送给 Open-Meteo / GeoNames，不发送姓名、生日、出生时间或 MBTI。结果需要你确认后才会使用。</p>
      <div className="online-query">
        <input aria-label="联网城市关键词" placeholder="城市中文或英文名" value={query} maxLength={80} onChange={(event) => {
          controllerRef.current?.abort()
          setLoading(false)
          setQuery(event.target.value)
          setResults([])
          setSearched(false)
          setError('')
        }} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); void search() } }} />
        <button type="button" disabled={loading} onClick={() => void search()}>{loading ? '查询中…' : '联网搜索'}</button>
      </div>
      {loading && <p role="status">正在查询城市和时区…</p>}
      {error && <p className="online-error" role="alert">{error}</p>}
      {searched && !results.length && <p role="status">没有找到带有效坐标和时区的结果。可以试试英文名，或手动填写。</p>}
      {results.length > 0 && <>
        <p role="status">找到 {results.length} 个地点，请核对地区，避免选到同名城市。</p>
        <div className="online-results">{results.map(({ sourceId, place }) => <button type="button" key={sourceId} aria-label={`使用联网地点：${place.name} ${place.country}`} onClick={() => {
          onChoose(place)
          setResults([])
          setSearched(false)
        }}><b>{place.name}</b><span>{place.country}</span><small>{place.latitude.toFixed(4)}, {place.longitude.toFixed(4)} · {place.timezone === 'Asia/Shanghai' ? '中国标准时间 UTC+8' : place.timezone}</small></button>)}</div>
      </>}
      <small>地点来源：<a href="https://open-meteo.com/en/docs/geocoding-api" target="_blank" rel="noreferrer">Open-Meteo</a> / <a href="https://www.geonames.org/" target="_blank" rel="noreferrer">GeoNames</a>，数据许可 <a href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank" rel="noreferrer">CC BY-NC 4.0（非商业）</a>。离线列表始终可用。</small>
    </details>
  )
}
