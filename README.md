# Press Compare IL 📰

**Press Compare IL** is an open-source web app for comparing how different Israeli news outlets cover the same event. It helps readers spot differences in framing, tone, language, and emphasis between sources — making media bias visible and easier to understand.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org/) with App Router |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Data | Local mock data (no backend) |

---

## How to Run Locally

**Prerequisites:** Node.js 18+ and npm.

```bash
# 1. Clone the repository
git clone https://github.com/omri10007/press-compare-il.git
cd press-compare-il

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
press-compare-il/
├── app/
│   ├── layout.tsx          # Root layout (Header + Footer)
│   ├── page.tsx            # Homepage — lists mock events
│   └── event/[id]/
│       └── page.tsx        # Dynamic event detail page
├── components/
│   ├── Header.tsx          # Site-wide navigation header
│   ├── EventCard.tsx       # Card shown on the homepage
│   ├── SourceCard.tsx      # Card for a single news source
│   └── ComparisonSection.tsx # Highlights framing differences
└── lib/
    └── mockData.ts         # All mock events and source data
```

---

## Current MVP Scope

- **Homepage** with a hero section and a list of 3 mock news events (title, summary, category, timestamp, source count).
- **Event detail page** (`/event/[id]`) with:
  - Event header (title, summary, category, date)
  - 3–4 source cards per event (outlet name, headline, excerpt, language, tags, timestamp)
  - A **Comparison section** highlighting differences in framing, tone, and emphasis between sources
- **Fully static** — no backend, no API calls, no authentication.
- **Responsive** layout that works on mobile and desktop.

---

## Next Planned Steps

1. **Real data pipeline** — integrate RSS feeds or scraping to pull live articles from Israeli news outlets.
2. **AI-powered comparison** — use an LLM to auto-generate framing analysis for each event.
3. **Search & filter** — filter events by category, date range, or outlet.
4. **Outlet profiles** — dedicated pages describing each outlet's editorial stance and ownership.
5. **Bookmarks & sharing** — allow users to save comparisons and share links.
6. **i18n** — add Hebrew and Arabic UI translations.
7. **Database** — persist events, sources, and user interactions (e.g., with Supabase or PlanetScale).

---

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## License

MIT
