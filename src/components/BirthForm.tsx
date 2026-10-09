import type { FormEvent } from 'react'
import { ArcaneSelect } from './ArcaneSelect'
import { PLACES } from '../data/places'
import { MBTI_TYPES, type BirthInput, type Focus } from '../types'

const emptyCustomPlace = {
  id: 'custom' as const,
  name: '',
  country: '自定义地点',
  latitude: 31.2304,
  longitude: 121.4737,
  timezone: 'Asia/Shanghai',
}

const focusLabels: Record<Focus, string> = {
  career: '事业', finance: '财富', relationships: '关系', growth: '成长', balance: '平衡',
}

function placeMeta(place: (typeof PLACES)[number]) {
  return place.timezone === 'Asia/Shanghai'
    ? `${place.country} · 中国标准时间 UTC+8`
    : `${place.country} · ${place.timezone}`
}

interface BirthFormProps {
  input: BirthInput
  setInput: (input: BirthInput) => void
  submit: (event: FormEvent) => void
  error: string
}

export function BirthForm({ input, setInput, submit, error }: BirthFormProps) {
  const customPlace = input.customPlace ?? emptyCustomPlace
  const selectedFocus = input.focus ?? 'growth'
  return (
          <form id="birth-form" className="birth-form glass" autoComplete="off" onSubmit={submit}>
            <div className="form-heading"><span aria-hidden="true" className="form-seal">✧</span><div><p className="eyebrow">YOUR OBSERVATION BEGINS</p><h2>校准你的出生坐标</h2><p>写下出生时刻，开启一场自我探索。</p></div></div>

            <div className="two">
              <label><span>出生日期 *</span><input type="date" required value={input.date} onChange={(e) => setInput({ ...input, date: e.target.value })} /></label>
              <label><span>出生时间 *</span><input type="time" required aria-describedby="birth-time-hint" value={input.time} onChange={(e) => setInput({ ...input, time: e.target.value })} /><small id="birth-time-hint" className="field-hint">请填写出生地当时的当地钟表时间</small></label>
            </div>
            <div className="place-mode" role="group" aria-label="城市输入方式">
              <button type="button" aria-pressed={input.placeId !== 'custom'} className={input.placeId !== 'custom' ? 'active' : ''} onClick={() => setInput({ ...input, placeId: 'guangzhou' })}>搜索城市</button>
              <button type="button" aria-pressed={input.placeId === 'custom'} className={input.placeId === 'custom' ? 'active' : ''} onClick={() => setInput({ ...input, placeId: 'custom', customPlace })}>自定义城市</button>
            </div>
            {input.placeId !== 'custom' ? (
              <label><span>出生城市 * <small>{PLACES.length} 个离线地点</small></span>
                <ArcaneSelect
                  ariaLabel="选择出生城市"
                  value={input.placeId}
                  searchable
                  searchPlaceholder="搜索中文、拼音或省份"
                  options={PLACES.map((place) => ({ value: place.id, label: place.name, meta: placeMeta(place) }))}
                  onChange={(placeId) => setInput({ ...input, placeId })}
                  onCreateFromQuery={(name) => setInput({
                    ...input,
                    placeId: 'custom',
                    customPlace: { ...customPlace, name },
                  })}
                />
                <small className="field-hint">城市用于时区与经纬度换算；无匹配时可按当前输入创建</small>
              </label>
            ) : (
              <fieldset className="custom-place">
                <legend>自定义坐标 <small>经校验后进入相同确定性计算</small></legend>
                <label><span>城市名称 *</span><input required aria-label="自定义城市名称" value={customPlace.name} onChange={(event) => setInput({ ...input, customPlace: { ...customPlace, name: event.target.value } })} placeholder="例如：阿勒泰" /></label>
                <label><span>IANA 时区 *</span><input required aria-label="IANA 时区" aria-describedby="timezone-hint" value={customPlace.timezone} onChange={(event) => setInput({ ...input, customPlace: { ...customPlace, timezone: event.target.value } })} placeholder="例如：Asia/Shanghai" /><small id="timezone-hint" className="field-hint">中国大陆统一使用 Asia/Shanghai</small></label>
                <div className="two">
                  <label><span>纬度 *</span><input required type="number" min="-90" max="90" step="any" aria-label="纬度" value={customPlace.latitude} onChange={(event) => setInput({ ...input, customPlace: { ...customPlace, latitude: event.target.valueAsNumber } })} /></label>
                  <label><span>经度 *</span><input required type="number" min="-180" max="180" step="any" aria-label="经度" value={customPlace.longitude} onChange={(event) => setInput({ ...input, customPlace: { ...customPlace, longitude: event.target.valueAsNumber } })} /></label>
                </div>
                <p className="field-hint">请输入十进制度数：北纬、东经为正；南纬、西经为负</p>
              </fieldset>
            )}
            <div className="two">
              <label><span>人格坐标 · MBTI</span>
                <ArcaneSelect
                  ariaLabel="选择 MBTI"
                  value={input.mbti}
                  options={MBTI_TYPES.map((type) => ({ value: type, label: type }))}
                  onChange={(mbti) => setInput({ ...input, mbti: mbti as BirthInput['mbti'] })}
                />
              </label>
              <label><span>本次观测主题</span>
                <ArcaneSelect
                  ariaLabel="选择观测主题"
                  value={selectedFocus}
                  options={Object.entries(focusLabels).map(([value, label]) => ({ value, label }))}
                  onChange={(focus) => setInput({ ...input, focus: focus as Focus })}
                />
              </label>
            </div>
            <details className="advanced-settings">
              <summary><span>更多观测设置</span><small>昵称 · 起始月 · 真太阳时</small><i aria-hidden="true">＋</i></summary>
              <div className="advanced-fields">
            <label><span>昵称 <small>可选</small></span><input value={input.name ?? ''} onChange={(e) => setInput({ ...input, name: e.target.value })} placeholder="如何称呼你" /></label>
            <label><span>时间轴起始月 <small>可选 · 默认本月</small></span><input type="month" value={input.startMonth ?? ''} onChange={(e) => setInput({ ...input, startMonth: e.target.value || undefined })} /></label>
            <label className="check"><input type="checkbox" checked={!!input.trueSolarTime} onChange={(e) => setInput({ ...input, trueSolarTime: e.target.checked })} /><span>使用真太阳时近似修正<small>按经度差与均时差修正八字计算时间</small></span></label>
              </div>
            </details>
            {error && <p className="error" role="alert">{error}</p>}
            <button className="primary" type="submit"><span>开启观测 · 生成我的命运图谱</span><b>↗</b></button>
            <p className="form-privacy"><span aria-hidden="true">◈</span> 本地计算 · 无需注册 · 数据不上传</p>
            <p className="fine">文化娱乐与自我探索用途，不构成医疗、法律、投资或人生决策建议。</p>
          </form>
  )
}
