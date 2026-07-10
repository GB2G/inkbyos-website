# InkbyOs — website

A modern, minimalist, dark website for **InkbyOs**, a private tattoo studio in
Waterloo, Ontario. Rebuilt from the original inkbyos.com content into a fast,
static site with no page builder and no dependencies.

Design direction: *"the line"* — a fine-line motif drawn from the studio's
actual work, an ink-on-skin palette (warm near-black, paper white, a single
restrained bronze accent), and an editorial serif + mono type system.

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Landing page — hero, welcome/ethos, about the artist, selected-work teaser, contact |
| `work.html` | The gallery — selected pieces + a live Instagram callout |
| `aftercare.html` | Full healing guide (cleanse · moisturize · avoid · expect) |
| `book.html` | Booking form (the webform) |

Shared assets: `css/style.css`, `js/main.js`, images in `assets/img/`.

## View it locally

From this folder:

```bash
python3 -m http.server 8765
```

Then open <http://localhost:8765>. (Any static file server works.)

## Deploy

It's a plain static site — drop the whole folder onto any static host:

- **Netlify / Vercel / Cloudflare Pages** — drag-and-drop the folder, or connect a repo.
- **GitHub Pages** — push to a repo and enable Pages.
- Point the `inkbyos.com` domain at whichever host you choose.

No build step is required.

## Add your tattoo photos  (important)

The gallery on `work.html` currently shows the real photos available from the
old site plus a few placeholder tiles marked **"your piece here."** To add work:

1. Drop photos into `assets/img/` (e.g. `piece-04.jpg`). Portrait-orientation
   images look best. Keep them web-sized — around 1200–2000px on the long edge.
2. In `work.html`, copy one `<figure class="figure">` block, and change the
   `src`, `alt`, and caption. Delete a `<div class="slot">` placeholder to keep
   the grid balanced.

Your live portfolio also stays linked front-and-centre via the Instagram
callout (@inkbyos), so new work shows even before it's added here.

## The booking form

`book.html` works **out of the box**: on submit it opens the visitor's email app
with all the details pre-filled to `inkbyos@gmail.com`.

To collect submissions in a dashboard instead (recommended so nothing is missed):

1. Create a free endpoint at <https://formspree.io> (or similar).
2. In `book.html`, replace `YOUR_FORM_ID` in the form's `action` with your real
   endpoint. The form will then POST there automatically and email fallback is
   no longer used.

## Editing content

Everything is hand-written HTML/CSS — no framework to learn.

- **Text**: edit the relevant `.html` file directly.
- **Colours / fonts / spacing**: all defined as variables at the top of
  `css/style.css` under `:root`.
- **Contact details / social links**: appear in the footer of every page and on
  `book.html`. Search for `inkbyos@gmail.com`, `519-501-2910`, and the
  `instagram.com/inkbyos` / `tiktok` / `facebook` links to update.

## Credits / notes

- Fonts: Instrument Serif, Instrument Sans, Spline Sans Mono (Google Fonts).
- All copy and imagery originate from the existing inkbyos.com. Two images from
  the old site were repurposed for the aftercare and gallery pages; the original
  hero/portrait photos of the artist are used on the landing and work pages.
