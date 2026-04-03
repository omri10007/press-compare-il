# Design Improvement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Budget Variance Explainer Streamlit app with a clean/corporate visual theme, a unified CSS layer, an inline filter bar, and a consistent KPI card layout.

**Architecture:** A new `app/styles.css` file holds all CSS tokens and rules, injected once into Streamlit at startup. Chart theming is centralised in a private `_apply_chart_theme` helper in `charts.py`. All layout and structure changes are in `main.py` only — no data-processing files are touched.

**Tech Stack:** Python 3.11+, Streamlit ≥1.32, Plotly ≥5.20, pytest ≥8.0

**Spec:** `docs/superpowers/specs/2026-04-03-design-improvement.md`

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Create | `app/styles.css` | All CSS custom properties and rules |
| Modify | `app/charts.py` | Add `_apply_chart_theme`; call it in all three chart functions |
| Modify | `app/main.py` | CSS injection, sidebar logo, pre-data state, KPI cards, inline filters, section cleanup |
| Create | `tests/test_charts.py` | Unit tests for `_apply_chart_theme` |

`calculations.py`, `validation.py`, `commentary.py` — **do not touch**.

---

## Task 1: Create `app/styles.css`

**Files:**
- Create: `app/styles.css`

- [ ] **Step 1: Create the CSS file with all custom properties and rules**

Write `app/styles.css` with the following content exactly:

```css
/* ── Custom properties ─────────────────────────────────────────────────── */
:root {
    --bg-sidebar:     #0d1117;
    --bg-main:        #f4f6f9;
    --bg-card:        #ffffff;
    --bg-filter:      #f0f2f5;
    --accent:         #1a6fa3;
    --text-primary:   #111827;
    --text-muted:     #6b7280;
    --text-sidebar:   #ffffff;
    --border:         #e5e7eb;
    --sidebar-border: #1e293b;
    --red:            #d62728;
    --green:          #2ca02c;
}

/* ── Global typography ─────────────────────────────────────────────────── */
html, body, [class*="css"] {
    font-family: -apple-system, "Segoe UI", Arial, sans-serif !important;
    line-height: 1.5;
}

/* ── Main area background ──────────────────────────────────────────────── */
.stApp {
    background-color: var(--bg-main);
}

/* ── Sidebar ───────────────────────────────────────────────────────────── */
[data-testid="stSidebar"] {
    background-color: var(--bg-sidebar) !important;
    border-right: 1px solid var(--sidebar-border);
}

[data-testid="stSidebar"] * {
    color: var(--text-sidebar) !important;
}

/* Logo block separator */
.logo-block {
    border-bottom: 1px solid var(--sidebar-border);
    padding-bottom: 1rem;
    margin-bottom: 1rem;
}

/* ── Section subheaders ────────────────────────────────────────────────── */
h2 {
    color: var(--accent) !important;
    border-bottom: 2px solid var(--accent);
    padding-bottom: 0.3rem;
}

/* ── KPI cards ─────────────────────────────────────────────────────────── */
.kpi-card {
    background: var(--bg-card);
    border-radius: 8px;
    padding: 1rem;
    border-top: 3px solid var(--accent);
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    margin-bottom: 0.5rem;
}
.kpi-neutral { border-top-color: var(--accent); }
.kpi-adverse { border-top-color: var(--red); }
.kpi-favorable { border-top-color: var(--green); }

.kpi-label {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-muted) !important;
    margin-bottom: 0.25rem;
}
.kpi-value {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
}
.kpi-sub {
    font-size: 0.8rem;
    margin: 0;
}

/* ── Inline filter bar ─────────────────────────────────────────────────── */
div#filter-bar-sentinel + div[data-testid="stVerticalBlock"] {
    background: var(--bg-filter);
    border-radius: 8px;
    padding: 0.75rem 1rem;
    margin-bottom: 1.5rem;
}

/* ── Content card spacing ──────────────────────────────────────────────── */
[data-testid="stVerticalBlock"] > [data-testid="stVerticalBlock"] {
    margin-bottom: 1.5rem;
}

/* ── Pre-data logo centering ───────────────────────────────────────────── */
.logo-center {
    text-align: center;
    margin-bottom: 0.5rem;
}
```

- [ ] **Step 2: Verify the file was created**

```bash
ls app/styles.css
```

Expected: file exists with no errors.

- [ ] **Step 3: Commit**

```bash
git add app/styles.css
git commit -m "feat: add styles.css with corporate theme tokens and rules"
```

---

## Task 2: Inject CSS into `main.py`

