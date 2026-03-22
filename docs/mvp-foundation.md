# Press Compare IL — MVP Foundation

## Goal
Build the smallest useful web app that helps users compare how multiple Israeli news outlets frame the same story.

## Problem statement
People can read several articles about the same event and still miss the important difference: not only what each outlet says, but what it emphasizes, downplays, or omits.

## Target user
- Hebrew-speaking students and news consumers
- People who want a faster way to compare framing across outlets
- Early testers who already read more than one source when a story matters

## Core user value
A user should be able to understand, in under 60 seconds:
1. Which outlets covered the same story
2. What each outlet emphasized
3. Where framing meaningfully differs
4. What important context appears in one source but not another

## Smallest testable MVP
The MVP does **not** need full web scraping, user accounts, or a proprietary bias score.

It only needs one clear flow:
1. User selects a story from a small list of preloaded stories or pastes a headline/topic
2. App shows 3–5 source cards for the same event
3. Each card includes:
   - outlet
   - headline
   - short summary
   - framing tags
   - notable quote or phrasing
4. App shows a neutral comparison summary:
   - what is shared
   - what differs
   - what may be omitted in some coverage

## Non-goals for v1
- No authentication
- No payments
- No saved history
- No browser extension
- No full ingestion pipeline
- No claim to objectively rate bias
- No attempt to cover every Israeli outlet from day one

## Recommended MVP shape
### Version 1A — mocked data demo
Use a static local dataset of 5–10 events.

Why this is the right first move:
- It proves the interface and user value quickly
- It creates something shareable for testing
- It avoids getting blocked by scraping and infra too early
- It matches the course requirement to build the simplest working MVP first

### Version 1B — lightweight live input
After interface validation, add one limited ingestion path:
- manual article input
- or RSS-based ingestion from a small set of sources
- or a small admin-only JSON uploader

## Suggested source set for first tests
Pick only 3–5 outlets at first. Example buckets:
- mainstream large outlet
- center/neutral-ish outlet
- right-leaning outlet
- left-leaning outlet
- public broadcaster

The exact outlet list can change later.

## Proposed product flow
### Flow 1 — choose story
- user lands on homepage
- sees short explanation and sample stories
- chooses one story to compare

### Flow 2 — comparison view
- page displays story title and event date
- source cards shown in a responsive grid
- each card includes headline, outlet, summary, framing tags, and link
- top summary section explains major differences in framing

### Flow 3 — reflection layer
- app highlights a few structured differences such as:
  - language intensity
  - focus on security / politics / civilians / economics / accountability
  - named actors emphasized
  - missing context

## Data model for mocked MVP
```ts
export type Story = {
  id: string;
  topic: string;
  eventDate: string;
  neutralSummary: string;
  sources: SourceCoverage[];
};

export type SourceCoverage = {
  outlet: string;
  url: string;
  headline: string;
  summary: string;
  framingTags: string[];
  toneNotes: string[];
  notableQuote?: string;
  omissions?: string[];
};
```

## Recommended tech direction
Keep it simple:
- Next.js app router
- TypeScript
- Tailwind CSS
- local JSON data for v1
- optional SQLite / Supabase later only if needed

## Definition of done for first shareable version
The first shareable version is done when:
- app is deployed
- one public link works
- at least 5 stories are available in the demo dataset
- each story has at least 3 sources
- users can compare framing on a single page without instructions

## What to test with first 5 users
Ask users to do one task:
> "Open one story and tell me, in your own words, how the outlets differ."

Success signals:
- they understand the interface quickly
- they can explain at least one framing difference
- they ask to try another story

Failure signals:
- they only skim headlines and miss the comparison summary
- framing tags feel vague or repetitive
- they do not trust the app's wording
- they do not understand why the app is better than opening tabs manually

## 3 ways this could break
1. The comparison language sounds too opinionated, which reduces trust
2. The source matching is weak, so articles are not actually about the same event
3. The UI is interesting, but not useful enough to justify repeat use

## Key edge cases
- two articles are about related but not identical events
- one source is an opinion piece and another is straight reporting
- one source has a paywall
- one source has very little detail
- Hebrew and English naming conventions for the same event differ
- the app overstates differences where there are only wording variations

## Lightweight test plan
### Test 1 — comprehension
- show one story comparison
- ask user to describe the main difference between two outlets

### Test 2 — navigation
- ask user to switch from one story to another without guidance

### Test 3 — trust
- ask whether the comparison summary felt neutral or manipulative

### Test 4 — usefulness
- ask whether this was faster than manually checking multiple sites

## Suggested iteration plan
### Iteration 1
Ship mocked comparison UI with 5 manually prepared stories.

### Iteration 2
Improve framing taxonomy based on user confusion.

### Iteration 3
Add limited live ingestion from one simple source path.

### Iteration 4
Track usage and identify whether users return for new stories.

## Immediate next build milestone
Create a working homepage and one comparison page backed by mocked local data. That is the fastest path to something users can actually open, understand, and react to.
