# TradingWithPurpose — Command Centre

## What This App Is

A personal trading command centre built for a professional crypto swing trader. The user trades BTCUSDT perpetuals on a $5,000 account using a discretionary HTF (High Time Frame) breakdown strategy. The app is used every Sunday for pre-market preparation and throughout the week for trade logging and review.

This is a single HTML file (`index.html`) with all CSS and JavaScript inline. No frameworks, no build step required. It must work as a standalone HTML file opened directly in a browser.

---

## The User

- Trades BTCUSDT perpetuals, swing timeframe (holds days to weeks)
- Uses 10x isolated margin, 1-1.5% risk per trade, minimum 2R R:R
- Max drawdown 3.5% ($175 on $5k account)
- One trade at a time
- Key setups: HTF Breakdown + Monday Range Failed Reclaim Short, Range High Failed Breakout Short
- Uses Edgewonk for trade journaling, Obsidian for playbook notes
- Uses a separate position size calculator at tradecalc-pink.vercel.app

---

## App Structure — 6 Tabs

### Tab 1 — Pre-Market Review
Used every Sunday. Sections:
- Calendar events and macro risks for the week
- Macro market regime summary
- Markets review table (BTC, ETH, SOL, XRP) with support levels, resistance levels, actionable items
- Check mappings checklist (6 items, clickable toggles)
- Check oscillators (6 inputs: 1W/1D/H4 Stoch RSI and RSI)
- Trade contextual environment (ranging/rotational/trending toggle, ATR, book depth, volume, market structure observations)

**Critical feature:** Reviews save by date to localStorage. User can save multiple weeks and look back at any previous review by selecting from a dropdown. Each review is stored under its date as a key.

### Tab 2 — Trade Sheet
Filled in for every trade including re-entries. Contains:
- Trade metadata (date, pair, direction, setup name, entry, stop, target, result in R)
- 5 question sections: Plan vs Reality, Entry Quality, Trade Management, Exit & Aftermath, Key Takeaway
- Multiple trades stored — user selects from dropdown to view/edit past trades
- Auto-saves to localStorage as user types

### Tab 3 — Weekly Review
End of week reflection. 5 questions:
1. What did I do well this week?
2. What did I not do well?
3. Did I deviate from my trade plan/process? If yes, why?
4. What was the outcome of deviating?
5. How do I plan to improve for next week?

### Tab 4 — Monthly Review
End of month deep dive. 5 sections: Process and Plan, Emotions, Discipline and Self Awareness, Habits/Patterns, Improvements. 3 questions each.

### Tab 5 — Economic Calendar
Embedded live Investing.com economic calendar iframe showing USD high-impact events. Plus a notes field for calendar observations.

### Tab 6 — Resources
Quick links to: Position Size Calculator, Hyperliquid, TradingView, Edgewonk, Economic Calendar, Obsidian. Plus risk framework reminder showing 1-1.5% risk, 2R minimum, 3.5% max drawdown.

---

## Known Issues — Fix These First

1. **TABS NOT WORKING** — This is the most critical bug. Clicking tabs does nothing. The switchTab() function exists but onclick handlers cannot find it because Vite treats the inline script as an ES module, making functions not globally accessible. Fix: ensure the script tag has `type="text/javascript"` so functions are in global scope. Alternatively attach all event listeners programmatically using addEventListener inside a DOMContentLoaded handler.

2. **Delete button for pre-market reviews** — Uses a two-click confirmation system (first click changes button text to CONFIRM DELETE?, second click deletes). This should work but verify it correctly removes the review from localStorage and refreshes the dropdown.

3. **Download PDF** — The download button generates a standalone HTML file of the current review and downloads it. User then opens it and prints to PDF. Verify this works correctly.

---

## Design Rules — Never Change These

- **Dark theme** — background #040810, surface #070c10, border #131e2a
- **Accent colours** — green #00d4aa, blue #3a7bd5, amber #f0a050, red #e05252
- **Font** — IBM Plex Mono for all text, Bebas Neue for display headings
- **Branding** — TRADINGWITHPURPOSE must appear in the header with the green pulsing dot
- **Layout** — sticky top bar, tab navigation below it, content area below that

---

## What To Never Remove Or Break

- All 6 tabs and their content
- localStorage save/load for pre-market reviews (date-based), trade sheet (array of trades), weekly review, monthly review
- The delete functionality for pre-market reviews
- The download PDF feature
- The economic calendar iframe
- All question text exactly as written
- The risk framework reminder in Resources tab
- The quick links in Resources tab
- The oscillator inputs (1W/1D/H4 Stoch RSI and RSI)
- The markets table (BTC, ETH, SOL, XRP)
- The env-card toggles for mapping checklist and market type

---

## Improvement Priorities (In Order)

1. Fix tab navigation (critical — nothing else matters until this works)
2. Improve mobile responsiveness — the app is used on iPhone as a PWA
3. Improve save/load reliability for pre-market reviews
4. Better visual feedback when saving (confirmation messages)
5. Smoother transitions between tabs
6. Ensure all textareas auto-resize to content
7. Add keyboard shortcuts (Ctrl+S to save)
8. Improve the economic calendar tab layout

---

## Technical Notes

- All JavaScript is inline in a single script tag
- All CSS is inline in a single style tag
- localStorage keys: twp-pm-reviews, twp-trades, twp-weekly, twp-monthly, twp-calendar
- The pre-market reviews are stored as an object keyed by date string (YYYY-MM-DD)
- Trades are stored as an array
- The app must work without any internet connection except for Google Fonts and the economic calendar iframe
- Do not add any external JavaScript libraries or dependencies
- Do not split into multiple files — must remain a single index.html

---

## Deployment

- Hosted on Vercel
- GitHub repo: HamzahParkar/Command-Centre
- Every merged pull request auto-deploys to Vercel
- This GitHub Action runs daily, analyses the code, and opens a pull request with improvements
- The user reviews and merges pull requests — they should be small, focused and safe to merge
