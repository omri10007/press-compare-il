# Initial Build Prompt

Use this prompt with ChatGPT, Claude, Gemini CLI, Cursor, Windsurf, or another coding agent to generate the first working version.

---

Build a minimal but polished MVP for a web app called **Press Compare IL**.

## Product goal
The product helps users compare how different Israeli news outlets frame the same event.

## Important constraints
- Build the **smallest working version** that demonstrates real value.
- Do **not** add authentication, payments, admin dashboards, or scraping pipelines.
- Use **mock local data** stored in the codebase.
- The app should feel trustworthy, clean, and easy to understand.
- Avoid making claims about "objective bias scores".
- The comparison language should be neutral and careful.

## Tech requirements
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Local JSON or TS data file
- Ready for Vercel deployment

## Required pages
### 1. Homepage
Include:
- app title: Press Compare IL
- one-sentence explanation
- list of 5 sample stories pulled from local data
- CTA to open a comparison page

### 2. Story comparison page
For a selected story, show:
- story title
- event date
- neutral top-level summary
- 3 to 5 source cards

Each source card must include:
- outlet name
- headline
- short summary
- framing tags
- tone / emphasis notes
- optional notable quote
- external link button

Also include a top comparison section with:
- shared themes
- main differences in emphasis
- possible omissions or missing context across some sources

## UX requirements
- responsive layout
- visually clean and modern
- easy to scan in under 60 seconds
- clear hierarchy between story-level summary and source-level cards
- neutral colors and minimal clutter

## Data model
Use a structure similar to:
```ts
type Story = {
  id: string;
  topic: string;
  eventDate: string;
  neutralSummary: string;
  sharedThemes: string[];
  keyDifferences: string[];
  sources: {
    outlet: string;
    url: string;
    headline: string;
    summary: string;
    framingTags: string[];
    toneNotes: string[];
    notableQuote?: string;
    omissions?: string[];
  }[];
};
```

## Seed data
Create 5 example stories with 3 sources each.
Keep the content realistic, but clearly marked as demo/mock data if needed.

## File expectations
Generate a clean, minimal structure such as:
- `app/page.tsx`
- `app/story/[id]/page.tsx`
- `data/stories.ts`
- `components/story-card.tsx`
- `components/comparison-summary.tsx`
- `components/header.tsx`

## Also include
1. a short README section for local setup
2. commands to run locally
3. a short explanation of what each file does
4. 3 ways the app could break
5. key edge cases
6. a lightweight manual test plan

## Quality bar
- code should be readable and modular
- no overengineering
- no unused abstractions
- prioritize clarity and shipping speed

Now generate the full codebase for version 1.
