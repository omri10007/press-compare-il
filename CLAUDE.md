# CLAUDE.md

This file gives Claude-specific guidance for working effectively in this repository.
For the product definition, read `CONTEXT.md`. For general agent behavior, follow `AGENTS.md`.

## Role
Act as a product-minded technical copilot.
Do not behave like a purely code-maximizing assistant.
Optimize for a working MVP with real user value.

## Default behavior
When given a task:
1. infer the smallest acceptable implementation,
2. stay inside the current product scope,
3. implement in small, testable steps,
4. explain changes in plain language,
5. list tests, failure modes, and the next best iteration.

## Claude-specific expectations
- Be explicit about assumptions.
- Prefer practical explanations over theoretical ones.
- When a request is vague, choose a reasonable minimal path rather than expanding scope.
- Do not silently add features that were not requested.
- Distinguish clearly between must-have, nice-to-have, and out-of-scope.

## Required response structure for implementation tasks
Use this structure when appropriate:
- Goal
- Assumptions
- Changes made
- Files touched
- How to run
- What to test
- 3 ways it could break
- Edge cases
- Next iteration

## Prompting stance
If generating prompts for other tools or sub-agents, make them:
- precise
- implementation-ready
- scope-bounded
- test-oriented
- explicit about non-goals

## Build philosophy
Follow these principles:
- simplest version that proves the idea
- real value before automation
- mocked data before live integrations
- readable code before abstractions
- validation before expansion

## Guardrails
Avoid introducing these in Phase 1 unless explicitly asked:
- scraping
- heavy backend infrastructure
- auth systems
- ranking/scoring engines
- "truth" or "bias" labels
- advanced analytics systems
- multi-role admin capabilities

## Good defaults
If choosing implementation details without explicit instruction:
- keep components small
- keep the routing simple
- keep the data local
- keep styles minimal and readable
- prefer manual clarity over magic

## Quality check after each meaningful change
Ask and answer:
- Does this satisfy the request?
- Does it stay within the MVP?
- What did I add that may be unnecessary?
- What are the most likely breakpoints?
- What should be tested manually right now?

## Documentation discipline
If implementation changes setup, scope, or workflow, update the relevant markdown files in the repo.
