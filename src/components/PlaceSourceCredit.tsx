import type { Place } from '../types'

export function PlaceSourceCredit({ place }: { place: Place }) {
  if (!place.source) return null
  return <p className="place-source-credit">地点数据：<a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</a> / <a href={`https://www.geonames.org/${place.source.id}`} target="_blank" rel="noreferrer">GeoNames</a> · <a href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank" rel="noreferrer">CC BY-NC 4.0</a>{place.source.modified ? ' · 部分字段已调整' : ''}</p>
}
