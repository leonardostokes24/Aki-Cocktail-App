# Cocktail Flashcards

A study deck for menu and classic cocktails. Bilingual names, tasting notes, station builds.
Single-page, offline-capable PWA — installable on Android, iOS, and desktop.

## Live site
Once GitHub Pages is enabled, this will be available at:
`https://<your-username>.github.io/<repo-name>/`

## Files
- `index.html` — the whole app (HTML + CSS + JS + embedded cocktail data)
- `manifest.webmanifest` — PWA manifest
- `sw.js` — service worker (offline cache)
- `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` — app icons
- `icon.svg` — source vector for the icon

## Enabling GitHub Pages
1. Push these files to the `main` branch.
2. **Settings → Pages → Branch: `main` / `(root)` → Save.**
3. Wait ~1 min, then open the URL.

## Installing as an app
- **Android (Chrome):** open the site → menu → *Install app* / *Add to Home Screen*.
- **iOS (Safari):** Share → *Add to Home Screen*.
- **Desktop (Chrome/Edge):** install icon in the address bar.

## Building an APK
1. Make sure the live URL above works.
2. Go to [pwabuilder.com](https://www.pwabuilder.com), paste the URL.
3. Package for **Android** → download the signed APK.

## Updating the deck
Edit the embedded JSON inside `index.html` (search for `const DB =`).
Then bump `CACHE_VERSION` in `sw.js` so installed users pick up the new data.
