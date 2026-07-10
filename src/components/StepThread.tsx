import { useEffect, useRef } from 'react'

const NS = 'http://www.w3.org/2000/svg'

/** The thread, as a timeline: a vertical bronze line down a left rail that
 *  connects a node to each protocol step and draws on scroll, with a glowing
 *  needle tip. Rendered inside the `.protocol` container on the aftercare page. */
export function StepThread() {
  const svgRef = useRef<SVGSVGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const tipRef = useRef<SVGCircleElement>(null)
  const branchesRef = useRef<SVGGElement>(null)
  const nodesRef = useRef<SVGGElement>(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const svg = svgRef.current
    const path = pathRef.current
    const tip = tipRef.current
    const branches = branchesRef.current
    const nodes = nodesRef.current
    const protocol = svg?.closest<HTMLElement>('.protocol') ?? null
    if (!svg || !path || !branches || !nodes || !protocol) return

    let len = 0

    function build() {
      if (!svg || !path || !branches || !nodes || !protocol) return
      // Collapse our own height first so the absolutely-positioned SVG can't
      // inflate the container's scrollHeight (which would feed back on rebuild).
      svg.style.height = '0px'
      const rect = protocol.getBoundingClientRect()
      const W = protocol.clientWidth
      const H = protocol.scrollHeight
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`)
      svg.setAttribute('preserveAspectRatio', 'none')
      svg.style.height = `${H}px`

      const padL = parseFloat(getComputedStyle(protocol).paddingLeft) || 24
      const railX = Math.max(8, padL - 12)

      const steps = Array.from(protocol.querySelectorAll<HTMLElement>('.step'))
      const nodeYs = steps.map((step) => {
        const num = step.querySelector<HTMLElement>('.step-num') ?? step
        return num.getBoundingClientRect().top - rect.top
      })
      if (nodeYs.length === 0) return

      // Build a mostly-vertical path down the rail, gently waving past each node.
      const first = Math.max(0, nodeYs[0] - 26)
      const last = Math.min(H, nodeYs[nodeYs.length - 1] + 46)
      const waveX = (i: number) => railX + (i % 2 ? 5 : -5)
      const pts = [
        { x: railX, y: first },
        ...nodeYs.map((y, i) => ({ x: waveX(i), y })),
        { x: railX, y: last },
      ]
      let d = `M ${pts[0].x} ${pts[0].y.toFixed(1)}`
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i]
        const p1 = pts[i + 1]
        const dy = (p1.y - p0.y) * 0.5
        d +=
          ` C ${p0.x} ${(p0.y + dy).toFixed(1)},` +
          ` ${p1.x} ${(p1.y - dy).toFixed(1)},` +
          ` ${p1.x} ${p1.y.toFixed(1)}`
      }
      path.setAttribute('d', d)
      len = path.getTotalLength()
      path.style.strokeDasharray = String(len)

      // (Re)draw branches + nodes
      branches.replaceChildren()
      nodes.replaceChildren()
      nodeYs.forEach((y, i) => {
        const x = waveX(i)
        const branch = document.createElementNS(NS, 'line')
        branch.setAttribute('class', 'thread-branch')
        branch.setAttribute('x1', String(x))
        branch.setAttribute('y1', y.toFixed(1))
        branch.setAttribute('x2', String(padL + 4))
        branch.setAttribute('y2', y.toFixed(1))
        branches.appendChild(branch)

        const node = document.createElementNS(NS, 'circle')
        node.setAttribute('class', 'thread-node')
        node.setAttribute('cx', String(x))
        node.setAttribute('cy', y.toFixed(1))
        node.setAttribute('r', '4')
        node.dataset.y = String(y)
        nodes.appendChild(node)
      })

      if (reduce) {
        path.style.strokeDashoffset = '0'
        nodes.querySelectorAll('.thread-node').forEach((n) => n.classList.add('on'))
      }
      update()
    }

    function update() {
      if (!path || !nodes || !protocol || !len || reduce) return
      const rect = protocol.getBoundingClientRect()
      const protocolTopDoc = rect.top + window.scrollY
      const H = protocol.scrollHeight
      const vh = window.innerHeight
      const drawFrontDoc = window.scrollY + vh * 0.7
      const localY = drawFrontDoc - protocolTopDoc
      const frac = Math.max(0, Math.min(1, localY / H))
      const drawn = len * frac
      path.style.strokeDashoffset = (len - drawn).toFixed(1)

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

      nodes.querySelectorAll<SVGCircleElement>('.thread-node').forEach((n) => {
        const ny = parseFloat(n.dataset.y ?? '0')
        n.classList.toggle('on', localY >= ny - 4)
      })
    }

    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(() => {
        update()
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
    <svg className="step-thread" aria-hidden="true" ref={svgRef}>
      <g className="thread-branches" ref={branchesRef} />
      <path className="thread-path" ref={pathRef} />
      <g className="thread-nodes" ref={nodesRef} />
      <circle className="thread-tip" r="3.5" cx="-20" cy="-20" ref={tipRef} />
    </svg>
  )
}
