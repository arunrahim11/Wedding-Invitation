# Priya & Arjun — Royal Wedding Invitation

A single-page Indian wedding invitation in a royal aesthetic: mandala
medallions, gold jali-lattice framing, a marigold petal drift, an "Open
Invitation" reveal, multi-function event schedule (Mehendi / Haldi /
Sangeet / Wedding / Reception), countdown timer, gallery, RSVP form, and an
embedded map. Pure HTML/CSS/JS — no build step, works as-is on GitHub Pages.

> This is an original design built for you — it is not a copy of any
> commercial invitation template. All artwork in `assets/` (mandala, jali
> pattern, corner ornaments, petal, gallery placeholders) was generated for
> this project, so you're free to use, edit, and deploy it without
> licensing concerns.

## File structure

```
index.html          all page content
css/style.css        all styling (design tokens at the top)
js/script.js          all behavior (edit the two constants at the top first)
assets/               mandala/jali/petal artwork + where your music file goes
```

## The things to personalize

**1. Names, date, and copy** — in `index.html`, search-and-replace `Priya`,
`Arjun`, and the dates/venues throughout, and rewrite the story and event
details.

**2. Wedding date for the countdown** — open `js/script.js`, edit the first
line inside the file:

```js
const WEDDING_DATE = new Date('2026-12-06T07:00:00+05:30');
```

Set it to your main ceremony's start time, with the correct UTC offset.

**3. Wedding events** — the "Wedding Events" section (`#events` in
`index.html`) has one card per function. Add, remove, or rename `<div
class="event-card">` blocks freely — common ones are Mehendi, Haldi,
Sangeet, the wedding ceremony, and the reception, but this is entirely
yours to shape.

**4. Background music** — drop an MP3 into `assets/music.mp3` (keep that
filename, or update the `<source>` path in `index.html`). Browsers block
autoplay, so guests turn it on with the "Sound Off / Sound On" pill in the
bottom-right corner. If no file is present, the button fails silently.

**5. Gallery photos** — replace the six files in `assets/` (currently
`gallery-1.svg` … `gallery-6.svg`, mandala-medallion placeholders labeled
by function) with your own photos, keeping the same filenames, or update
the `src` attributes in the gallery section of `index.html` to match new
names. Add or remove `<div class="gallery-item">` blocks for more or fewer
photos.

**6. RSVP form → your inbox** — works immediately in *demo mode* (logs
submissions to the browser console so you can test before going live). To
receive real replies with zero backend:
   - Create a free form at [formspree.io](https://formspree.io) and copy
     your endpoint URL.
   - In `js/script.js`, paste it into:
     ```js
     const RSVP_ENDPOINT = 'https://formspree.io/f/xxxxxxx';
     ```

**7. Map location** — in `index.html`, find the `<iframe>` in the Map
section and replace the query in its `src`:
```html
src="https://www.google.com/maps?q=YOUR+VENUE+ADDRESS&output=embed"
```
No API key needed. For a branded pin instead of a plain address search, use
Google Maps' own "Share → Embed a map" panel and paste that `src` in.

## Running it locally

Just open `index.html` in a browser — no server needed. If music doesn't
behave under a `file://` URL, serve the folder instead:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploying to GitHub Pages

1. Push this folder's contents to the root of a GitHub repository (or a
   `/docs` folder).
2. In the repo: **Settings → Pages**.
3. Under **Source**, pick the branch/folder you pushed to, and save.
4. GitHub gives you a live URL (`https://yourusername.github.io/repo-name/`)
   within a minute or two.

No `.nojekyll` file or config is needed — this is a static site.

## Accessibility & performance already built in

- Keyboard-operable "Open Invitation" button and visible focus states
  throughout.
- Respects `prefers-reduced-motion` — petals and reveal animations turn off
  for guests who've asked their system for that.
- Images use `loading="lazy"`; audio uses `preload="none"`.
- Fonts load from Google Fonts (Cinzel Decorative, Marcellus, Mukta) — no
  local font files to manage.
