# Design Improvement — Budget Variance Explainer

**Date:** 2026-04-03  
**Scope:** Visual/UI (primary), Information Architecture (primary), Code structure (minor)  
**Context:** Portfolio piece. Target aesthetic: clean/corporate (Bloomberg-ish — dark sidebar, white cards, professional blue/grey tones). No external component libraries; Streamlit only.

---

## 1. Visual Theme

### CSS Layer

A single CSS string is stored in `app/styles.css` and injected once in `main.py`. Injection placement: **immediately after `st.set_page_config` and before the `with st.sidebar:` block**, so sidebar styles apply even in the pre-data empty state.

```python
st.set_page_config(page_title="Budget Variance Explainer", layout="wide")

css = (Path(__file__).parent / "styles.css").read_text()
st.markdown(f"<style>{css}</style>", unsafe_allow_html=True)

with st.sidebar:
    ...
```

### Color Palette

| Token | Value | Usage |
|---|---|---|
| `--bg-sidebar` | `#0d1117` | Sidebar background |
| `--bg-main` | `#f4f6f9` | Main area background |
| `--bg-card` | `#ffffff` | Content card background |
| `--bg-filter` | `#f0f2f5` | Inline filter bar background |
| `--accent` | `#1a6fa3` | Steel blue — links, active elements, subheader accents, logo |
| `--text-primary` | `#111827` | Main body text, KPI values |
| `--text-muted` | `#6b7280` | Labels, secondary text |
| `--text-sidebar` | `#ffffff` | Sidebar text |
| `--border` | `#e5e7eb` | Card borders, grid lines |
| `--sidebar-border` | `#1e293b` | Sidebar right border, logo section bottom border |
| `--red` | `#d62728` | Adverse variance |
| `--green` | `#2ca02c` | Favorable variance |

### Sidebar

- Background: `var(--bg-sidebar)` (`#0d1117`)
- Text: `var(--text-sidebar)` (`#ffffff`)
- Right border: `1px solid var(--sidebar-border)` (`#1e293b`)
- Logo block at top has `border-bottom: 1px solid var(--sidebar-border)` and `padding-bottom: 1rem` to visually separate it from the Settings section — this is a CSS rule on the logo container, **not** `st.divider()`

### Main Area

- Background: `var(--bg-main)` (`#f4f6f9`)
- Content sections styled as white cards: `background: var(--bg-card)`, `border-radius: 8px`, `box-shadow: 0 1px 3px rgba(0,0,0,0.08)`, `padding: 1.25rem 1.5rem`

### Typography

- Font stack: `-apple-system, "Segoe UI", Arial, sans-serif`
- Line height: `1.5`
- Section subheaders: `color: var(--accent)` with `border-bottom: 2px solid var(--accent)`, `padding-bottom: 0.3rem`

### KPI Cards

All four KPI cards (Total Budget, Total Actual, Net Variance $, Net Variance %) use the **same HTML div structure**. The existing `st.metric` calls for budget/actual are replaced. The existing inline HTML for variance KPIs is replaced with this canonical template:

```html
<div class="kpi-card kpi-{modifier}">
  <p class="kpi-label">{LABEL}</p>
  <p class="kpi-value" style="color: {value_color};">{VALUE}</p>
  <p class="kpi-sub" style="color: {sub_color};">{SUBLABEL}</p>
</div>
```

CSS for `.kpi-card`:
- `background: var(--bg-card)`
- `border-radius: 8px`
- `padding: 1rem`
- `.kpi-label`: `font-size: 0.75rem`, `text-transform: uppercase`, `letter-spacing: 0.05em`, `color: var(--text-muted)`
- `.kpi-value`: `font-size: 1.75rem`, `font-weight: 700` — note: the existing code uses `1.6rem` for variance cards; this spec standardises all four at `1.75rem`
- `.kpi-sub`: `font-size: 0.8rem`

