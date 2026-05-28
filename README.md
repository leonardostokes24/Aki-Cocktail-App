# Kiyori × Aki — Cocktail Spec Study

Self-contained flashcard study tool for cocktail specs at **Kiyori** (the underground vault bar) and **Aki** (the ground-floor restaurant bar) at One Cavendish Square, London, plus a deck of classic UK bar standards for revision.

No build step. No framework. Plain HTML / CSS / JS. Open `index.html` in any browser or deploy straight to GitHub Pages.

---

## Decks

| Venue       | Count | Notes                                                    |
|-------------|-------|----------------------------------------------------------|
| **Kiyori**  | 9     | Vault bar — spec labels + menu descriptions             |
| **Aki**     | 12    | Ground-floor bar — 6 botanical categories, alc + N/A pairs |
| **Classics**| 11    | UK bar standards — prep notes only                       |

### Kiyori
Sakura · Hokkaido · Torii · Maiko · Fuji-San · Womb · Seppuku · Koshu · Kawaii

### Aki (categories)
Sakura · Yuzu · Sancho · Green Tea · Ume · Soy

### Classics
Clase Azul Mar · Rum Highball · Lychee Martini · Mimosa · Margarita · Old Fashioned · Martini · Moscow Mule · Daiquiri · Negroni · Espresso Martini

---

## Features

- **Three-venue toggle** at the top — switch between Kiyori, Aki, and Classics
- **Category pills** within each venue (Signature / Aperitif / Premium for Kiyori; botanical categories for Aki)
- **Tap to flip** — spec on front, full build / narrative on back
- **Shuffle** for randomised practice
- **Swipe left/right** on mobile, arrow keys on desktop, spacebar to flip
- **N/A badge** on non-alcoholic serves
- **Three card layouts** tailored to each deck (Kiyori spec-grid, Aki ingredients + tasting notes, Classics recall-only)

---

## File structure

```
.
├── index.html      ← entry point
├── styles.css      ← all visual styling
├── app.js          ← rendering + interaction logic
├── data.js         ← cocktail data (edit here)
├── LICENSE
└── README.md
```

---

## Editing cocktails

Open `data.js`. Each entry is a JavaScript object. The `venue` field controls which deck the card appears in.

### Kiyori entry
```js
{
  venue: "Kiyori",
  name: "Sakura",
  kanji: "桜",
  category: "Signature",
  price: "£18",
  prefecture: "Kakunodate · Cherry Blossom",
  narrative: "Hanami — ...",
  ingredients: "Roku gin · Mancino Sakura · ...",
  volume: "100ml Premix",
  method: "Build",
  glass: "Nick & Nora",
  garnish: "Sakura Coin",
  ice: "—",
  hasNA: false
}
```

### Aki entry
```js
{
  venue: "Aki",
  name: "Hishio (Fermented Sauces)",
  kanji: "醤",
  category: "Soy",
  price: "£18",
  tastingNotes: ["bitter-sweet", "umami", "light citrus"],
  ingredients: "Bombay Sapphire, Etsu Double Orange, ...",
  prep: "Build, 100 premix, Rocks Glass / Block ice, Orange jelly, Sesame spray.",
  hasNA: false
}
```

### Classic entry
```js
{
  venue: "Classics",
  name: "Negroni",
  category: "Classic",
  prep: "Stirred. 25ml Gin, 25ml Campari, 25ml sweet vermouth. Rocks, orange slice."
}
```

Setting `hasNA: true` adds a small "N/A AVAILABLE" badge to the card.

---

## Deploying to GitHub Pages

1. Create a new GitHub repository (e.g. `kiyori-aki-flashcards`).
2. Upload all files in this folder to the repo root.
3. Repo → **Settings** → **Pages**.
4. Source: **Deploy from a branch**. Branch: `main`, folder: `/ (root)`. Save.
5. Wait ~1 minute. Your site is live at `https://<username>.github.io/<repo-name>/`.

Or via command line:
```bash
git init
git add .
git commit -m "Initial flashcard app"
git branch -M main
git remote add origin https://github.com/<username>/<repo-name>.git
git push -u origin main
```

Then enable Pages in repo settings.

---

## Running locally

Just open `index.html` in a browser. No server required.

If you want hot-reload while editing:
```bash
# Python
python3 -m http.server 8000
# Node
npx serve .
```

---

## Sources

- **Kiyori specs**: on-site bar station labels (May 2026) + [kiyoribar.com/menu](https://kiyoribar.com/menu/)
- **Aki specs**: previous bar station capture, 12 cocktails across 6 botanical categories
- **Classics**: UK bar standard builds

---

## Credit

Built for personal bar-staff training and menu revision. Aesthetic is inspired by Kiyori's actual interior — Francis Sultana's bronze and gold vault palette, set against a dark hospitality reference card style.

---

## License

MIT — see `LICENSE`.
