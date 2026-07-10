import { useEffect, useRef } from 'react'

/** The continuous "thread": one bronze line that draws down the landing page
 *  as you scroll, weaving through each section, with a glowing needle tip.
 *  Also drives the subtle hero parallax. Renders the SVG and wires the
 *  scroll/resize logic in an effect. Landing page only. */
export function Thread() {
  const svgRef = useRef<SVGSVGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const tipRef = useRef<SVGCircleElement>(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const svg = svgRef.current
    const path = pathRef.current
    const tip = tipRef.current
    if (!svg || !path) return

    let threadLen = 0
    const heroImg = document.querySelector<HTMLImageElement>('.hero-media img')
    const heroInner = document.querySelector<HTMLElement>('.hero-inner')

    function build() {
      if (!svg || !path) return
      // Collapse our own height first so the absolutely-positioned SVG can't
      // inflate document scrollHeight (which would feed back on rebuild).
      svg.style.height = '0px'
      const W = document.documentElement.clientWidth
      const H = document.documentElement.scrollHeight
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`)
      svg.setAttribute('preserveAspectRatio', 'none')
      svg.style.height = `${H}px`

      const pts: Array<{ x: number; y: number }> = []
      const hero = document.querySelector<HTMLElement>('.hero')
      const heroBottom = hero ? hero.offsetTop + hero.offsetHeight : 0
      pts.push({ x: W * 0.5, y: heroBottom - 30 })

      const plan = [
        { sel: '#ethos', x: 0.16 },
        { sel: '#about', x: 0.84 },
        { sel: '#work', x: 0.22 },
        { sel: '.cta-band', x: 0.72 },
      ]
      plan.forEach((p) => {
        const el = document.querySelector<HTMLElement>(p.sel)
        if (!el) return
        const top = el.getBoundingClientRect().top + window.scrollY
        pts.push({ x: W * p.x, y: top + el.offsetHeight * 0.5 })
      })
      const footer = document.querySelector<HTMLElement>('.site-footer')
      if (footer) {
        const ft = footer.getBoundingClientRect().top + window.scrollY
        pts.push({ x: W * 0.5, y: ft + 60 })
      }

      let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i]
        const p1 = pts[i + 1]
        const dy = (p1.y - p0.y) * 0.5
        d +=
          ` C ${p0.x.toFixed(1)} ${(p0.y + dy).toFixed(1)},` +
          ` ${p1.x.toFixed(1)} ${(p1.y - dy).toFixed(1)},` +
          ` ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`
      }
      path.setAttribute('d', d)
      threadLen = path.getTotalLength()
      path.style.strokeDasharray = String(threadLen)
      if (reduce) path.style.strokeDashoffset = '0'
      update()
    }

    function update() {
      if (!path || !threadLen || reduce) return
      const H = document.documentElement.scrollHeight
      const vh = window.innerHeight
      const drawnY = window.scrollY + vh * 0.62
      const frac = Math.max(0, Math.min(1, drawnY / H))
      const drawn = threadLen * frac
      path.style.strokeDashoffset = (threadLen - drawn).toFixed(1)
      if (tip) {
        if (drawn > 4 && frac < 0.995) {
          const pt = path.getPointAtLength(drawn)
          tip.setAttribute('cx', pt.x.toFixed(1))
          tip.setAttribute('cy', pt.y.toFixed(1))
          tip.style.opacity = '1'
        } else {
          tip.style.opacity = '0'
        }
      }
    }

    function parallax() {
      if (reduce || !heroImg) return
      const y = window.scrollY
      const vh = window.innerHeight
      if (y < vh * 1.1) {
        heroImg.style.transform = `translate3d(0,${(y * 0.16).toFixed(1)}px,0) scale(1.04)`
        if (heroInner) {
          heroInner.style.transform = `translate3d(0,${(y * 0.05).toFixed(1)}px,0)`
          heroInner.style.opacity = String(Math.max(0, 1 - y / (vh * 0.75)))
        }
      }
    }

    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(() => {
        update()
        parallax()
        ticking = false
      })
    }
    let resizeTimer: number | undefined
    const onResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(build, 150)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    window.addEventListener('load', build)
    build()
    parallax()
    // Rebuild once layout settles (fonts/images can shift section heights)
    const settle = window.setTimeout(build, 400)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('load', build)
      window.clearTimeout(settle)
      window.clearTimeout(resizeTimer)
    }
  }, [])

  return (
    <svg className="thread" aria-hidden="true" ref={svgRef}>
      <path className="thread-path" ref={pathRef} />
      <circle className="thread-tip" r="3.5" cx="-20" cy="-20" ref={tipRef} />
    </svg>
  )
}
