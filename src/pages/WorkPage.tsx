import { Link } from 'react-router-dom'
import { asset } from '../lib/asset'
import { useTitle } from '../lib/useTitle'

/* To add tattoos: drop a photo in public/assets/img, then add a { src, alt, cap }
   entry to the `pieces` array below. Portrait-orientation photos look best in
   this masonry grid. Set `emptySlots` above 0 to show "your piece here" tiles. */
const pieces = [
  { src: 'assets/img/piece-crane.jpg', alt: 'Fine-line crane in flight with red flowers and flowing linework on a forearm', cap: 'Fine-line · crane' },
  { src: 'assets/img/piece-selflove.jpg', alt: 'Delicate "self love" typewriter script on a forearm', cap: 'Script · self love' },
  { src: 'assets/img/piece-snake.jpg', alt: 'American traditional striking snake in green, red and yellow', cap: 'Traditional · snake' },
  { src: 'assets/img/piece-sparkle.jpg', alt: 'Fine-line sparkle stars tattooed behind the ear', cap: 'Fine-line · behind the ear' },
  { src: 'assets/img/piece-abstract.jpg', alt: 'Abstract black-and-red figure over a red sun', cap: 'Blackwork · abstract' },
  { src: 'assets/img/piece-cowboy.jpg', alt: 'Fine-line skull wearing a cowboy hat', cap: 'Fine-line · cowboy' },
  { src: 'assets/img/piece-flash.jpg', alt: 'Fine-line symbol flash — 11:11, a sun and an all-seeing eye', cap: 'Fine-line · symbols' },
  { src: 'assets/img/piece-flower.jpg', alt: 'Traditional red flower on the wrist', cap: 'Traditional · rose' },
  { src: 'assets/img/piece-hardway.jpg', alt: '"The hard way" lettering with a fine-line safety pin', cap: 'Lettering · the hard way' },
  { src: 'assets/img/piece-ace.jpg', alt: 'Crown over an ace of spades in bold blackwork', cap: 'Blackwork · ace' },
  { src: 'assets/img/piece-chess.jpg', alt: 'Black-and-grey chess pieces — a pawn beside a fallen king', cap: 'Black & grey · chess' },
  { src: 'assets/img/gallery-fineline.jpg', alt: 'Fine-line triangle and rose tattoos on a forearm in dramatic light', cap: 'Fine-line · forearm' },
]
const emptySlots = 0

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
