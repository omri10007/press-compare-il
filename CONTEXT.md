# CONTEXT.md

## Project Name
press-compare-il

## One-Sentence Project Summary
A lightweight web app that helps users understand a news event better by comparing how multiple sources cover the same story in one place.

## Why This Project Exists
People who read only one or two articles often get a partial picture of an event. This project aims to reduce that information gap by making it easier to:
- view multiple sources side by side
- see what facts repeat across sources
- notice what details differ
- identify missing context

## Product Philosophy
This project follows an outcome-first, MVP-first approach.

Principles:
- Solve a real user problem, not a "cool demo" problem.
- Build the smallest version that proves users get value.
- Prefer clarity and usefulness over technical complexity.
- Use AI as an executor/copilot, not as a substitute for product judgment.
- Think in steps, conditions, flows, states, inputs, and outputs.
- Validate every important assumption with real users.
- Ruthlessly cut features that do not serve the core use case.

## Who This Is For
Primary users:
- Israeli news consumers who want broader context on a news event
- Students and educated non-expert readers who want faster comparison across sources
- Users who feel that reading a single article gives an incomplete picture

## Core User Problem
When a user reads coverage of an important event, they usually:
1. see only one framing,
2. miss what other outlets emphasize,
3. do not know what information is shared vs disputed,
4. spend too much time opening multiple tabs and comparing manually.

## Desired User Outcome
After using the product, the user should be able to say:
- "I understand this event better."
- "I can quickly compare coverage across sources."
- "I can see what is common, what differs, and what may be missing."

---

## MVP Outline

### MVP Goal
Prove that users find value in a simple event-comparison experience before adding any live data, automation, or advanced analysis features.

### MVP Phase 1 Scope
Build only the smallest useful version:

1. **Homepage**
   - Shows a small set of sample events
   - Lets the user choose one event to explore

2. **Event Comparison Page**
   - Displays coverage from multiple sources for the same event
   - Makes it easy to compare them in one screen

3. **Mocked Local Dataset**
   - No live scraping
   - No API ingestion yet
   - Data comes from local JSON or similar static source

4. **Clean Comparison UI**
   - Easy to scan
   - Clearly separated source cards/sections
   - Emphasis on readability and comparison, not visual complexity

### MVP Must-Have User Flow
1. User lands on homepage
2. User selects a sample event
3. User sees multiple source summaries/headlines/snippets for that event
4. User can quickly compare common points and differences
5. User leaves with better context than from reading one source alone

### MVP Success Criteria
The MVP is successful if:
- a user can understand what the product does within seconds
- a user can compare one event across multiple sources without explanation
- testers report that the app gives them a broader picture faster
- at least some users choose to use it again
- the project can be shown as a working, shareable product

---

## Explicit Non-Goals for Phase 1
Do **not** build these yet:
- live scraping
- Tavily integration
- automatic event clustering
- journalist rankings
- truth score
- political bias score
- user accounts
- authentication
- payments
- admin dashboard
- recommendation engine
- heavy personalization
- complex analytics pipeline

If a feature does not directly improve the first comparison experience, it should probably wait.

---

## Product Requirements

### Functional Requirements
- The app must load sample events from a local dataset.
- The homepage must list available events.
- Each event must have a dedicated comparison page.
- The comparison page must show multiple sources tied to the same event.
- The UI must make source-to-source comparison easy.
- The app must run locally and be easy to deploy later.

### Non-Functional Requirements
- Fast load time with local data
- Simple architecture
- Readable codebase
- Easy to modify prompts, content, and sample data
- Easy for AI tools to inspect and extend

---

## Recommended Data Shape
Use a simple structure such as:

- `events`
  - `id`
  - `title`
  - `date`
  - `summary`
  - `sources[]`
    - `source_name`
    - `article_title`
    - `snippet`
    - `url`
    - `key_points[]`
    - `notes`

Do not over-model early. Keep the schema flexible and minimal.

---

## UX Principles
- Users should understand the page without onboarding.
- One screen should answer: "How are different sources covering this?"
- Reduce clutter.
- Prefer strong hierarchy and spacing over decorative complexity.
- Highlight comparison value, not feature count.
- Mobile support is valuable, but desktop clarity comes first for the initial MVP unless usage suggests otherwise.

---

## Engineering Principles
- Keep files modular and easy to inspect.
- Prefer a small number of understandable components.
- Use mock data first.
- Commit before major AI-generated changes.
- Add features in thin vertical slices.
- Avoid premature abstractions.
- Every major change should be testable by opening the app and completing the main user flow.

---

## AI Collaboration Rules
When using AI coding tools:
1. State the exact user problem first.
2. Describe the smallest acceptable implementation.
3. Ask for files to be kept minimal and clearly named.
4. After generation, immediately check:
   - Does it run?
   - Does it match the requested scope?
   - What did the AI add that was not requested?
   - What are 3 ways this could break?
   - What edge cases are still missing?

Useful instruction pattern:
- Goal
- Constraints
- Required files
- User flow
- Acceptance criteria
- "Do not add extra features"

---

## Validation Plan
This project should be validated with real users, not only opinions.

### Early Validation Questions
Ask testers:
- Did this help you understand the event better?
- Was comparing sources easier here than opening multiple tabs?
- What was confusing?
- What did you expect to see but did not?
- Would you use this again?

### Evidence to Collect
- direct user quotes
- observed confusion points
- repeated feature requests
- repeat usage, not just compliments
- number of active testers/users

---

## Lightweight Test Plan

### Manual Tests
- Homepage loads without errors
- Sample events are visible
- Clicking an event opens the comparison page
- Comparison page shows multiple sources correctly
- Missing data does not crash the UI
- Long headlines/snippets remain readable
- Navigation back to homepage works

### Edge Cases
- event with only one source
- event with missing snippet
- very long source name
- empty local dataset
- malformed event object
- duplicate source entries

### Failure Modes
1. The page looks good but comparison value is weak.
2. The data model becomes too complex before real usage exists.
3. The app becomes feature-heavy without proving that users care.

---

## Adoption Target
This project is not complete when the UI looks finished.
It is complete when:
- it is live or shareable,
- real users have tried it,
- usage and feedback are documented,
- at least 10 active users are reached by the course target.

---

## Definition of Done for Phase 1
Phase 1 is done when:
- the app runs locally
- the homepage exists
- the event comparison page exists
- mock local data powers the experience
- the UI is clean enough for a stranger to understand
- at least a few testers have used it
- feedback is documented
- next iteration priorities are clear

---

## Suggested Repo Structure
- `app/` or `src/` — application code
- `data/` — mocked local dataset
- `components/` — reusable UI pieces
- `pages/` or route files — homepage and event page
- `public/` — static assets
- `docs/` — notes, feedback, decisions
- `CONTEXT.md` — this file

---

## Current Priorities
1. Make the core comparison flow work
2. Make the UI understandable
3. Test with real users
4. Learn what users actually value
5. Only then decide what deserves automation or scale

## Current Rule
Whenever there is uncertainty, choose the simpler implementation that still proves the core value.
