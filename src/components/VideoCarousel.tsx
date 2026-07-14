import { useCallback, useEffect, useRef, useState } from 'react'
import { asset } from '../lib/asset'

/* Muted, looping studio clips shown one at a time at the top of the work page.
   To swap a clip: replace the mp4 + jpg poster in public/assets/video and edit
   the matching entry below. Videos are landscape (16:9); portrait won't fit. */
const clips = [
  { src: 'assets/video/clip-1.mp4', poster: 'assets/video/clip-1.jpg', cap: 'In the studio' },
  { src: 'assets/video/clip-2.mp4', poster: 'assets/video/clip-2.jpg', cap: 'The process' },
  { src: 'assets/video/clip-3.mp4', poster: 'assets/video/clip-3.jpg', cap: 'Fine-line, up close' },
  { src: 'assets/video/clip-4.mp4', poster: 'assets/video/clip-4.jpg', cap: 'Linework' },
]

export function VideoCarousel() {
  const [index, setIndex] = useState(0)
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([])
  const touchX = useRef<number | null>(null)
  const count = clips.length

  const go = useCallback((i: number) => setIndex((i + count) % count), [count])

  // Play only the active clip; keep the rest paused to spare bandwidth.
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    videoRefs.current.forEach((v, i) => {
      if (!v) return
      if (i === index && !reduce) {
        v.currentTime = 0
        void v.play().catch(() => {})
      } else {
        v.pause()
      }
    })
  }, [index])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') go(index - 1)
    if (e.key === 'ArrowRight') go(index + 1)
  }

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1))
    touchX.current = null
  }

  return (
    <div
      className="vcar"
      role="group"
      aria-roledescription="carousel"
      aria-label="Studio clips"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="vcar-track" style={{ transform: `translateX(-${index * 100}%)` }}>
        {clips.map((c, i) => (
          <div className="vcar-slide" key={c.src} aria-hidden={i !== index}>
            <video
              ref={(el) => {
                videoRefs.current[i] = el
              }}
              src={asset(c.src)}
              poster={asset(c.poster)}
              muted
              loop
              playsInline
              preload={i === 0 ? 'auto' : 'metadata'}
            />
            <span className="vcar-cap">{c.cap}</span>
          </div>
        ))}
      </div>

      <button className="vcar-nav prev" onClick={() => go(index - 1)} aria-label="Previous clip">
        ←
      </button>
      <button className="vcar-nav next" onClick={() => go(index + 1)} aria-label="Next clip">
        →
      </button>

      <div className="vcar-dots" role="tablist" aria-label="Choose clip">
        {clips.map((c, i) => (
          <button
            key={c.src}
            role="tab"
            aria-current={i === index}
            aria-label={`Clip ${i + 1}`}
            onClick={() => go(i)}
          />
        ))}
      </div>
    </div>
  )
}
