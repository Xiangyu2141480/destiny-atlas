import { describe, expect, it } from 'vitest'
import { PLACES } from '../src/data/places'

const addedPrefectureCityIds = [
  'baoding', 'tangshan', 'qinhuangdao', 'datong', 'baotou', 'dalian', 'anshan',
  'jilin-city', 'qiqihar', 'suzhou-js', 'wuxi', 'changzhou', 'xuzhou', 'ningbo',
  'wenzhou', 'jiaxing', 'shaoxing', 'wuhu', 'xiamen', 'quanzhou', 'ningde', 'ganzhou',
  'qingdao', 'yantai', 'weifang', 'luoyang', 'yichang', 'xiangyang', 'zhuzhou',
  'shenzhen', 'zhuhai', 'foshan', 'dongguan', 'huizhou', 'guilin', 'sanya',
  'mianyang', 'xianyang', 'kashgar',
]

describe('offline place gazetteer', () => {
  it('includes at least 30 additional Chinese prefecture-level cities', () => {
    const ids = new Set(PLACES.map((place) => place.id))
    expect(addedPrefectureCityIds).toHaveLength(39)
    expect(addedPrefectureCityIds.every((id) => ids.has(id))).toBe(true)
    expect(PLACES.find((place) => place.id === 'ningde')?.country).toBe('中国·福建')
    expect(PLACES.find((place) => place.id === 'suzhou-js')?.country).toBe('中国·江苏')
  })

  it('uses valid coordinates and Asia/Shanghai for added mainland cities', () => {
    for (const id of addedPrefectureCityIds) {
      const place = PLACES.find((item) => item.id === id)
      expect(place, id).toBeDefined()
      expect(place?.latitude).toBeGreaterThanOrEqual(-90)
      expect(place?.latitude).toBeLessThanOrEqual(90)
      expect(place?.longitude).toBeGreaterThanOrEqual(-180)
      expect(place?.longitude).toBeLessThanOrEqual(180)
      expect(place?.timezone).toBe('Asia/Shanghai')
    }
  })

  it('keeps place identifiers unique', () => {
    expect(new Set(PLACES.map((place) => place.id)).size).toBe(PLACES.length)
  })
})
