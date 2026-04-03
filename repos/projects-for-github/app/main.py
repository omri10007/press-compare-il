from pathlib import Path

import pandas as pd
import streamlit as st

from app.calculations import add_variance_columns, aggregate_by, top_variances
from app.charts import (
    top_drivers_chart,
    variance_by_department_chart,
    variance_trend_chart,
)
from app.commentary import get_commentary
from app.validation import validate_csv

# ---------------------------------------------------------------------------
# Page config — must be the first Streamlit call
# ---------------------------------------------------------------------------
st.set_page_config(page_title="Budget Variance Explainer", layout="wide")

# ---------------------------------------------------------------------------
# CSS injection — must come immediately after set_page_config, before sidebar
# ---------------------------------------------------------------------------
css = (Path(__file__).parent / "styles.css").read_text(encoding="utf-8")
st.markdown(f"<style>{css}</style>", unsafe_allow_html=True)

SAMPLE_DATA_PATH = Path(__file__).parent.parent / "data" / "sample" / "budget_vs_actual.csv"

# ---------------------------------------------------------------------------
# Sidebar
# ---------------------------------------------------------------------------
with st.sidebar:
    st.header("Settings")

    data_source = st.radio("Data source", ["Upload CSV", "Use Sample Data"])

    uploaded_file = None
    if data_source == "Upload CSV":
        uploaded_file = st.file_uploader("Upload CSV file", type=["csv"])

    st.divider()

    commentary_mode = st.selectbox(
        "Commentary mode",
        ["Rule-based", "AI (Claude)", "Both"],
    )

    api_key = ""
    if commentary_mode in ("AI (Claude)", "Both"):
        api_key = st.text_input("Anthropic API Key", type="password")

# ---------------------------------------------------------------------------
# Load data
# ---------------------------------------------------------------------------
raw_df = None

if data_source == "Use Sample Data":
    raw_df = pd.read_csv(SAMPLE_DATA_PATH)
elif uploaded_file is not None:
    raw_df = pd.read_csv(uploaded_file)

# ---------------------------------------------------------------------------
# Pre-data state
# ---------------------------------------------------------------------------
if raw_df is None:
    st.title("Budget Variance Explainer")
    st.markdown(
        "*Where is the business over or under plan — and what should we do about it?*"
    )
    st.info(
        "Upload a CSV file or select **Use Sample Data** in the sidebar to get started.\n\n"
        "Your file must contain the columns: **month, department, category, budget, actual**."
    )
    st.stop()

# ---------------------------------------------------------------------------
# Validation
# ---------------------------------------------------------------------------
is_valid, msg = validate_csv(raw_df)

if not is_valid:
    st.error(msg)
    st.stop()

if msg:  # non-empty warning
    st.warning(msg)

# ---------------------------------------------------------------------------
# Core data processing
# ---------------------------------------------------------------------------
df = add_variance_columns(raw_df)

# ---------------------------------------------------------------------------
# Sidebar filters (shown after data loads)
# ---------------------------------------------------------------------------
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

# Apply filters
if selected_departments:
    df = df[df["department"].isin(selected_departments)]
if selected_months:
    df = df[df["month"].isin(selected_months)]

# ---------------------------------------------------------------------------
# Aggregations
# ---------------------------------------------------------------------------
dept_df = aggregate_by(df, "department")
month_df = aggregate_by(df, "month")
cat_df = aggregate_by(df, "category")
top_adverse, top_favorable = top_variances(df, n=10)

# ---------------------------------------------------------------------------
# Commentary (computed once)
# ---------------------------------------------------------------------------
summary, actions_markdown = get_commentary(
    df, top_adverse, top_favorable, commentary_mode, api_key
)

# ---------------------------------------------------------------------------
# Dashboard
# ---------------------------------------------------------------------------
st.title("Budget Variance Analysis")
st.markdown("*Where is the business over or under plan — and what should we do about it?*")

st.divider()

# --- KPI cards ---------------------------------------------------------------
total_budget = df["budget"].sum()
total_actual = df["actual"].sum()
net_variance = df["variance"].sum()
net_variance_pct = net_variance / total_budget if total_budget != 0 else 0.0

