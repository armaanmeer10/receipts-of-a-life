# Receipts of a Life

> Eleven years of Spotify scrobbles, bank transactions, and digital exhaust forensically audited and printed on 80mm thermal receipt paper.

**Live Demo:** [https://receipts-of-a-life.vercel.app/#/](https://receipts-of-a-life.vercel.app/#/)  
**GitHub Repository:** [https://github.com/armaanmeer10/receipts-of-a-life](https://github.com/armaanmeer10/receipts-of-a-life)

---

## 🧾 Concept: "Your Life, In Receipts"

What if your digital life—every late-night playlist loop, first paycheque, monthly subscription, and sudden life pivot—could be forensically audited and printed as a continuous roll of thermal paper?

**Receipts of a Life** transforms raw personal history (149,860 Spotify music scrobbles and 2,461 bank ledger transactions spanning 2013 to 2024) into a tangible, interactive receipt-printing experience. Built with a bold neo-brutalist aesthetic, high-contrast thermal paper styling, and live audio feedback, it provides a unique lens into modern digital existence.

---

## 🎯 Hackathon Requirement Mapping

| Hackathon Requirement                   | Page                                                     | Component(s)                                                      | Implementation Details                                                                                                                                          |
| :-------------------------------------- | :------------------------------------------------------- | :---------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Explore Receipts**                    | Hero (`/`), Story Roll (`/story`), Explore (`/explore`)  | `<Receipt>`, `<ChapterDetail>`, Event Logs                        | Real-time thermal receipt rendering with line items, subtotal, date range, year barcode, and detailed event logs.                                               |
| **Filtering / Searching / Navigation**  | Explore (`/explore`), Nav (`/`), String Board (`/board`) | Search Input, Preset Audit Chips, Category Filters, Year Selector | Search events by text, filter by preset chips (`The Beatles`, `Subscriptions`, `Investments`, `Salary`), and filter all views by year (`2013`–`2024` or `ALL`). |
| **Relationship & Pattern Discovery**    | String Board (`/board`), Insights (`/insights`)          | `<StringLayer>`, Pinned Cards, `<Dossier>`, Archetype Cards       | Interactive corkboard with SVG red string paths connecting scrobbles to investments/subscriptions, plus 4 behavioral psyche cards.                              |
| **Interactive Storytelling Experience** | Hero (`/`), Story Roll (`/story`)                        | Thermal Printer Animation, Chapter Rolls, Timeline Scrubber       | Animated receipt ejection, Web Audio API printer chimes, timeline scrubber playback, and "Print Story" triggers.                                                |
| **Clear Visual Journey**                | Entire Application                                       | Step-by-Step Navigation, Page Header Tags, Live Ticker            | Chronological narrative progression from 2013 origin scrobble to 2017 peak listening/finance activity to final synthesis.                                       |
| **Responsive Design**                   | Entire Application                                       | Tailwind CSS Grid/Flexbox, Touch Targets                          | Mobile-first layout with 44px minimum touch targets, responsive drawer dossiers, and container overflow protection.                                             |

---

## 📱 Page-by-Page Features

### 1. Hero Page (`/`)

- **Thermal Printer Engine**: Feeds out a physical 80mm receipt with jagged cutoffs, date ranges, line items, and dynamic barcode (`*POS-[YEAR]-AUDITED*`).
- **Year Selector Bar**: Switch between `ALL` (2013–2024) or specific audit years (`2013`–`2024`).
- **Dynamic Stat Tiles**: Interactive count-up tiles displaying year-specific Music Scrobbles, Acoustic Hours, Purchase Ledger counts, and Timeline spans.
- **Neo-Brutalist Stickers**: Rotated high-contrast badge overlays highlighting active year metrics.
- **Print Story & Save Receipt**: Re-trigger receipt feeding animation with Web Audio beeps, or invoke browser `@media print` thermal paper output via `window.print()`.

### 2. Story Roll (`/story`)

- **5 Chronological Chapter Rolls**:
  1. _Chapter 01: Late-Night Beginnings (2013–2014)_ — First scrobble signal.
  2. _Chapter 02: The Winter Pivot (2015–2016)_ — First salary & investments.
  3. _Chapter 03: The Year of Everything (2017)_ — Peak 5,176 plays/month & ₹2L FD.
  4. _Chapter 04: Peak Volume & Ambience (2018–2020)_ — Subscription stack & lockdown loops.
  5. _Chapter 05: The Quiet Years (2021–2024)_ — Archive fade out.
- **Interactive Scrubber & Print Head Control**: Jump across years or toggle live thermal print head emission.

### 3. String Board (`/board`)

- **The Conspiracy Board**: Corkboard layout with pinned receipt-style evidence cards.
- **SVG Red String Layer**: Dynamic SVG paths illustrating verified data correlations:
  - _c1–c4_: 02:44 AM origin scrobble pre-dating first salary.
  - _c4–c5_: Exactly 5 days between first salary (28 Feb 2015) and first investment (05 Mar 2015).
  - _c2–c3_: 2016 Beatles discovery triggering the 2017 peak listening month.
- **Forensic Investigation Dossier**: Slide-out case file details showing step-by-step chain of causation and system relationships.

### 4. Explore (`/explore`)

- **Console Log Database Interface**: High-density database log search.
- **Live Search & Clear**: Real-time filtering by track, merchant, category, or note tag with `Esc` key reset.
- **Preset Audit Chips**: Quick-filter shortcuts (`The Beatles`, `Subscriptions`, `Investments`, `Salary`, `Travel`, `Notes`).
- **Timeline Playback**: Automated year scrubber playback.
- **Exhibit A (Top Artists Audit)**: Dynamic bar chart audit of top scrobbled artists per year.
- **Exhibit B (Purchase Ledger Donut)**: Custom SVG donut chart dissecting annual financial spend.

### 5. Insights (`/insights`)

- **Behavioral Audit & Psyche Synthesis**: Four neo-brutalist archetype cards taped to the page:
  - `#01 Night Owl`: Late-night scrobbles (00:00–04:59 UTC).
  - `#02 Beatles Loyalist`: Mono-artist focus loops.
  - `#03 Saver Investor`: Fixed deposit and SIP capital allocations.
  - `#04 Binge Listener`: 24-hour repeat scrobble spikes.
- **Dynamic Year Adaptability**: Automatically renders `"No records for this year"` fallback messaging for quiet archive years without fake zero metrics.

---

## 💡 Data Engine & Connection Discovery

### `getYearStats(events, stats, selectedYear)`

Raw dataset records (`events.json` and `stats.json`) are processed through `src/utils/yearStats.js`:

1. **ISO Date Parsing**: Matches event timestamps against the target 4-digit year string.
2. **Dynamic Aggregation**: Sums music scrobbles, calculates acoustic hours, totals purchase ledger entries, tracks salary credits, and tallies active investments and subscriptions.
3. **No Fake Zeros**: Years without recorded entries for a specific metric cleanly output `null` or `"No records"`.

### Data Relationship Discovery

Relationships are discovered by cross-referencing timestamps across distinct event categories (`type: 'music'`, `type: 'income'`, `type: 'investment'`, `type: 'subscription'`):

- **Temporal Correlation**: Identifying liquidity events (e.g. salary credited on Feb 28) followed immediately by capital deployment (PPF/SIP created on March 5).
- **Behavioral Correlation**: High-volume mono-artist scrobble binges co-occurring with intensive coding or project windows.

---

## 📁 Folder Structure

```text
receipts/
├── public/ — Static assets including stats.json, events.json, and favicon.svg
├── src/ — React application source code
│   ├── assets/ — Image and style assets
│   ├── components/ — Reusable UI components (Nav, Ticker, Receipt)
│   ├── context/ — React YearContext provider for global year state
│   ├── lib/ — Utility helper functions (formatting, audio synthesis)
│   ├── pages/ — Route pages (Hero, StoryRoll, StringBoard, Explore, Insights)
│   └── utils/ — Pure dynamic data calculation engine (yearStats.js)
```

---

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite
- **Routing**: React Router DOM (`HashRouter` for zero-config client-side routing)
- **Styling**: Tailwind CSS + Vanilla CSS (Custom neo-brutalist tokens & `@media print` rules)
- **Animations**: Framer Motion (Spring physics & exit transitions)
- **Typography**: Google Fonts (_Space Grotesk_ for display titles & _JetBrains Mono_ for receipts)
- **Audio**: Web Audio API (Synthesized square-wave 880Hz thermal printer beep tones)

---

## 🎨 Design Decisions

1. **Neo-Brutalist Aesthetic**: High-contrast color palette (`#ffe500` Sun Yellow, `#ff4d8d` Hot Pink, `#00f5a0` Mint Green, `#b8f500` Volt Yellow), 3px solid black borders (`#111`), hard offset box-shadows (`shadow-brut`), and monospaced receipt text.
2. **HashRouter**: Selected to ensure flawless client-side page navigation on static hosting environments (e.g. GitHub Pages) without server rewrite rules.
3. **Frontend-Only Architecture**: Performs 100% of data parsing, timeline scrubbing, and chart rendering on the client side with zero external API latency or backend dependencies.

---

## ♿ Accessibility & Performance Notes

- **Keyboard Navigation**: Full keyboard accessibility with clear focus states and `Esc` shortcut to clear search queries.
- **ARIA Standards**: Accessible labels (`aria-label`), button press states (`aria-pressed`), and hidden decorative SVGs (`aria-hidden="true"`).
- **Touch Friendly**: All interactive buttons meet or exceed the 44px minimum touch target recommendation.
- **Bundle Optimization**: Rapid build times (~500ms) with lightweight custom SVG chart implementations.

---

## 🚀 How to Run Locally

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Installation & Setup

```bash
# Clone repository
git clone https://github.com/armaanmeer10/receipts-of-a-life.git
cd receipts-of-a-life/receipts

# Install dependencies
npm install

# Start development server
npm run dev

# Production build
npm run build

# Code linting
npm run lint
```

---

## ⚠️ Limitations & Future Work

- **Dataset Scope**: Bank ledger entries are available primarily for 2015–2018; years outside this window reflect music scrobbles and show `"No records"` for financial transactions.
- **Future Enhancements**: Live integration with Spotify Web API and Plaid/Open Banking API to allow users to generate personal thermal receipts in real time.

---

## 👏 Credits & Acknowledgments

- **Dataset**: Provided by the hackathon organizers (`stats.json` & `events.json`).
- **UI Design**: Visual design created in **Google Stitch**.
- **Development**: Built with **Antigravity AI** coding assistant.