The `modifier` class controls the `border-top: 3px solid` color:
- `.kpi-neutral` → `border-top-color: var(--accent)` (`#1a6fa3`) — used for Total Budget and Total Actual cards
- `.kpi-adverse` → `border-top-color: var(--red)` (`#d62728`) — used for Net Variance cards when over budget
- `.kpi-favorable` → `border-top-color: var(--green)` (`#2ca02c`) — used for Net Variance cards when under budget

### Dividers

All `st.divider()` calls removed. Visual separation achieved by card margins (`margin-bottom: 1.5rem`). The sidebar logo section uses a CSS `border-bottom` instead of `st.divider()` (see Sidebar above).

### Plotly Chart Theme

A private `_apply_chart_theme(fig: go.Figure) -> go.Figure` function in `charts.py`. The function **mutates `fig` in-place via `fig.update_layout(...)` and then returns `fig`** — consistent with the existing pattern in all three chart functions. It sets only shared properties; individual chart functions may still call `update_layout` for chart-specific settings (margins, `showlegend`, etc.) either before or after calling `_apply_chart_theme`.

Properties set by `_apply_chart_theme`:
```python
fig.update_layout(
    plot_bgcolor="#ffffff",
    paper_bgcolor="#ffffff",
    font=dict(family='-apple-system, "Segoe UI", Arial, sans-serif', color="#111827"),
    title=dict(font=dict(size=14, color="#111827")),
    xaxis=dict(gridcolor="#e5e7eb", zerolinecolor="#9ca3af", zerolinewidth=1),
    yaxis=dict(gridcolor="#e5e7eb", zerolinecolor="#9ca3af", zerolinewidth=1),
)
return fig
```

---

## 2. Information Architecture

### Sidebar (settings only)

```
[Logo + Name treatment]   ← replaces st.header("Settings")
──────────────────────────  ← CSS border-bottom on logo container, not st.divider()
Settings                  ← st.subheader("Settings") or st.markdown
  Data source: [radio]
  [File uploader — conditional]
──────────────────────────  ← st.divider() KEPT here (within settings, not a page section divider)
  Commentary mode: [selectbox]
  [API key field — conditional]
```

Note: `st.header("Settings")` at the top of the existing sidebar block is **replaced** by the logo HTML. The "Settings" label becomes `st.markdown("**Settings**")` or `st.subheader("Settings")` below the logo separator.

The single `st.divider()` between data source and commentary mode sections **within the sidebar** is kept — the "remove dividers" rule applies to the main page only.

### Main Area — Pre-data State

Centered layout using `st.columns([1, 2, 1])` with all content rendered inside the middle column. Content:
- Logo mark (large, ~48px, same SVG as sidebar but larger)
- `st.title("Budget Variance Explainer")` — note: the loaded state uses "Budget Variance Analysis"; the empty state uses the full product name
- Italic tagline: `st.markdown("*Where is the business over or under plan — and what should we do about it?*")`
- `st.info(...)` block with upload instructions and required column names

### Main Area — Loaded State

Sections in order:

1. **Header strip**
   - `st.title("Budget Variance Analysis")`
   - `st.markdown("*Where is the business over or under plan — and what should we do about it?*")`
   - No divider below

2. **KPI Row**
   - `st.columns(4)`: Total Budget | Total Actual | Net Variance ($) | Net Variance (%)
   - All four rendered as styled HTML divs using the canonical KPI card template (Section 1)

3. **Inline Filter Bar**
   - Implementation technique: inject a sentinel `<div>` with a known `id` via `st.markdown`, then use a CSS adjacent-sibling selector to style the Streamlit block that follows it:
     ```python
     st.markdown('<div id="filter-bar-sentinel"></div>', unsafe_allow_html=True)
     ```
     ```css
     /* styles.css */
     div#filter-bar-sentinel + div[data-testid="stVerticalBlock"] {
         background: var(--bg-filter);
         border-radius: 8px;
         padding: 0.75rem 1rem;
     }
     ```
   - After the sentinel, render `st.markdown("**Filters**")` (small muted label) followed by `st.columns(2)` containing the two multiselects. These all fall inside the targeted `stVerticalBlock` and inherit the styled background.
   - Label: small muted text "Filters" above the two columns
   - Left column: Department multiselect
   - Right column: Month multiselect
   - **Single-month behavior preserved**: if only one month exists in the data, the month multiselect is suppressed and `selected_months = all_months` as in the existing code

