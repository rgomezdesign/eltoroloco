# El Toro Loco Grill — concept redesign

A concept redesign of a local Mexican restaurant’s website and pickup ordering, by [Roman Gomez](https://rgomezdesign.com).
**Not affiliated with El Toro Loco Grill.** The menu and prices are samples and ordering is a demo: no payment details are collected and no orders are sent. For real orders, visit [the restaurant’s site](https://www.eltorolocogrill.online/).

**Live:** https://rgomezdesign.github.io/eltoroloco/

## What’s here
- **Home** — food-forward hero, fan favorites, the classic street tacos, hours and location
- **Menu** — sticky category tabs that follow your scroll, photo cards and quick-add rows, a live cart on desktop and a sticky cart bar on mobile
- **Item sheet** — options in a bottom sheet (dialog on desktop): required choices first, add-ons with prices, notes, quantity
- **Cart → Checkout → Confirmation** — pickup only, three decisions (when, who, how to pay), inline validation, demo confirmation

## Stack
Next.js 16 (static export) · React 19 · Tailwind CSS 4 · Bricolage Grotesque + Inter. Design tokens in `src/app/globals.css` mirror the Figma variables. Cart state lives in `localStorage`.

```bash
npm install
npm run dev                         # http://localhost:3000
GITHUB_PAGES=true npm run build     # static export to out/ with the /eltoroloco base path
```

Deploys to GitHub Pages on every push to `main`. Food photography: Adobe Stock (licensed).
