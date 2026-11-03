# The Grand Codex

A RuneScape 3 training field guide covering all 29 skills, with sourced research, equipment tiers and XP-boost caveats.

## Website

Designed for GitHub Pages at `https://xgsoxshazam.github.io/Runescape-/`.

This is a buildless static site. No packages, accounts, API keys or build step are required. Enable GitHub Pages from **main / (root)** in the repository's **Settings → Pages**.

## Local preview

Run `python -m http.server 8000` from this directory, then open `http://localhost:8000`.

## Features

- Responsive charcoal, forest and antique-gold visual theme
- Animated heraldic illustration and interactive skill cards
- All 29 skills with essentials, upgraded and premium equipment tiers
- Category and equipment search; `/` focuses search
- Saved skills and selected tier persist in browser local storage
- Accessible native-dialog research panels, Escape-to-close and shareable skill links
- Reduced-motion support and no tracking

## Editing

`skills-data.js` contains the card information, tier lists and detailed sourced notes. `app.js` implements filtering, collection storage and research panels. `styles.css` contains the responsive theme; `index.html` contains the page structure.

Research was checked on **2 November 2026**. Update date-sensitive information before relying on it after the listed changes. Prices and XP/hour are method-dependent. This is an independent reference, not an official Jagex website. Source links are included in the relevant skill panels; RuneScape is a Jagex trademark.