**Files:**
- Modify: `app/main.py:1-18` (top of file, after `st.set_page_config`)

- [ ] **Step 1: Add CSS injection immediately after `st.set_page_config`**

The injection must go **immediately after `st.set_page_config` and before the `with st.sidebar:` block** (which starts at line 25). This placement ensures the sidebar dark theme applies even during the pre-data empty state — if placed after the sidebar block, the sidebar styles would not render correctly on first load.

In `app/main.py`, the current top of the file is:

```python
from pathlib import Path

import pandas as pd
import streamlit as st
# ... other imports ...

st.set_page_config(page_title="Budget Variance Explainer", layout="wide")

SAMPLE_DATA_PATH = Path(__file__).parent.parent / "data" / "sample" / "budget_vs_actual.csv"

with st.sidebar:
    ...
```

Change it to (the `with st.sidebar:` block is unchanged — only the CSS block is inserted between `set_page_config` and the sidebar):

```python
from pathlib import Path

import pandas as pd
import streamlit as st
# ... other imports (unchanged) ...

st.set_page_config(page_title="Budget Variance Explainer", layout="wide")

# ---------------------------------------------------------------------------
# CSS injection — must come immediately after set_page_config, before sidebar
# ---------------------------------------------------------------------------
css = (Path(__file__).parent / "styles.css").read_text()
st.markdown(f"<style>{css}</style>", unsafe_allow_html=True)

SAMPLE_DATA_PATH = Path(__file__).parent.parent / "data" / "sample" / "budget_vs_actual.csv"

with st.sidebar:
    ...
```

- [ ] **Step 2: Run the app to verify it loads without errors**

```bash
streamlit run app/main.py
```

Expected: app opens, no Python exceptions in the terminal.

- [ ] **Step 3: Commit**

```bash
git add app/main.py
git commit -m "feat: inject styles.css at app startup"
```

---

## Task 3: Add `_apply_chart_theme` to `charts.py` (TDD)

**Files:**
- Modify: `app/charts.py`
- Create: `tests/test_charts.py`

- [ ] **Step 1: Write failing tests**

Create `tests/test_charts.py`:

```python
import plotly.graph_objects as go

from app.charts import _apply_chart_theme


def test_apply_chart_theme_returns_same_figure():
    """Function must return the same figure object (mutates in-place)."""
    fig = go.Figure()
    result = _apply_chart_theme(fig)
    assert result is fig


def test_apply_chart_theme_sets_backgrounds():
    fig = go.Figure()
    _apply_chart_theme(fig)
    assert fig.layout.plot_bgcolor == "#ffffff"
    assert fig.layout.paper_bgcolor == "#ffffff"


def test_apply_chart_theme_sets_grid_colors():
    fig = go.Figure()
    _apply_chart_theme(fig)
    assert fig.layout.xaxis.gridcolor == "#e5e7eb"
    assert fig.layout.yaxis.gridcolor == "#e5e7eb"


def test_apply_chart_theme_sets_zeroline():
    fig = go.Figure()
    _apply_chart_theme(fig)
    assert fig.layout.xaxis.zerolinecolor == "#9ca3af"
    assert fig.layout.xaxis.zerolinewidth == 1
    assert fig.layout.yaxis.zerolinecolor == "#9ca3af"
    assert fig.layout.yaxis.zerolinewidth == 1


def test_apply_chart_theme_sets_font():
    fig = go.Figure()
    _apply_chart_theme(fig)
    assert "#111827" in fig.layout.font.color
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
pytest tests/test_charts.py -v
```

Expected: `ImportError` — `_apply_chart_theme` does not exist yet.

- [ ] **Step 3: Implement `_apply_chart_theme` in `charts.py`**

Add this function near the top of `app/charts.py`, after the existing helper functions (`_fmt_dollars`, `_dollar_tickformat`):

```python
def _apply_chart_theme(fig: go.Figure) -> go.Figure:
    """Apply shared corporate theme to any Plotly figure. Mutates in-place and returns fig."""
    fig.update_layout(
        plot_bgcolor="#ffffff",
        paper_bgcolor="#ffffff",
        font=dict(
            family='-apple-system, "Segoe UI", Arial, sans-serif',
            color="#111827",
        ),
        title=dict(font=dict(size=14, color="#111827")),
        xaxis=dict(gridcolor="#e5e7eb", zerolinecolor="#9ca3af", zerolinewidth=1),
        yaxis=dict(gridcolor="#e5e7eb", zerolinecolor="#9ca3af", zerolinewidth=1),
    )
    return fig
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
pytest tests/test_charts.py -v
```