col1, col2, col3, col4 = st.columns(4)

col1.metric("Total Budget", f"${total_budget:,.0f}")
col2.metric("Total Actual", f"${total_actual:,.0f}")

# Variance direction: positive variance (over budget) = bad = red
variance_color = "red" if net_variance > 0 else "green"
variance_label = "Over budget" if net_variance > 0 else "Under budget"

col3.markdown(
    f"""
    <div style="padding: 0.5rem 0;">
        <p style="color: #555; font-size: 0.85rem; margin-bottom: 0.15rem;">Net Variance ($)</p>
        <p style="color: {variance_color}; font-size: 1.6rem; font-weight: 700; margin: 0;">
            ${net_variance:+,.0f}
        </p>
        <p style="color: {variance_color}; font-size: 0.8rem; margin: 0;">{variance_label}</p>
    </div>
    """,
    unsafe_allow_html=True,
)

col4.markdown(
    f"""
    <div style="padding: 0.5rem 0;">
        <p style="color: #555; font-size: 0.85rem; margin-bottom: 0.15rem;">Net Variance (%)</p>
        <p style="color: {variance_color}; font-size: 1.6rem; font-weight: 700; margin: 0;">
            {net_variance_pct:+.1%}
        </p>
        <p style="color: {variance_color}; font-size: 0.8rem; margin: 0;">{variance_label}</p>
    </div>
    """,
    unsafe_allow_html=True,
)

st.divider()

# --- Variance overview tabs --------------------------------------------------
st.subheader("Variance Overview")
tab_dept, tab_month, tab_cat = st.tabs(["By Department", "By Month", "By Category"])

with tab_dept:
    st.plotly_chart(variance_by_department_chart(dept_df), use_container_width=True)

with tab_month:
    st.plotly_chart(variance_trend_chart(month_df), use_container_width=True)

with tab_cat:
    # Reuse variance_by_department_chart logic — it works on any df with a
    # label column + variance columns.  Rename 'category' → 'department' for
    # the chart function, then rename back in a copy.
    cat_chart_df = cat_df.rename(columns={"category": "department"})
    fig_cat = variance_by_department_chart(cat_chart_df)
    fig_cat.update_layout(title=dict(text="Variance by Category"))
    st.plotly_chart(fig_cat, use_container_width=True)

st.divider()

# --- Top drivers table -------------------------------------------------------
st.subheader("Top Variance Drivers")

st.plotly_chart(top_drivers_chart(top_adverse, top_favorable), use_container_width=True)

_display_cols = [c for c in ["department", "category", "variance", "variance_pct"] if c in df.columns]

adv_display = top_adverse[top_adverse["variance"] > 0][_display_cols].copy()
fav_display = top_favorable[top_favorable["variance"] < 0][_display_cols].copy()

# Format for display
def _format_drivers(frame: pd.DataFrame) -> pd.DataFrame:
    out = frame.copy()
    out["variance"] = out["variance"].apply(lambda v: f"${v:+,.0f}")
    if "variance_pct" in out.columns:
        out["variance_pct"] = out["variance_pct"].apply(
            lambda v: f"{v:+.1%}" if pd.notna(v) else "N/A"
        )
    out = out.rename(columns={"variance": "Variance ($)", "variance_pct": "Variance (%)"})
    return out


col_adv, col_fav = st.columns(2)

with col_adv:
    st.markdown(
        "<h4 style='color: #d62728;'>Adverse (Over Budget)</h4>",
        unsafe_allow_html=True,
    )
    if adv_display.empty:
        st.info("No adverse variances.")
    else:
        st.dataframe(_format_drivers(adv_display), hide_index=True, use_container_width=True)

with col_fav:
    st.markdown(
        "<h4 style='color: #2ca02c;'>Favorable (Under Budget)</h4>",
        unsafe_allow_html=True,
    )
    if fav_display.empty:
        st.info("No favorable variances.")
    else:
        st.dataframe(_format_drivers(fav_display), hide_index=True, use_container_width=True)

st.divider()

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
