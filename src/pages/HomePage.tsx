import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Thread } from '../components/Thread'
import { asset } from '../lib/asset'
import { useTitle } from '../lib/useTitle'

export function HomePage() {
  useTitle('InkbyOs — Tattoo Studio · Waterloo, ON')

  // Enables the thread's z-index layering (body.has-thread ...)
  useEffect(() => {
    document.body.classList.add('has-thread')
    return () => document.body.classList.remove('has-thread')
  }, [])

  return (
    <>
      <Thread />

      <main>
        {/* ===== Hero ===== */}
        <section className="hero">
          <div className="hero-media">
            <img
              src={asset('assets/img/hero-fineline.jpg')}
              alt="Fine-line wrist tattoos lit by a shaft of light, with the hand casting a soft shadow"
            />
          </div>

          {/* Signature: a single line that draws itself in on load */}
          <svg className="draw-line hero-line" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
            <path d="M-20,80 C 240,20 380,110 620,70 S 1040,10 1240,72 S 1440,60 1470,54" />
          </svg>

          <div className="wrap hero-inner">
            <p className="eyebrow reveal in">Waterloo, ON · Private tattoo studio</p>
            <h1 className="display reveal in" data-delay="1">
              for the love
              <br />
              of <span className="em">art</span>
            </h1>
            <div className="hero-foot">
              <p className="lede reveal in" data-delay="2">
                Custom, minimalist and fine-line work — matched to the small details that make your story your own.
              </p>
              <div className="hero-cta reveal in" data-delay="3">
                <Link className="btn primary" to="/book">
                  Book a session <span className="arrow">→</span>
                </Link>
                <Link className="btn" to="/work">
                  See the work <span className="arrow">→</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="scroll-hint" aria-hidden="true">
            Scroll
          </div>
        </section>

        {/* ===== Ethos / welcome ===== */}
        <section className="section" id="ethos">
          <div className="wrap">
            <div className="split narrow-left">
              <div className="reveal">
                <p className="eyebrow">Welcome</p>
              </div>
              <div className="stack reveal" data-delay="1">
                <p className="lede">
                  Welcome to the world of self-expression through skin art. I'm a self-taught artist with a passion for
                  matching each client's personality with their tattoo.
                </p>
                <p>
                  Whether you arrive with an intricate abstract design or the beginning of a more minimalist idea, I'm
                  dedicated to bringing your vision to life — a piece that represents your personal story and
                  individuality.
                </p>
                <Link className="link-arrow" to="/book">
                  Start your piece <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <hr className="rule" />

        {/* ===== About ===== */}
        <section className="section" id="about">
          <div className="wrap">
            <div className="split narrow-right">
              <div className="stack reveal">
                <p className="eyebrow">About the artist</p>
                <h2 className="display">
                  the details
                  <br />
                  are the story
                </h2>
                <p>
                  I'm inspired by individuality — specifically, the small details that make each person's story their
                  own. Tattooing lets me turn those stories into something lasting, and that's what makes this work so
                  meaningful to me.
                </p>
                <p>
                  I've been tattooing on and off for years. I stepped away to pursue a steady corporate path, and kept
                  feeling pulled back. Motivated by that pull, I've spent hours practicing and growing — and now I'm
                  tattooing again, with a clear focus on thoughtful design, careful execution, and a client experience
                  that's comfortable and aligned with what you need.
                </p>
              </div>
              <div className="figure portrait reveal" data-delay="1">
                <img
                  src={asset('assets/img/artist.jpg')}
                  alt="Os, the artist, focused while tattooing a client under a work lamp"
                />
                <span className="cap">Os · at the studio</span>
              </div>
            </div>
          </div>
        </section>

        <hr className="rule" />

        {/* ===== Selected work teaser ===== */}
        <section className="section" id="work">
          <div className="wrap">
            <div className="section-head reveal">
              <span className="idx">01 / work</span>
            </div>
            <div className="split reveal" data-delay="1">
              <div className="figure tall">
                <img
                  src={asset('assets/img/piece-crane.jpg')}
                  alt="Fine-line crane in flight with red flowers on a forearm"
                />
                <span className="cap">Fine-line · crane</span>
              </div>
              <div className="stack">
                <h2 className="display">
                  every piece,
                  <br />
                  like every person,
                  <br />
                  different
                </h2>
                <p>
                  Just as no two people are the same, no two pieces should be either. Browse a selection of recent work,
                  or see the living gallery over on Instagram.
                </p>
                <Link className="link-arrow" to="/work">
                  View the gallery <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Studio band (atmosphere) ===== */}
        <section className="studio-band reveal" aria-label="The studio">
          <img
            src={asset('assets/img/studio-space.jpg')}
            alt="The InkbyOs studio in Waterloo — tattoo bed beneath framed prints, plants and warm light"
          />
          <span className="studio-cap">The studio · Waterloo, ON</span>
        </section>
      </main>

      {/* ===== CTA band ===== */}
      <section className="section cta-band">
        <div className="wrap reveal">
          <p className="eyebrow" style={{ justifyContent: 'center', display: 'flex' }}>
            Let's begin
          </p>
          <h2 className="display" style={{ marginTop: '1.4rem' }}>
            let's talk about
            <br />
            your <em>design ideas</em>
          </h2>
          <Link className="btn primary" to="/book">
            Book a session <span className="arrow">→</span>
          </Link>
        </div>
      </section>
    </>
  )
}