Expected: all 5 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add app/charts.py tests/test_charts.py
git commit -m "feat: add _apply_chart_theme helper with tests"
```

---

## Task 4: Apply chart theme to all three chart functions

**Files:**
- Modify: `app/charts.py`

Each chart function currently ends with `return fig`. Add a call to `_apply_chart_theme(fig)` at the end of each function, just before `return fig`. The chart-specific `update_layout` calls already present in each function are left in place — `_apply_chart_theme` only sets shared properties.

- [ ] **Step 1: Update `variance_by_department_chart`**

In `app/charts.py`, find the end of `variance_by_department_chart` (currently `return fig` at approximately line 82). Change it from:

```python
    return fig
```

to:

```python
    return _apply_chart_theme(fig)
```

- [ ] **Step 2: Update `variance_trend_chart`**

Same change at the end of `variance_trend_chart` (approximately line 178):

```python
    return _apply_chart_theme(fig)
```

- [ ] **Step 3: Update `top_drivers_chart`**

Same change at the end of `top_drivers_chart` (approximately line 268):

```python
    return _apply_chart_theme(fig)
```

- [ ] **Step 4: Run existing tests to confirm nothing broke**

```bash
pytest tests/ -v
```

Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add app/charts.py
git commit -m "feat: apply corporate theme to all chart functions"
```

---

## Task 5: Sidebar — logo treatment and settings restructure

**Files:**
- Modify: `app/main.py` (sidebar block, approximately lines 25-44)

The current sidebar block starts with:

```python
with st.sidebar:
    st.header("Settings")
    data_source = st.radio(...)
    ...
    st.divider()
    commentary_mode = st.selectbox(...)
    ...
```

- [ ] **Step 1: Replace `st.header("Settings")` with logo HTML**

Replace the `st.header("Settings")` line with the logo HTML block:

```python
with st.sidebar:
    # --- Logo ---
    st.markdown(
        """
        <div class="logo-block" style="display:flex;align-items:center;gap:10px;padding-top:0.5rem;">
            <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                <rect x="0"  y="10" width="5" height="14" fill="#1a6fa3"/>
                <rect x="9"  y="0"  width="5" height="24" fill="#1a6fa3"/>
                <rect x="18" y="6"  width="5" height="18" fill="#1a6fa3"/>
            </svg>
            <div>
                <div style="color:#ffffff;font-size:1rem;font-weight:700;line-height:1.2;">Budget Variance</div>
                <div style="color:#1a6fa3;font-size:0.85rem;font-weight:400;">Explainer</div>
            </div>
        </div>
        """,
        unsafe_allow_html=True,
    )

    st.markdown("**Settings**")
    data_source = st.radio(...)
    ...
```

Keep everything else in the sidebar block unchanged. Specifically, the `st.divider()` at approximately **line 34** (between the file uploader conditional and the `commentary_mode` selectbox) is **kept** — this is the settings-section divider and is not affected by the "remove main-page dividers" rule in Task 9.

Note: a separate second `with st.sidebar:` block exists at approximately **lines 89-113** (the Filters block). That block also starts with `st.divider()`. That *entire block* will be deleted in Task 8 — it is a different divider from the one being kept here.

- [ ] **Step 2: Run the app and visually verify the sidebar**

```bash
streamlit run app/main.py
```

Expected: dark sidebar with bar-chart logo + "Budget Variance / Explainer" text at top, "Settings" label below, rest of sidebar unchanged.

- [ ] **Step 3: Commit**

```bash
git add app/main.py
git commit -m "feat: add logo treatment to sidebar"
```

---

## Task 6: Pre-data empty state — centered layout with large logo

**Files:**
- Modify: `app/main.py` (pre-data state block, approximately lines 58-67)

The current pre-data block is:

```python
if raw_df is None:
    st.title("Budget Variance Explainer")
    st.markdown("*Where is...*")
    st.info("Upload a CSV file or select **Use Sample Data** ...")
    st.stop()
```

- [ ] **Step 1: Replace pre-data block with centered layout**

```python
if raw_df is None:
    _, col_center, _ = st.columns([1, 2, 1])
    with col_center:
        st.markdown(
            """
            <div class="logo-center">
                <svg viewBox="0 0 48 48" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0"  y="20" width="10" height="28" fill="#1a6fa3"/>
                    <rect x="18" y="0"  width="10" height="48" fill="#1a6fa3"/>
                    <rect x="36" y="12" width="10" height="36" fill="#1a6fa3"/>
                </svg>
            </div>
            """,
            unsafe_allow_html=True,
        )
        st.title("Budget Variance Explainer")
        st.markdown(
            "*Where is the business over or under plan — and what should we do about it?*"
        )
        st.info(
            "Upload a CSV file or select **Use Sample Data** in the sidebar to get started.\n\n"
            "Your file must contain the columns: **month, department, category, budget, actual**."
        )
    st.stop()
```

