import { BookingForm } from '../components/BookingForm'
import { useTitle } from '../lib/useTitle'

export function BookPage() {
  useTitle('Book — InkbyOs')

  return (
    <main>
      <section className="page-hero wrap">
        <p className="eyebrow reveal in">Booking</p>
        <h1 className="display reveal in" data-delay="1">
          let's talk about
          <br />
          your <span style={{ fontStyle: 'italic', color: 'var(--bronze)' }}>design ideas</span>
        </h1>
      </section>

      <section className="section wrap" style={{ paddingTop: 'clamp(1.5rem,4vh,3rem)' }}>
        <div className="book-grid">
          {/* Aside */}
          <aside className="book-aside reveal">
            <p className="lede">
              Tell me about the piece you have in mind. The more detail — placement, size, references and your
              availability — the faster I can get back to you.
            </p>
            <ul className="meta-list">
              <li>
                <span className="k">Studio</span>
                <span className="v">Waterloo, ON</span>
              </li>
              <li>
                <span className="k">Email</span>
                <span className="v">
                  <a href="mailto:inkbyos@gmail.com">inkbyos@gmail.com</a>
                </span>
              </li>
              <li>
                <span className="k">Phone</span>
                <span className="v">
                  <a href="tel:+15195012910">519-501-2910</a>
                </span>
              </li>
              <li>
                <span className="k">Instagram</span>
                <span className="v">
                  <a href="https://www.instagram.com/inkbyos" target="_blank" rel="noopener noreferrer">
                    @inkbyos
                  </a>
                </span>
              </li>
            </ul>
            <p className="aside-note">
              Prefer to message? DM me on Instagram or send an email — whatever's easiest for you.
            </p>
          </aside>

          {/* Form */}
          <div className="reveal" data-delay="1">
            <BookingForm />
          </div>
        </div>
      </section>
    </main>
  )
}
