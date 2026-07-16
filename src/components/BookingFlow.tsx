import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

/* ---------------------------------------------------------------------------
   Calendly
   Replace the handle below with the studio's real Calendly scheduling link,
   e.g. 'https://calendly.com/inkbyos/consultation'. Until then the final step
   shows a graceful fallback (email / DM / phone) instead of a broken embed.

   The visitor's brief (styles, placement, size, idea) is passed to Calendly as
   a prefill of the FIRST custom question on the event (customAnswers.a1) — keep
   a "share anything that helps me prepare" question first on the Calendly event
   and it lands there automatically. Name + email always prefill.
--------------------------------------------------------------------------- */
const CALENDLY_URL = 'https://calendly.com/inkbyos/30min'
const calendlyReady = !CALENDLY_URL.includes('YOUR_CALENDLY_HANDLE')

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (opts: {
        url: string
        parentElement: HTMLElement
        prefill?: { name?: string; email?: string; customAnswers?: Record<string, string> }
      }) => void
    }
  }
}

const STYLES = ['Fine-line', 'Blackwork', 'Traditional', 'Script / lettering', 'Illustrative', 'Abstract', 'Not sure yet']
const PLACEMENTS = [
  'Forearm', 'Upper arm', 'Shoulder', 'Back', 'Chest', 'Ribs', 'Thigh', 'Calf', 'Ankle', 'Hand / finger', 'Behind ear', 'Other',
]
const SIZES = [
  { key: 'Tiny', hint: 'under 2 in' },
  { key: 'Small', hint: '2–4 in' },
  { key: 'Medium', hint: '4–6 in' },
  { key: 'Large', hint: '6 in +' },
]

const emailValid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

