import { Link } from 'react-router-dom'
import { asset } from '../lib/asset'
import { useTitle } from '../lib/useTitle'

export function AftercarePage() {
  useTitle('Aftercare — InkbyOs')

  return (
    <>
      <main>
        {/* ===== Page hero ===== */}
        <section className="page-hero wrap">
          <div className="split narrow-right" style={{ alignItems: 'end' }}>
            <div>
              <p className="eyebrow reveal in">Healing guide</p>
              <h1 className="display reveal in" data-delay="1">
                aftercare
              </h1>
              <p className="lede care-intro reveal in" data-delay="2">
                Every artist has their own method. The most important part is being consistent and completing every
                step. Here's the routine that has worked best for me and my clients.
              </p>
            </div>
            <div className="figure portrait reveal" data-delay="1" style={{ maxHeight: '340px' }}>
              <img src={asset('assets/img/aftercare.jpg')} alt="Applying a small amount of unscented ointment to fingertips" />
            </div>
          </div>
        </section>

        <hr className="rule" />

        {/* ===== Protocol ===== */}
        <section className="section wrap">
          <div className="protocol">
            <article className="step reveal">
              <div className="step-num">Step 01</div>
              <div className="step-body">
                <h3 className="display">cleanse</h3>
                <ul>
                  <li>
                    Keep the bandage applied for around <strong>3–5 hours</strong>.
                  </li>
                  <li>Remove the bandage with freshly washed hands, then cleanse the tattoo and the surrounding area.</li>
                  <li>
                    Wash with <strong>unscented soap, warm water and your hands only</strong>.
                  </li>
                  <li>Rinse, then pat dry with a clean paper towel — or air dry.</li>
                  <li>
                    For the first two days, if the area feels sticky after drying, repeat the wash up to three times in
                    one session.
                  </li>
                  <li>
                    Repeat all cleansing steps <strong>twice a day for the first two weeks</strong>.
                  </li>
                </ul>
              </div>
            </article>

            <article className="step reveal">
              <div className="step-num">Step 02</div>
              <div className="step-body">
                <h3 className="display">moisturize</h3>
                <ul>
                  <li>
                    Wait <strong>two days</strong> before applying any moisturizer.
                  </li>
                  <li>
                    Wash your hands thoroughly, then apply a small amount of unscented moisturizer, rubbing gently into
                    the tattoo.
                  </li>
                  <li>Lotion should not be visible on the surface of your skin once you've finished.</li>
                  <li>
                    Cleanse, then moisturize <strong>twice a day for two weeks</strong>.
                  </li>
                </ul>
                <p className="care-note">
                  Always use unscented moisturizers — Aveeno, Aquaphor and Lubriderm all work well.
                </p>
              </div>
            </article>

            <article className="step reveal">
              <div className="step-num">Avoid</div>
              <div className="step-body">
                <h3 className="display">what to avoid</h3>
                <ul>
                  <li>
                    Direct sun for the first month of healing — sunscreen may be applied after <strong>3 weeks</strong>.
                  </li>
                  <li>Soaking the tattoo, and water pressure on it. Showering is fine.</li>
                  <li>Picking or peeling — it will scab, and this can damage the skin and the tattoo.</li>
                  <li>Dusty or dirty environments. If needed, wear loose, long-sleeved clothing and wash it regularly.</li>
                  <li>Direct contact with pets — including kisses and hair.</li>
                  <li>
                    Try to sleep on <strong>freshly washed sheets</strong>.
                  </li>
                </ul>
              </div>
            </article>

            <article className="step reveal">
              <div className="step-num">Expect</div>
              <div className="step-body">
                <h3 className="display">what to expect</h3>
                <ul>
                  <li>
                    The top layer of skin may flake like a sunburn, or form a light scab. This is good and normal — it
                    can continue for <strong>two weeks to a month</strong>.
                  </li>
                  <li>
                    Itchiness is normal while healing. <strong>Do not itch.</strong>
                  </li>
                  <li>
                    After two weeks your tattoo should show signs of healing — that's when you can ease off the cleanse
                    and moisturize routine.
                  </li>
                  <li>Your tattoo may take up to a full month to settle, depending on the size.</li>
                </ul>
                <p className="care-callout" style={{ marginTop: '2rem' }}>
                  consistency is everything — the small daily steps are what keep the art sharp.
                </p>
              </div>
            </article>
          </div>
        </section>
      </main>

      {/* ===== CTA band ===== */}
      <section className="section cta-band">
        <div className="wrap reveal">
          <p className="eyebrow" style={{ justifyContent: 'center', display: 'flex' }}>
            Questions?
          </p>
          <h2 className="display" style={{ marginTop: '1.4rem' }}>
            not sure about
            <br />
            a <em>healing step?</em>
          </h2>
          <p style={{ maxWidth: '38ch', margin: '0 auto 2rem' }}>
            Reach out any time during your heal — I'm happy to help.
          </p>
          <a className="btn primary" href="mailto:inkbyos@gmail.com">
            Email the studio <span className="arrow">→</span>
          </a>
        </div>
      </section>
    </>
  )
}
