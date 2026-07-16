# InkbyOs — website

A modern, minimalist, dark website for **InkbyOs**, a private tattoo studio in
Waterloo, Ontario. Built with **Vite + React + TypeScript**, rebuilt from the
original inkbyos.com content.

Design direction: *"the line"* — a fine-line motif drawn from the studio's
actual work, an ink-on-skin palette (warm near-black, paper white, a single
restrained bronze accent), and an editorial serif + mono type system. The
landing page carries a continuous "thread" that draws down the page on scroll.

## Tech

- **Vite** (build/dev), **React 18**, **TypeScript**
- **react-router-dom** for client-side routing, with a `public/404.html` SPA
  fallback so deep links work on GitHub Pages
- One global stylesheet (`src/styles/global.css`) — plain CSS with design tokens
- Deployed to **GitHub Pages** via GitHub Actions (`.github/workflows/deploy.yml`)

## Local development

```bash
npm install
npm run dev        # http://localhost:5173/inkbyos-website/
```

Other scripts:

```bash
npm run build      # type-check + production build to dist/
npm run preview    # serve the production build locally
```

## Project structure

```
index.html                 Vite entry (+ SPA path-restore script)
public/
  404.html                 GitHub Pages SPA fallback
  assets/                  favicon + images (served as-is)
src/
  main.tsx                 app bootstrap (Router + base path)
  App.tsx                  routes
  styles/global.css        the whole design system
  components/
    Header.tsx             nav + animated hamburger / overlay menu
    Footer.tsx
    Thread.tsx             scroll-drawn thread line + hero parallax
    VideoCarousel.tsx      studio clips carousel (work page)
    BookingFlow.tsx        3-step booking flow + Calendly embed
    RouteEffects.tsx       scroll-to-top + reveal-on-scroll observer
  pages/
    HomePage.tsx  WorkPage.tsx  AftercarePage.tsx  BookPage.tsx
  lib/
    asset.ts               resolves /public paths against the base URL
    useTitle.ts            per-page document title
```

## Pages / routes

| Route | Page | Purpose |
|-------|------|---------|
| `/` | HomePage | hero, welcome/ethos, about, selected-work teaser, contact |
| `/work` | WorkPage | studio video carousel + gallery + live Instagram callout |
| `/aftercare` | AftercarePage | healing guide (cleanse · moisturize · avoid · expect) |
| `/book` | BookPage | 3-step booking flow ending in Calendly |

## Deploy

Every push to `main` triggers the GitHub Actions workflow, which builds the app
and publishes `dist/` to GitHub Pages — live at
<https://gb2g.github.io/inkbyos-website/> a minute or two later. No manual step.

**Custom domain (inkbyos.com):** point the domain at GitHub Pages, then change
`base` in `vite.config.ts` from `'/inkbyos-website/'` to `'/'` and, in
`public/404.html`, set `pathSegmentsToKeep = 0`.

## Add your tattoo photos  (important)

The gallery shows 12 real client photos and no placeholders (`emptySlots = 0`).
To add work:

1. Drop photos into `public/assets/img/` (e.g. `piece-04.jpg`). Portrait-
   orientation images look best; keep them ~1200–2000px on the long edge.
2. In `src/pages/WorkPage.tsx`, add an entry to the `pieces` array
   (`{ src, alt, cap }`) and lower `emptySlots` by one to keep the grid balanced.

Your live portfolio also stays linked front-and-centre via the Instagram callout
(@inkbyos), so new work shows even before it's added here.

## The booking flow

`src/components/BookingFlow.tsx` walks the visitor through three steps:

1. **The idea** — style / placement / size selectors + a description.
2. **You** — name, email, phone, first-tattoo toggle.
3. **Pick a time** — a recap of their brief, then a live **Calendly** embed.

Step 3 loads Calendly's widget script and calls `initInlineWidget` with
`CALENDLY_URL` (currently `https://calendly.com/inkbyos/30min`). The embed is
themed to the site palette and **prefilled** with the visitor's name, email and
brief, so each booking arrives with context attached.

- **Change the event:** edit `CALENDLY_URL` at the top of `BookingFlow.tsx`.
- **Keep the brief visible:** the brief prefills the **first custom question** on
  the Calendly event (`customAnswers.a1`), so keep a question like *"Anything
  that helps me prepare?"* first. Remove it and the brief just won't show —
  name/email still prefill and nothing breaks.
- **No Calendly?** If `CALENDLY_URL` contains `YOUR_CALENDLY_HANDLE`, step 3
  falls back to an email panel instead of rendering a broken embed.

## Studio videos

The work page opens with a muted, looping carousel (`VideoCarousel.tsx`) reading
from `public/assets/video/` (`clip-1..3.mp4` + matching `.jpg` posters). Only the
visible clip plays. Source `.MOV` files are not kept in the repo; re-encode new
clips to match the existing ones:

```bash
ffmpeg -i in.MOV -vf scale=1280:-2 -c:v libx264 -crf 27 -preset slow \
  -an -movflags +faststart out.mp4        # + a poster jpg
```

Keep them small — they ship to GitHub Pages. Then add/edit an entry in the
`clips` array in `VideoCarousel.tsx`.

## Editing content

- **Text**: edit the relevant file in `src/pages/`.
- **Colours / fonts / spacing**: CSS variables at the top of
  `src/styles/global.css` under `:root`.
- **Contact details / social links**: `Footer.tsx` and `BookPage.tsx`. Search for
  `inkbyos@gmail.com`, `519-501-2910`, and the `instagram.com/inkbyos` /
  `tiktok` / `facebook` links.

## Credits / notes

- Fonts: Instrument Serif, Instrument Sans, Spline Sans Mono (Google Fonts).
- All copy and imagery originate from the existing inkbyos.com. Two old-site
  images were repurposed for the aftercare and gallery pages; the original
  hero/portrait photos of the artist are used on the landing and work pages.
