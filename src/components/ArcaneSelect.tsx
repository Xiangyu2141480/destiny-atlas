import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react'

export interface ArcaneSelectOption {
  value: string
  label: string
  meta?: string
}

interface ArcaneSelectProps {
  value: string
  options: ArcaneSelectOption[]
  onChange: (value: string) => void
  ariaLabel: string
  searchable?: boolean
  searchPlaceholder?: string
  onCreateFromQuery?: (query: string) => void
  createLabel?: (query: string) => string
}

function normalizeSearch(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\s·/’'()-]+/g, '')
    .toLocaleLowerCase()
}

export function ArcaneSelect({
  value,
  options,
  onChange,
  ariaLabel,
  searchable = false,
  searchPlaceholder = '搜索',
  onCreateFromQuery,
  createLabel = (query) => `使用“${query}”创建自定义城市`,
}: ArcaneSelectProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(0, options.findIndex((option) => option.value === value)),
  )
  const rootRef = useRef<HTMLDivElement>(null)
  const listboxId = useId()
  const selected = options.find((option) => option.value === value) ?? options[0]
  const visibleOptions = useMemo(() => {
    const keyword = normalizeSearch(query.trim())
    if (!keyword) return options
    return options.filter((option) =>
      normalizeSearch(`${option.label} ${option.meta ?? ''}`).includes(keyword),
    )
  }, [options, query])
  const trimmedQuery = query.trim()

  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [])

  function choose(index: number) {
    const option = visibleOptions[index]
    if (!option) return
    onChange(option.value)
    setOpen(false)
  }

  function openMenu() {
    const selectedIndex = options.findIndex((option) => option.value === value)
    setQuery('')
    setActiveIndex(Math.max(0, selectedIndex))
    setOpen(true)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!open) {
        openMenu()
        return
      }
      const direction = event.key === 'ArrowDown' ? 1 : -1
      setActiveIndex((index) => (index + direction + visibleOptions.length) % visibleOptions.length)
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (open) choose(activeIndex)
      else openMenu()
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      setOpen(false)
    }
    if (event.key === 'Home' && open) {
      event.preventDefault()
      setActiveIndex(0)
    }
    if (event.key === 'End' && open) {
      event.preventDefault()
      setActiveIndex(visibleOptions.length - 1)
    }
  }

  function handleSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!visibleOptions.length) return
      const direction = event.key === 'ArrowDown' ? 1 : -1
      setActiveIndex((index) => (index + direction + visibleOptions.length) % visibleOptions.length)
    }
    if (event.key === 'Enter' && visibleOptions.length) {
      event.preventDefault()
      choose(activeIndex)
    }
    if (event.key === 'Escape') setOpen(false)
  }

  return (
    <div className={`arcane-select ${open ? 'is-open' : ''}`} ref={rootRef}>
      <button
        type="button"
        className="arcane-select-trigger"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => {
          if (open) setOpen(false)
          else openMenu()
        }}
        onKeyDown={handleKeyDown}
      >
        <span>
          <b>{selected?.label}</b>
          {selected?.meta && <small>{selected.meta}</small>}
        </span>
        <i aria-hidden="true">⌄</i>
      </button>
      {open && (
        <div className="arcane-select-menu" id={listboxId} role="listbox" aria-label={ariaLabel}>
          {searchable && (
            <div className="arcane-search">
              <span aria-hidden="true">⌕</span>
              <input
                autoFocus
                type="search"
                aria-label={`搜索${ariaLabel.replace(/^选择/, '')}`}
                placeholder={searchPlaceholder}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value)
                  setActiveIndex(0)
                }}
                onKeyDown={handleSearchKeyDown}
              />
            </div>
          )}
          {visibleOptions.map((option, index) => (
            <button
              type="button"
              role="option"
              aria-selected={option.value === value}
              className={`${option.value === value ? 'is-selected' : ''} ${index === activeIndex ? 'is-active' : ''}`}
              key={option.value}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => choose(index)}
            >
              <span>{option.label}</span>
              {option.meta && <small>{option.meta}</small>}
              {option.value === value && <i aria-hidden="true">✓</i>}
            </button>
          ))}
          {!visibleOptions.length && (
            <div className="arcane-empty">
              <p>未找到匹配城市</p>
              {onCreateFromQuery && trimmedQuery && (
                <button
                  type="button"
                  className="arcane-create"
                  onClick={() => {
                    onCreateFromQuery(trimmedQuery)
                    setOpen(false)
                  }}
                >
                  <span>{createLabel(trimmedQuery)}</span>
                  <i aria-hidden="true">＋</i>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
