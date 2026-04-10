# AGENTS.md

This file provides instructions for AI coding agents working on this repository.
Read `README.md` for project overview and setup, and `CONTEXT.md` for product scope and MVP boundaries.

## Mission
Build and iterate on the smallest useful version of **press-compare-il**.
The goal is not technical sophistication. The goal is a working product that helps users compare news coverage of one event across multiple sources.

## Product priority
Optimize for this order:
1. working product
2. clarity of user value
3. speed of iteration
4. maintainability
5. extensibility

Do not optimize for abstract elegance if it slows shipping.

## Non-negotiable constraints
- Keep the implementation minimal.
- Respect Phase 1 scope from `CONTEXT.md`.
- Do not add advanced features unless explicitly requested.
- Use mocked local data first.
- Prefer readable, modular code over clever abstractions.
- Keep file count and dependency count low.
- Preserve rollback points with logical commits.

## Default build target
Unless the repository already uses another stack, prefer a simple web app structure that supports:
- homepage with sample events
- event comparison page
- local JSON data
- clean UI

If a stack is already present, extend it rather than replacing it.

## How to work
When asked to implement something:
1. Restate the goal in one sentence.
2. Check whether it fits the current MVP scope.
3. Choose the simplest implementation.
4. Make small, testable changes.
5. Explain what changed at a practical level.
6. List what to test manually.
7. Surface likely breakpoints and edge cases.

## Output format expectations
When generating code or making changes, always include:
- what files were added or changed
- what each file does
- how to run the app
- what to test now
- 3 ways the change could break
- missing edge cases
- recommended next iteration

## Scope control
Push back on complexity. Suggest simplifications aggressively.
Examples of things to avoid in Phase 1 unless explicitly requested:
- authentication
- dashboards
- live article ingestion
- scraping pipelines
- scoring systems
- bias labels
- personalization
- analytics over-engineering

## Validation mindset
After implementing any non-trivial change, check:
- Does this solve a a real user problem?
- Is this the simplest version that works?
- How could this break?
- What edge cases are missing?
- How will we know users got value?

## UX guidance
Default to:
- clean layout
- strong visual hierarchy
- readable spacing
- obvious navigation
- minimal text overload
- comparison-first design

Do not add decorative UI complexity unless it clearly improves comprehension.

## Data guidance
Use a simple local schema and keep it easy to edit manually.
Prefer predictable data structures over flexible but unclear ones.

## Code guidance
- Favor small components and shallow logic.
- Avoid premature abstraction.
- Add comments only where they help future maintenance.
- Prefer deterministic behavior.
- Fail gracefully on missing or malformed data.

## Testing guidance
At minimum, check:
- app loads
- homepage renders
- event page renders
- data mapping works
- empty/missing fields do not crash the UI
- long text does not destroy layout

## Documentation rule
If you change the product meaningfully, update the relevant docs:
- `README.md` for run/setup/overview
- `CONTEXT.md` for scope or product-direction changes
- this file if the preferred agent workflow changes

## Decision rule
When two options are both valid, choose the one that:
- ships faster,
- is easier to understand,
- is easier to validate with users,
- adds less complexity.
