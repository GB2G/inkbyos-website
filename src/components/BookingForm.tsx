import { useRef, useState, type FormEvent } from 'react'

// To collect submissions in a dashboard, create a free endpoint (e.g.
// Formspree) and replace YOUR_FORM_ID. Until then the form opens the
// visitor's email app with all details pre-filled to inkbyos@gmail.com.
const FORM_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID'

export function BookingForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = (ev: FormEvent<HTMLFormElement>) => {
    const form = ev.currentTarget
    const usesPlaceholder = FORM_ENDPOINT.includes('YOUR_FORM_ID')
    if (!usesPlaceholder) return // let the real endpoint handle the POST

    ev.preventDefault()
    const data = new FormData(form)
    const lines: string[] = []
    data.forEach((value, key) => {
      const v = String(value).trim()
      if (v !== '') lines.push(`${key}: ${v}`)
    })
    const subject = `Tattoo booking enquiry — ${data.get('first_name') ?? ''} ${data.get('last_name') ?? ''}`
    const body = encodeURIComponent(lines.join('\n'))
    setMessage('Opening your email app…')
    window.location.href = `mailto:inkbyos@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`
  }

  return (
    <form className="book" action={FORM_ENDPOINT} method="POST" ref={formRef} onSubmit={handleSubmit}>
      <div className="field-row">
        <div className="field">
          <label htmlFor="first_name">
            First name <span className="req">*</span>
          </label>
          <input id="first_name" name="first_name" type="text" autoComplete="given-name" required />
        </div>
        <div className="field">
          <label htmlFor="last_name">
            Last name <span className="req">*</span>
          </label>
          <input id="last_name" name="last_name" type="text" autoComplete="family-name" required />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="email">
            Email <span className="req">*</span>
          </label>
          <input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="field">
          <label htmlFor="phone">Phone</label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" />
        </div>
      </div>

      <p className="fieldset-label">Your availability</p>
      <div className="field-row">
        <div className="field">
          <label htmlFor="avail_1">Preferred date / time</label>
          <input id="avail_1" name="availability_1" type="text" placeholder="e.g. Sat 12 Jul, afternoon" />
        </div>
        <div className="field">
          <label htmlFor="avail_2">Alternative date / time</label>
          <input id="avail_2" name="availability_2" type="text" placeholder="e.g. any weekday evening" />
        </div>
      </div>

      <p className="fieldset-label">The design</p>
      <div className="field">
        <label htmlFor="design">
          Describe your design idea <span className="req">*</span>
        </label>
        <textarea
          id="design"
          name="design"
          rows={4}
          placeholder="Style, subject, references, meaning — anything that helps me picture it."
          required
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="placement">Placement</label>
          <input id="placement" name="placement" type="text" placeholder="e.g. inner forearm" />
        </div>
        <div className="field">
          <label htmlFor="size">Approximate size</label>
          <input id="size" name="size" type="text" placeholder="e.g. 3 in / palm-sized" />
        </div>
      </div>

      <div className="field">
        <label htmlFor="comments">Anything else</label>
        <textarea
          id="comments"
          name="comments"
          rows={3}
          placeholder="Questions, first tattoo, allergies, budget range…"
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn primary">
          Send enquiry <span className="arrow">→</span>
        </button>
        <p className="form-msg" role="status" hidden={message === null}>
          {message}
        </p>
      </div>
    </form>
  )
}
