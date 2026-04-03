# Design Improvement — Budget Variance Explainer

**Date:** 2026-04-03  
**Scope:** Visual/UI (primary), Information Architecture (primary), Code structure (minor)  
**Context:** Portfolio piece. Target aesthetic: clean/corporate (Bloomberg-ish — dark sidebar, white cards, professional blue/grey tones). No external component libraries; Streamlit only.

---

## 1. Visual Theme

### CSS Layer

A single CSS string is stored in `app/styles.css` and injected once at app startup:

```python
css = Path("app/styles.css").read_text()
st.markdown(f"<style>{css}</style>", unsafe_allow_html=True)
```

### Color Palette

| Token | Value | Usage |
|---|---|---|
| `--bg-sidebar` | `#0d1117` | Sidebar background |
| `--bg-main` | `#f4f6f9` | Main area background |
| `--bg-card` | `#ffffff` | Content card background |
| `--accent` | `#1a6fa3` | Steel blue — links, active elements, subheader accents |
| `--text-primary` | `#111827` | Main body text, KPI values |
| `--text-muted` | `#6b7280` | Labels, secondary text |
| `--border` | `#e5e7eb` | Card borders, grid lines |
| `--red` | `#d62728` | Adverse variance |
| `--green` | `#2ca02c` | Favorable variance |

### Sidebar

- Background: `#0d1117`
- Text: white
- Right border: `1px solid #1e293b`
- Logo/name treatment at top (see Section 3)

### Main Area

- Background: `#f4f6f9`
- Content sections (KPI row, filter bar, chart tabs, drivers, analysis) styled as white cards with `border-radius: 8px`, `box-shadow: 0 1px 3px rgba(0,0,0,0.08)`, `padding: 1.25rem`

### Typography

- Font stack: `-apple-system, "Segoe UI", Arial, sans-serif`
- Line height: `1.5` (tighter than Streamlit default)
- Section subheaders: `#1a6fa3` accent color with a `2px solid` bottom border

### KPI Cards

Replace current inline HTML `<div>` blocks with a consistent styled pattern:
- Label: `0.8rem`, `#6b7280`, uppercase, letter-spaced
- Value: `1.75rem`, `#111827`, `font-weight: 700`
- Variance value/label: colored `#d62728` (adverse) or `#2ca02c` (favorable)
- Card border-top: `3px solid` in the variance color (red/green) for the two variance KPIs; `3px solid #1a6fa3` for the budget and actual KPIs

### Dividers

All `st.divider()` calls removed. Visual separation achieved by card spacing (`margin-bottom: 1.5rem` between card sections).

### Plotly Chart Theme

A shared `_apply_chart_theme(fig)` function in `charts.py` applied to all three chart functions:
- `plot_bgcolor`: `#ffffff`
- `paper_bgcolor`: `#ffffff`
- Grid lines: `#e5e7eb`
- Zero-line: `#9ca3af`, width `1`
- Font family: matches app font stack
- Title font size: `14`, color `#111827`

---

## 2. Information Architecture

### Sidebar (settings only)

```
[Logo + Name]
──────────────
Settings
  Data source: [radio]
  [File uploader — conditional]
──────────────
  Commentary mode: [selectbox]
  [API key field — conditional]
```

Filters are removed from the sidebar entirely.

### Main Area — Pre-data State

Centered layout:
- Logo mark (large, ~48px)
- App name + tagline
- Styled `st.info` box with upload instructions and required column names
- No other content

### Main Area — Loaded State

Sections in order:

1. **Header strip**
   - App name (`st.title`) + subtitle (`st.markdown` italic)
   - No divider below — card spacing handles separation

2. **KPI Row**
   - `st.columns(4)`: Total Budget | Total Actual | Net Variance ($) | Net Variance (%)
   - All four as styled card divs (replacing current mix of `st.metric` and raw HTML)

3. **Inline Filter Bar**
   - A light-grey container (`background: #f0f2f5`, `border-radius: 8px`, `padding: 0.75rem 1rem`)
   - Label: "Filters" in small muted text
   - Two columns: Department multiselect | Month multiselect
   - Positioned between KPI row and charts — visually scoped to "data shown below"

4. **Variance Overview**
   - `st.subheader("Variance Overview")`
   - Existing three tabs: By Department | By Month | By Category
   - Charts restyled via `_apply_chart_theme()`

5. **Top Variance Drivers**
   - `st.subheader("Top Variance Drivers")`
   - Chart above
   - Adverse / Favorable tables below in two columns (restyled dataframes)

6. **Analysis**
   - Single `st.subheader("Analysis")`
   - Summary text (rule-based or AI)
   - `#### Recommended Actions` heading (markdown, not a second `st.subheader`)
   - Bulleted action list

### What Changes

| Before | After |
|---|---|
| Filters in sidebar, below settings | Filters inline between KPIs and charts |
| `st.divider()` throughout | Removed; card spacing provides separation |
| Two separate subheaders for Analysis + Actions | One subheader, Actions as inner heading |
| Plain `st.info` empty state | Styled centered empty state with logo |
| `st.metric` for budget/actual KPIs, raw HTML for variance KPIs | Consistent styled HTML for all 4 KPIs |

---

## 3. Logo / Name Treatment

Location: top of sidebar, above "Settings" label.

Implementation: inline SVG + styled text via `st.markdown(unsafe_allow_html=True)`.

Visual: three vertical bars (heights 60%, 100%, 75%) in `#1a6fa3` steel blue, ~24px tall. Followed by two-line text block:
- Line 1: `Budget Variance` — white, `font-size: 1rem`, `font-weight: 700`
- Line 2: `Explainer` — `#1a6fa3`, `font-size: 0.85rem`, `font-weight: 400`

Same logo mark (smaller, ~20px) appears in the pre-data empty state centered on the main area.

---

## 4. Code Structure Changes

| Change | File | Detail |
|---|---|---|
| New CSS file | `app/styles.css` | Full CSS string; loaded and injected once in `main.py` |
| Shared chart theme | `app/charts.py` | Private `_apply_chart_theme(fig) -> go.Figure` called by all three chart functions |
| Filter bar moved | `app/main.py` | Filters extracted from sidebar into a clearly commented `# --- Inline filters ---` section in the main body |
| Logo injected | `app/main.py` | Sidebar logo block injected in the `with st.sidebar:` block at top |

No new modules. No changes to `calculations.py`, `validation.py`, or `commentary.py`.

---

## 5. Out of Scope

- Multi-file comparison
- PDF export
- Authentication
- Deployment configuration
- Any changes to data processing logic
