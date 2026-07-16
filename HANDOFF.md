# InkbyOs — session handoff

Quick context for a new session picking up this project.

## What this is

A dark, minimalist website for **InkbyOs**, a private tattoo studio in
Waterloo, Ontario. Rebuilt from the client's old Wix site (inkbyos.com).

- **Live:** https://gb2g.github.io/inkbyos-website/
- **Repo:** https://github.com/GB2G/inkbyos-website (branch `main`)
- **Stack:** Vite + React 18 + TypeScript, one global CSS file, no UI libraries.
- **Deploy:** every push to `main` runs `.github/workflows/deploy.yml` (build →
  GitHub Pages). Live ~1–2 min later. Nothing manual.

## What's been done (in order)

1. Scraped the old site's text + media; built the first version as a **static
   HTML/CSS/JS** site (landing, work, aftercare, book).
2. Deployed it to **GitHub Pages**.
3. Added a signature **"thread"**: a bronze line that draws down the landing
   page on scroll, plus hero parallax and scroll reveals.
4. Added a **Home** nav link and a mobile **hamburger → full-screen overlay** menu.
5. **Rewrote the whole thing as Vite + React + TypeScript** (this is the current
   codebase). Client-side routing, SPA 404 fallback for GitHub Pages, deploy via
   GitHub Actions.
6. Added a **thread timeline to the aftercare page** connecting each protocol
   step, and made the steps **cascade in one by one** on scroll.
7. Added **12 real client tattoo photos** to the work gallery (replacing
   placeholders) and embellished home (crane leads the teaser; new full-bleed
   **studio band**).
8. Added a **studio video carousel** to the top of the work page (`VideoCarousel`
   + `.vcar*` CSS). The client's 4K `.MOV` clips were transcoded to web MP4;
   the client later cut the stencil clip, so **3 remain**.
9. **Replaced the static booking form with a 3-step reactive flow**
   (`BookingFlow`) ending in a live **Calendly** embed. `BookingForm.tsx` is
   gone, and with it the mailto/Formspree path.

## Design system ("the line")

Signature idea: fine-line tattooing → a single continuous line motif.

- **Palette** (tokens at top of `src/styles/global.css` under `:root`): warm
  near-black `--ink #0C0B0A`, paper white `--paper #EDE7DD`, muted `--dim`,
  single restrained bronze accent `--bronze #C7A98B`. Bronze is used ONLY in
  hairlines/labels/the thread — never big fills.
- **Type:** Instrument Serif (lowercase editorial headlines), Instrument Sans
  (body), Spline Sans Mono (eyebrows, labels, step numbers). Google Fonts.
- Minimalist, lots of negative space, editorial. Keep it restrained.

## Structure

```
index.html               Vite entry (+ SPA path-restore script)
public/
  404.html               GitHub Pages SPA fallback (pathSegmentsToKeep = 1)
  assets/img/            all photos (served as-is)
  assets/video/          clip-1..3 .mp4 + matching .jpg posters (work carousel)
src/
  App.tsx                routes
  main.tsx               Router + base path
  styles/global.css      the ENTIRE design system (plain CSS + tokens)
  components/
    Header.tsx           nav + hamburger/overlay + scroll state
    Footer.tsx
    Thread.tsx           home: scroll-drawn thread + hero parallax
    StepThread.tsx       aftercare: thread timeline connecting steps
    VideoCarousel.tsx    work: studio clips carousel
    BookingFlow.tsx      book: 3-step flow + Calendly embed
    RouteEffects.tsx     scroll-to-top + reveal-on-scroll observer
  pages/                 HomePage / WorkPage / AftercarePage / BookPage
  lib/asset.ts           resolves /public paths against BASE_URL
  lib/useTitle.ts        per-page <title>
```

Routes: `/` `/work` `/aftercare` `/book`.

## Local dev

```bash
npm install
npm run dev      # http://localhost:5173/inkbyos-website/
npm run build    # type-check + prod build (must pass before pushing)
```

Iterate: edit → `git add -A && git commit -m "…" && git push` → auto-deploys.
Hard-refresh (Cmd+Shift+R) to beat the CDN cache after a change.

## Gotchas / conventions

- **Base path:** app is served under `/inkbyos-website/`. Reference public
  assets via `asset('assets/img/x.jpg')`, never a bare `/assets/...`.
- **Reveals:** add `className="reveal"` (+ optional `data-delay="1..4"`) to any
  element; `RouteEffects` observes them on each route change. `reveal in` =
  visible immediately (used in hero).
- **Thread height fix:** both thread SVGs collapse their own height to 0 before
  measuring `scrollHeight` — otherwise the absolutely-positioned SVG inflates it
  in a feedback loop. Keep this if you touch `Thread.tsx` / `StepThread.tsx`.
- **Home only:** `HomePage` toggles `body.has-thread` (drives z-index layering so
  the thread sits behind content). Don't remove.
- **Booking:** `BookingFlow.tsx` is a 3-step flow (the idea → you → pick a time).
  Step 3 loads Calendly's widget script and calls `initInlineWidget` with
  `CALENDLY_URL` (`https://calendly.com/inkbyos/30min`), themed via query params
  and **prefilled** with the visitor's name, email and brief. The brief lands in
  `customAnswers.a1` — i.e. the **first custom question on the Calendly event**;
  if that question is removed the brief silently won't show (nothing breaks).
  Swap `CALENDLY_URL` to change events; if it ever contains `YOUR_CALENDLY_HANDLE`
  the step falls back to a mailto panel instead of a broken embed.
- **Videos:** source `.MOV`s are NOT in the repo. Re-encode new clips to match:
  `ffmpeg -i in.MOV -vf scale=1280:-2 -c:v libx264 -crf 27 -preset slow -an
  -movflags +faststart out.mp4` (+ a poster jpg). Keep them small — they ship
  to GitHub Pages.
- **prefers-reduced-motion** is respected throughout; preserve that.

## Client facts

- Studio: Waterloo, ON, Canada · Email: inkbyos@gmail.com · Phone: 519-501-2910
- Socials: instagram.com/inkbyos, tiktok.com/@inkbyos, facebook.com/inkbyos
- Tagline: "for the love of art." Self-taught artist ("Os"); fine-line,
  minimalist, abstract work.
- Contact details live in `Footer.tsx` and `BookPage.tsx`.

## Open items / not done yet

- **Calendly event setup:** keep a "share anything that helps me prepare"–style
  question **first** on the `inkbyos/30min` event so the prefilled brief has
  somewhere to land (see the booking gotcha above).
- **Gallery captions** in `WorkPage.tsx` are our best-guess style labels
  (e.g. "Traditional · snake"). Swap for real titles if the artist provides them.
- **Carousel captions** in `VideoCarousel.tsx` ("The process", "Fine-line, up
  close", "Linework") are also our guesses — swap if the artist has better ones.
- **Custom domain (inkbyos.com):** when ready, set `base: '/'` in
  `vite.config.ts` and `pathSegmentsToKeep = 0` in `public/404.html`.

## Note for the assistant

The client is iterating on look & feel — prefer small, reversible changes and
verify with `npm run build` before pushing. See `README.md` for fuller docs.
