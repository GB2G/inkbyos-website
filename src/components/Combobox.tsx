import { useEffect, useRef, useState, type KeyboardEvent } from 'react'

/* Dropdown that also accepts a typed custom answer — for visitors who don't
   see their option in the list ("not sure", an odd placement, etc.).

   Values are always an array: single-select just keeps 0 or 1 entry. In
   multiple mode picks stack up as removable chips under the input. */
type Props = {
  id: string
  label: string
  options: readonly string[]
  values: string[]
  onChange: (values: string[]) => void
  multiple?: boolean
  required?: boolean
  placeholder?: string
  hint?: string
}

type Row = { type: 'add' | 'opt'; label: string }

export function Combobox({
  id, label, options, values, onChange, multiple = false, required = false, placeholder, hint,
}: Props) {
  const [query, setQuery] = useState(multiple ? '' : values[0] ?? '')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const wrapRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listId = `${id}-listbox`

  // Close when clicking away. No dep array: keeps the handler's closure fresh.
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) {
        setOpen(false)
        setActive(-1)
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  })

  // After a single-select pick the query holds the chosen value; don't filter
  // the list down to just that one — reopening should show everything again.
  const showingPick = !multiple && values[0] !== undefined && query === values[0]
  const needle = showingPick ? '' : query.trim().toLowerCase()

  const filtered = options.filter(
    (o) => o.toLowerCase().includes(needle) && !(multiple && values.includes(o)),
  )

  const typed = query.trim()
  const isNovel =
    typed !== '' &&
    !options.some((o) => o.toLowerCase() === typed.toLowerCase()) &&
    !values.some((v) => v.toLowerCase() === typed.toLowerCase())

  // Only multi-select needs an explicit "add" row — in single mode typing
  // already commits the custom answer on every keystroke.
  const rows: Row[] = [
    ...(multiple && isNovel ? [{ type: 'add' as const, label: typed }] : []),
    ...filtered.map((o) => ({ type: 'opt' as const, label: o })),
  ]

  const pick = (row: Row) => {
    if (multiple) {
      if (!values.some((v) => v.toLowerCase() === row.label.toLowerCase())) {
        onChange([...values, row.label])
      }
      setQuery('')
      setActive(-1)
      inputRef.current?.focus()
    } else {
      onChange([row.label])
      setQuery(row.label)
      setOpen(false)
      setActive(-1)
    }
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setActive((i) => Math.min(i + 1, rows.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      if (active >= 0 && rows[active]) {
        e.preventDefault()
        pick(rows[active])
      } else if (multiple && isNovel) {
        e.preventDefault()
        pick({ type: 'add', label: typed })
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
      setActive(-1)
    } else if (e.key === 'Backspace' && multiple && query === '' && values.length > 0) {
      onChange(values.slice(0, -1))
    }
  }

  return (
    <div className="field cbx" ref={wrapRef}>
      <label htmlFor={id}>
        {label} {required && <span className="req">*</span>}
        {hint && <span className="hint"> — {hint}</span>}
      </label>

      <div className="cbx-input">
        <input
          id={id}
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${id}-opt-${active}` : undefined}
          autoComplete="off"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            const v = e.target.value
            setQuery(v)
            setOpen(true)
            setActive(-1)
            if (!multiple) onChange(v.trim() ? [v.trim()] : [])
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
        />
        <button
          type="button"
          className="cbx-caret"
          tabIndex={-1}
          aria-label={open ? 'Hide options' : 'Show options'}
          onClick={() => {
            setOpen((o) => !o)
            inputRef.current?.focus()
          }}
        >
          ▾
        </button>

        {open && rows.length > 0 && (
          <ul className="cbx-list" id={listId} role="listbox">
            {rows.map((r, i) => (
              <li
                key={`${r.type}-${r.label}`}
                id={`${id}-opt-${i}`}
                role="option"
                aria-selected={i === active}
                className={`cbx-opt${i === active ? ' active' : ''}${r.type === 'add' ? ' add' : ''}`}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => {
                  e.preventDefault() // keep focus off the blur path so the pick lands
                  pick(r)
                }}
              >
                {r.type === 'add' ? `Use “${r.label}”` : r.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      {multiple && values.length > 0 && (
        <div className="chips cbx-chips">
          {values.map((v) => (
            <button
              type="button"
              key={v}
              className="chip selected"
              aria-label={`Remove ${v}`}
              onClick={() => onChange(values.filter((x) => x !== v))}
            >
              {v} <span className="chip-x" aria-hidden="true">×</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