- [ ] **Step 2: Run the app without data and visually verify**

```bash
streamlit run app/main.py
```

Expected: centered large logo above the title and info box on the empty state. Use Sample Data not selected.

- [ ] **Step 3: Commit**

```bash
git add app/main.py
git commit -m "feat: redesign pre-data empty state with centered logo"
```

---

## Task 7: Unify KPI cards

**Files:**
- Modify: `app/main.py` (KPI section, approximately lines 140-178)

The current KPI section mixes `st.metric` (for budget/actual) with raw HTML divs (for variance). All four become the canonical `kpi-card` HTML template.

- [ ] **Step 1: Replace the entire KPI block**

Find the section between `# --- KPI cards ---` and `st.divider()` (approximately lines 139-180). Replace it with:

```python
# --- KPI cards ---------------------------------------------------------------
total_budget = df["budget"].sum()
total_actual = df["actual"].sum()
net_variance = df["variance"].sum()
net_variance_pct = net_variance / total_budget if total_budget != 0 else 0.0

variance_modifier = "kpi-adverse" if net_variance > 0 else "kpi-favorable"
variance_label = "Over budget" if net_variance > 0 else "Under budget"
variance_color = "#d62728" if net_variance > 0 else "#2ca02c"

col1, col2, col3, col4 = st.columns(4)

col1.markdown(
    f"""
    <div class="kpi-card kpi-neutral">
        <p class="kpi-label">Total Budget</p>
        <p class="kpi-value">${total_budget:,.0f}</p>
        <p class="kpi-sub">&nbsp;</p>
    </div>
    """,
    unsafe_allow_html=True,
)

col2.markdown(
    f"""
    <div class="kpi-card kpi-neutral">
        <p class="kpi-label">Total Actual</p>
        <p class="kpi-value">${total_actual:,.0f}</p>
        <p class="kpi-sub">&nbsp;</p>
    </div>
    """,
    unsafe_allow_html=True,
)

col3.markdown(
    f"""
    <div class="kpi-card {variance_modifier}">
        <p class="kpi-label">Net Variance ($)</p>
        <p class="kpi-value" style="color:{variance_color};">${net_variance:+,.0f}</p>
        <p class="kpi-sub" style="color:{variance_color};">{variance_label}</p>
    </div>
    """,
    unsafe_allow_html=True,
)

col4.markdown(
    f"""
    <div class="kpi-card {variance_modifier}">
        <p class="kpi-label">Net Variance (%)</p>
        <p class="kpi-value" style="color:{variance_color};">{net_variance_pct:+.1%}</p>
        <p class="kpi-sub" style="color:{variance_color};">{variance_label}</p>
    </div>
    """,
    unsafe_allow_html=True,
)
```

Remove the `st.divider()` that followed the old KPI block.

- [ ] **Step 2: Run the app with sample data and verify KPI row**

```bash
streamlit run app/main.py
```

Expected: four styled KPI cards in a row — Budget and Actual with blue top border, variance cards with red or green top border and colored values.

- [ ] **Step 3: Commit**

```bash
git add app/main.py
git commit -m "feat: unify all KPI cards to consistent HTML template"
```

---

## Task 8: Move filters inline and remove sidebar filters

**Files:**
- Modify: `app/main.py` (sidebar filters ~lines 89-114, and add inline filter block after KPI row)

Currently, filters are appended to the sidebar in a second `with st.sidebar:` block. They move to the main body.

- [ ] **Step 1: Remove filters from the sidebar**

Find and delete the second `with st.sidebar:` block (approximately lines 89-113):

```python
# DELETE this entire block:
with st.sidebar:
    st.divider()
    st.subheader("Filters")

    all_departments = sorted(df["department"].unique().tolist())
    selected_departments = st.multiselect(
        "Departments",
        options=all_departments,
        default=all_departments,
    )

    all_months = sorted(df["month"].unique().tolist())
    if len(all_months) > 1:
        selected_months = st.multiselect(
            "Months",
            options=all_months,
            default=all_months,
        )
    else:
        selected_months = all_months
```

- [ ] **Step 2: Add inline filter bar after the KPI row**

Immediately after the KPI row block (after `col4.markdown(...)`), add:

```python
# --- Inline filters ----------------------------------------------------------
# The sentinel div is the CSS hook. The adjacent-sibling selector in styles.css
# targets the stVerticalBlock that immediately follows it — which is the
# st.container() below. All filter widgets must be inside that container.
st.markdown('<div id="filter-bar-sentinel"></div>', unsafe_allow_html=True)

all_departments = sorted(df["department"].unique().tolist())
all_months = sorted(df["month"].unique().tolist())

with st.container():
    st.markdown(
        "<p style='font-size:0.8rem;color:#6b7280;margin-bottom:0.25rem;'><b>Filters</b></p>",
        unsafe_allow_html=True,
    )

    filter_col1, filter_col2 = st.columns(2)

    with filter_col1:
        selected_departments = st.multiselect(
            "Departments",
            options=all_departments,
            default=all_departments,
        )

    with filter_col2:
        if len(all_months) > 1:
            selected_months = st.multiselect(
                "Months",
                options=all_months,
                default=all_months,
            )
        else:
            selected_months = all_months
```

The `with st.container():` is critical — it causes Streamlit to render the label and both multiselects as a single `stVerticalBlock`, which is what the CSS adjacent-sibling selector targets. Without it, the sentinel selector would only style the label element and the multiselects would have no background.

- [ ] **Step 3: Run the app and verify filters appear inline**

```bash
streamlit run app/main.py
```

Expected: filter multiselects appear between KPI cards and charts; sidebar no longer has a Filters section. Filtering still works correctly (select/deselect departments and months and confirm charts update).

- [ ] **Step 4: Commit**

```bash
git add app/main.py
git commit -m "feat: move filters inline between KPIs and charts"
```

---

## Task 9: Page cleanup — remove main-page dividers and merge Analysis section

**Files:**
- Modify: `app/main.py` (section dividers and Analysis/Recommended Actions sections)

- [ ] **Step 1: Remove remaining `st.divider()` calls from the main page**

The original `main.py` had five `st.divider()` calls on the main page. Task 7 already removed one (after the KPI block, ~line 180). The remaining ones to delete are at approximately:

- **Line 137** — after the header strip, before KPI cards (may already be gone if Task 7 restructured that block fully; verify and delete if present)
- **Line 201** — after Variance Overview, before Top Variance Drivers
- **Line 247** — after Top Variance Drivers, before Analysis
- **Line 260** — between `st.markdown(summary)` and `st.subheader("Recommended Actions")` (this one is removed as part of the Analysis merge in Step 2 below)

Leave the `st.divider()` at approximately **line 34** inside the `with st.sidebar:` block untouched — that is the settings-section divider.

- [ ] **Step 2: Merge Analysis and Recommended Actions into one section**

Find the current Analysis/Recommended Actions block (approximately lines 249-264). The complete current code is:

```python
# --- Analysis ----------------------------------------------------------------
st.subheader("Analysis")

if commentary_mode in ("AI (Claude)", "Both") and not api_key:
    st.info(
        "No API key provided — showing rule-based commentary. "
        "Add an Anthropic API key in the sidebar to enable AI analysis."
    )

st.markdown(summary)

st.divider()

# --- Recommended actions -----------------------------------------------------
st.subheader("Recommended Actions")
st.markdown(actions_markdown)
```

Replace the entire block with:

```python
# --- Analysis & Recommended Actions ------------------------------------------
st.subheader("Analysis")

if commentary_mode in ("AI (Claude)", "Both") and not api_key:
    st.info(
        "No API key provided — showing rule-based commentary. "
        "Add an Anthropic API key in the sidebar to enable AI analysis."
    )

st.markdown(summary)

st.markdown("#### Recommended Actions")
st.markdown(actions_markdown)
```

- [ ] **Step 3: Run the full app end-to-end with sample data**

```bash
streamlit run app/main.py
```

Verify:
- No horizontal rule dividers on the main page
- Analysis and Recommended Actions flow as one section
- All charts, tables, and commentary still render correctly
- Sidebar still has its internal divider

- [ ] **Step 4: Run all tests**

```bash
pytest tests/ -v
```

Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add app/main.py
git commit -m "feat: remove main-page dividers, merge Analysis and Recommended Actions"
```

---

## Done

At this point the full design improvement is implemented. Do a final visual review of the running app:

1. Empty state — centered logo, title, info box
2. Loaded state — dark sidebar with logo, KPI cards with colored borders, inline filter bar, charts with consistent theme, merged Analysis section
3. Sidebar — logo at top, Settings label below, data source + commentary controls, internal divider kept