4. **Variance Overview**
   - `st.subheader("Variance Overview")`
   - Existing three tabs: By Department | By Month | By Category
   - Charts restyled via `_apply_chart_theme()`

5. **Top Variance Drivers**
   - `st.subheader("Top Variance Drivers")`
   - Chart above
   - Adverse / Favorable tables below in two columns
   - "Restyled dataframes": the tables inherit the card white background via CSS. No column coloring or row highlighting is added — the only change is background color consistency with the rest of the page

6. **Analysis**
   - Single `st.subheader("Analysis")`
   - Summary text (rule-based or AI)
   - `#### Recommended Actions` heading (markdown h4, not a second `st.subheader`)
   - Bulleted action list

### What Changes

| Before | After |
|---|---|
| Filters in sidebar, below settings | Filters inline between KPIs and charts |
| `st.divider()` on main page | Removed from main page; card spacing provides separation |
| `st.divider()` in sidebar | Kept within sidebar settings sections |
| Two separate subheaders for Analysis + Actions | One subheader, Actions as inner `####` heading |
| Plain `st.info` empty state | Styled centered empty state with logo, `st.columns([1,2,1])` |
| `st.metric` for budget/actual KPIs, inline HTML for variance KPIs | Consistent styled HTML for all 4 KPIs at `1.75rem` |
| `st.header("Settings")` at sidebar top | Replaced by logo treatment; "Settings" label below logo separator |

---

## 3. Logo / Name Treatment

### Visual Structure

Horizontal layout: SVG bars on the left, two-line text block on the right. Implemented with `display: flex; align-items: center; gap: 10px`.

### SVG Specification (sidebar size, ~24px tall)

```
viewBox: "0 0 24 24"
Three vertical bars, bottom-aligned, all width 5px, color #1a6fa3:
  Bar 1 (left):   x=0,  height=14px (58%), y=10
  Bar 2 (center): x=9,  height=24px (100%), y=0
  Bar 3 (right):  x=18, height=18px (75%), y=6
Gap between bars: 4px (achieved by x positions: 0, 9, 18)
```

### Text Block

- Line 1: `Budget Variance` — `color: #ffffff`, `font-size: 1rem`, `font-weight: 700`
- Line 2: `Explainer` — `color: #1a6fa3`, `font-size: 0.85rem`, `font-weight: 400`

### Pre-data Empty State (large version)

Same SVG scaled to 48px tall. Explicit coordinates (all sidebar values ×2):

```
viewBox: "0 0 48 48"
Three vertical bars, bottom-aligned, all width 10px, color #1a6fa3:
  Bar 1 (left):   x=0,  height=28px, y=20
  Bar 2 (center): x=18, height=48px, y=0
  Bar 3 (right):  x=36, height=36px, y=12
Gap between bars: 8px (x positions: 0, 18, 36)
```

Centered above the title using `st.markdown` with `text-align: center` on the SVG wrapper.

---

## 4. Code Structure Changes

| Change | File | Detail |
|---|---|---|
| New CSS file | `app/styles.css` | Full CSS string; loaded and injected once in `main.py` immediately after `st.set_page_config` |
| Shared chart theme | `app/charts.py` | Private `_apply_chart_theme(fig) -> go.Figure`; mutates in-place, returns fig; called at end of all three chart functions |
| Filter bar moved | `app/main.py` | Filters extracted from sidebar into `# --- Inline filters ---` section in main body |
| Logo injected | `app/main.py` | Sidebar logo block at top of `with st.sidebar:`, replacing `st.header("Settings")` |
| KPI cards unified | `app/main.py` | All four KPIs use the canonical HTML div template; `st.metric` calls removed |

No new modules. No changes to `calculations.py`, `validation.py`, or `commentary.py`.

---

## 5. Out of Scope

- Multi-file comparison
- PDF export
- Authentication
- Deployment configuration
- Any changes to data processing logic
- Column coloring or row highlighting in variance driver tables