export function BookingFlow() {
  const [step, setStep] = useState(0)

  // brief
  const [styles, setStyles] = useState<string[]>([])
  const [placement, setPlacement] = useState('')
  const [size, setSize] = useState('')
  const [design, setDesign] = useState('')
  const [firstTattoo, setFirstTattoo] = useState<'Yes' | 'No' | ''>('')

  // contact
  const [first, setFirst] = useState('')
  const [last, setLast] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const toggleStyle = (s: string) =>
    setStyles((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]))

  const step0Valid = styles.length > 0 && design.trim().length >= 4
  const step1Valid = first.trim() !== '' && last.trim() !== '' && emailValid(email)

  const brief = useMemo(() => {
    const lines = [
      styles.length ? `Styles: ${styles.join(', ')}` : '',
      placement ? `Placement: ${placement}` : '',
      size ? `Size: ${size} (${SIZES.find((s) => s.key === size)?.hint ?? ''})` : '',
      firstTattoo ? `First tattoo: ${firstTattoo}` : '',
      design.trim() ? `Idea: ${design.trim()}` : '',
    ].filter(Boolean)
    return lines.join('\n')
  }, [styles, placement, size, firstTattoo, design])

  const reduce =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // ---- Calendly embed (final step) ----
  const widgetRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (step !== 2 || !calendlyReady) return

    const themed =
      CALENDLY_URL +
      (CALENDLY_URL.includes('?') ? '&' : '?') +
      'hide_gdpr_banner=1&background_color=131110&text_color=ede7dd&primary_color=c7a98b'

    const init = () => {
      if (!widgetRef.current || !window.Calendly) return
      widgetRef.current.innerHTML = ''
      window.Calendly.initInlineWidget({
        url: themed,
        parentElement: widgetRef.current,
        prefill: {
          name: `${first} ${last}`.trim(),
          email: email.trim(),
          customAnswers: { a1: brief },
        },
      })
    }

    if (window.Calendly) {
      init()
      return
    }

    const scriptId = 'calendly-widget-script'
    if (!document.getElementById('calendly-widget-css')) {
      const link = document.createElement('link')
      link.id = 'calendly-widget-css'
      link.rel = 'stylesheet'
      link.href = 'https://assets.calendly.com/assets/external/widget.css'
      document.head.appendChild(link)
    }
    let poll: number | undefined
    if (!document.getElementById(scriptId)) {
      const s = document.createElement('script')
      s.id = scriptId
      s.src = 'https://assets.calendly.com/assets/external/widget.js'
      s.async = true
      s.onload = init
      document.body.appendChild(s)
    } else {
      poll = window.setInterval(() => {
        if (window.Calendly) {
          window.clearInterval(poll)
          init()
        }
      }, 120)
    }
    return () => {
      if (poll) window.clearInterval(poll)
    }
  }, [step, first, last, email, brief])

  const emailBrief = () => {
    const subject = `Tattoo booking enquiry — ${first} ${last}`.trim()
    const body = encodeURIComponent(
      `${brief}\n\nName: ${first} ${last}\nEmail: ${email}${phone ? `\nPhone: ${phone}` : ''}`,
    )
    window.location.href = `mailto:inkbyos@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`
  }

  return (
    <div className="flow">
      {/* progress thread */}
      <ol className="flow-steps" aria-hidden="true">
        {['The idea', 'You', 'Pick a time'].map((label, i) => (
          <li key={label} className={`flow-step${i === step ? ' active' : ''}${i < step ? ' done' : ''}`} style={{ flex: i < 2 ? '1 1 auto' : '0 0 auto' }}>
            <span className="n">{i < step ? '✓' : String(i + 1).padStart(2, '0')}</span>
            <span className="lbl">{label}</span>
            {i < 2 && <span className={`flow-line${i < step ? ' filled' : ''}`} />}
          </li>
        ))}
      </ol>
      <p className="sr-only" role="status">
        Step {step + 1} of 3
      </p>

      <div className="flow-panel" key={reduce ? undefined : step} data-anim={!reduce}>
        {/* ---------- Step 0 — the idea ---------- */}
        {step === 0 && (
          <Step>
            <p className="fieldset-label" style={{ marginTop: 0 }}>
              Style <span className="req">*</span>
              <span className="hint"> — pick any that fit</span>
            </p>
            <div className="chips">
              {STYLES.map((s) => (
                <button
                  type="button"
                  key={s}
                  className={`chip${styles.includes(s) ? ' selected' : ''}`}
                  aria-pressed={styles.includes(s)}
                  onClick={() => toggleStyle(s)}
                >
                  {s}
                </button>
              ))}
            </div>

            <p className="fieldset-label">Placement</p>
            <div className="chips">
              {PLACEMENTS.map((p) => (
                <button
                  type="button"
                  key={p}
                  className={`chip${placement === p ? ' selected' : ''}`}
                  aria-pressed={placement === p}
                  onClick={() => setPlacement((cur) => (cur === p ? '' : p))}
                >
                  {p}
                </button>
              ))}
            </div>

            <p className="fieldset-label">Approximate size</p>
            <div className="segmented" role="group" aria-label="Approximate size">
              {SIZES.map((s) => (
                <button
                  type="button"
                  key={s.key}
                  className={size === s.key ? 'on' : ''}
                  aria-pressed={size === s.key}
                  onClick={() => setSize((cur) => (cur === s.key ? '' : s.key))}
                >
                  <span className="seg-k">{s.key}</span>
                  <span className="seg-h">{s.hint}</span>
                </button>
              ))}
            </div>

            <div className="field" style={{ marginTop: '1.8rem' }}>
              <label htmlFor="design">
                Describe your idea <span className="req">*</span>
              </label>
              <textarea
                id="design"
                rows={4}
                value={design}
                onChange={(e) => setDesign(e.target.value)}
                placeholder="Subject, references, meaning — anything that helps me picture it."
              />
            </div>

            <div className="flow-actions">
              <button
                type="button"
                className="btn primary"
                disabled={!step0Valid}
                onClick={() => setStep(1)}
              >
                Continue <span className="arrow">→</span>
              </button>
              {!step0Valid && <span className="flow-hint">Pick a style and describe your idea to continue.</span>}
            </div>
          </Step>
        )}

        {/* ---------- Step 1 — you ---------- */}
        {step === 1 && (
          <Step>
            <div className="field-row">
              <div className="field">
                <label htmlFor="first_name">
                  First name <span className="req">*</span>
                </label>
                <input id="first_name" autoComplete="given-name" value={first} onChange={(e) => setFirst(e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="last_name">
                  Last name <span className="req">*</span>
                </label>
                <input id="last_name" autoComplete="family-name" value={last} onChange={(e) => setLast(e.target.value)} />
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="email">
                  Email <span className="req">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={email !== '' && !emailValid(email)}
                />
              </div>
              <div className="field">
                <label htmlFor="phone">Phone</label>
                <input id="phone" type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>

            <p className="fieldset-label">Is this your first tattoo?</p>
            <div className="chips" role="group" aria-label="First tattoo?">
              {(['Yes', 'No'] as const).map((v) => (
                <button
                  type="button"
                  key={v}
                  className={`chip${firstTattoo === v ? ' selected' : ''}`}
                  aria-pressed={firstTattoo === v}
                  onClick={() => setFirstTattoo((cur) => (cur === v ? '' : v))}
                >
                  {v}
                </button>
              ))}
            </div>

            <div className="flow-actions">
              <button type="button" className="btn" onClick={() => setStep(0)}>
                <span className="arrow-back">←</span> Back
              </button>
              <button type="button" className="btn primary" disabled={!step1Valid} onClick={() => setStep(2)}>
                Pick a time <span className="arrow">→</span>
              </button>
              {!step1Valid && <span className="flow-hint">Add your name and a valid email to continue.</span>}
            </div>
          </Step>
        )}

        {/* ---------- Step 2 — pick a time ---------- */}
        {step === 2 && (
          <Step>
            <div className="brief-card">
              <p className="fieldset-label" style={{ marginTop: 0 }}>Your brief</p>
              <dl className="brief-list">
                {styles.length > 0 && (
                  <div>
                    <dt>Style</dt>
                    <dd>{styles.join(', ')}</dd>
                  </div>
                )}
                {placement && (
                  <div>
                    <dt>Placement</dt>
                    <dd>{placement}</dd>
                  </div>
                )}
                {size && (
                  <div>
                    <dt>Size</dt>
                    <dd>{size}</dd>
                  </div>
                )}
                <div>
                  <dt>Idea</dt>
                  <dd>{design.trim()}</dd>
                </div>
              </dl>
              <button type="button" className="link-arrow edit-brief" onClick={() => setStep(0)}>
                Edit brief
              </button>
            </div>

            {calendlyReady ? (
              <>
                <p className="fieldset-label">Choose a slot</p>
                <div className="calendly-shell" ref={widgetRef} style={{ minWidth: '280px', height: '660px' }} />
              </>
            ) : (
              <div className="schedule-fallback">
                <p className="fieldset-label" style={{ marginTop: 0 }}>Almost there</p>
                <p>
                  Online scheduling is being set up. For now, send your brief across and I'll reply with times that
                  work — usually within a day.
                </p>
                <div className="flow-actions" style={{ marginTop: '1.6rem' }}>
                  <button type="button" className="btn" onClick={() => setStep(1)}>
                    <span className="arrow-back">←</span> Back
                  </button>
                  <button type="button" className="btn primary" onClick={emailBrief}>
                    Send my brief <span className="arrow">→</span>
                  </button>
                </div>
                <p className="aside-note" style={{ marginTop: '1.6rem' }}>
                  Or reach me directly: <a href="mailto:inkbyos@gmail.com">inkbyos@gmail.com</a> ·{' '}
                  <a href="https://www.instagram.com/inkbyos" target="_blank" rel="noopener noreferrer">
                    @inkbyos
                  </a>{' '}
                  · <a href="tel:+15195012910">519-501-2910</a>
                </p>
              </div>
            )}

            {calendlyReady && (
              <div className="flow-actions" style={{ marginTop: '1.4rem' }}>
                <button type="button" className="btn" onClick={() => setStep(1)}>
                  <span className="arrow-back">←</span> Back
                </button>
              </div>
            )}
          </Step>
        )}
      </div>
    </div>
  )
}

function Step({ children }: { children: ReactNode }) {
  return <div className="flow-step-body">{children}</div>
}
