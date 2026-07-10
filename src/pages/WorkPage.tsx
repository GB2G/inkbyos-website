import { Link } from 'react-router-dom'
import { asset } from '../lib/asset'
import { useTitle } from '../lib/useTitle'

/* To add tattoos: drop a photo in public/assets/img, then add a <figure> to
   the `pieces` array below and remove one placeholder slot to keep the grid
   balanced. Portrait-orientation photos look best in this masonry grid. */
const pieces = [
  { src: 'assets/img/gallery-fineline.jpg', alt: 'Delicate fine-line triangle and rose tattoos on a forearm in dramatic light', cap: 'Fine-line · forearm' },
  { src: 'assets/img/studio.jpg', alt: "Os shading a colour floral piece on a client's forearm", cap: 'In progress · floral' },
  { src: 'assets/img/artist.jpg', alt: 'Close, careful linework during a session', cap: 'At the needle · detail' },
]
const emptySlots = 3

export function WorkPage() {
  useTitle('Work — InkbyOs')

  return (
    <>
      <main>
        {/* ===== Page hero ===== */}
        <section className="page-hero wrap">
          <p className="eyebrow reveal in">Selected work</p>
          <h1 className="display reveal in" data-delay="1">
            the work
          </h1>
          <p className="lede reveal in" data-delay="2">
            Custom, minimalist and fine-line pieces — abstract ideas, small meaningful marks, and quiet linework. New
            pieces land on Instagram first.
          </p>
          <svg
            className="draw-line"
            style={{ position: 'relative', height: '60px', marginTop: '1.5rem' }}
            viewBox="0 0 1000 60"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M0,40 C 160,10 260,55 440,32 S 760,8 1000,38" />
          </svg>
        </section>

        {/* ===== Gallery ===== */}
        <section className="section wrap" style={{ paddingTop: 'clamp(1.5rem,4vh,3rem)' }}>
          <div className="gallery reveal">
            {pieces.map((p) => (
              <figure className="figure" key={p.src}>
                <img src={asset(p.src)} alt={p.alt} />
                <figcaption className="cap">{p.cap}</figcaption>
              </figure>
            ))}
            {Array.from({ length: emptySlots }).map((_, i) => (
              <div className="slot" aria-hidden="true" key={`slot-${i}`}>
                <span className="plus">+</span>
                <span>your piece here</span>
              </div>
            ))}
          </div>
        </section>

        {/* ===== Instagram living gallery ===== */}
        <section className="section wrap" style={{ paddingTop: 0 }}>
          <div className="ig-callout reveal">
            <div>
              <p className="eyebrow">The living gallery</p>
              <h2 className="display">
                see the latest
                <br />
                on instagram
              </h2>
              <p style={{ maxWidth: '44ch' }}>
                Every new piece, healed shots and flash drops go up on Instagram first. Follow along, then reach out
                about your own idea.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', alignItems: 'flex-start' }}>
              <a className="btn primary" href="https://www.instagram.com/inkbyos" target="_blank" rel="noopener noreferrer">
                @inkbyos <span className="arrow">→</span>
              </a>
              <Link className="link-arrow" to="/book">
                Book a session <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ===== CTA band ===== */}
      <section className="section cta-band">
        <div className="wrap reveal">
          <h2 className="display">
            bring me
            <br />
            your <em>idea</em>
          </h2>
          <Link className="btn primary" to="/book">
            Start your piece <span className="arrow">→</span>
          </Link>
        </div>
      </section>
    </>
  )
}
