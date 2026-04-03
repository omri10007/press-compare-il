import pandas as pd
import plotly.graph_objects as go


def _fmt_dollars(value: float) -> str:
    """Format a dollar value as $X,XXX or $XK for axis tick labels."""
    abs_val = abs(value)
    sign = "-" if value < 0 else ""
    if abs_val >= 1_000:
        return f"{sign}${abs_val / 1_000:,.0f}K"
    return f"{sign}${abs_val:,.0f}"


def _dollar_tickformat() -> dict:
    """Return common axis formatting kwargs for dollar variance axes."""
    return dict(tickprefix="$", tickformat=",.0f")


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


def variance_by_department_chart(dept_df: pd.DataFrame) -> go.Figure:
    """
    Horizontal bar chart showing variance by department.
    dept_df: result of aggregate_by(df, 'department')
    Columns available: department, budget, actual, variance, variance_pct

    - Color bars: red for adverse (variance > 0, i.e., over budget),
                  green for favorable (variance < 0, i.e., under budget)
    - X-axis: variance values
    - Y-axis: department names
    - Title: "Variance by Department"
    - Show variance_pct as hover text (formatted as %)
    """
    df = dept_df.copy().sort_values("variance", ascending=True)

    colors = [
        "#d62728" if v > 0 else "#2ca02c"
        for v in df["variance"]
    ]

    pct_series = df["variance_pct"]
    hover_texts = [
        f"{pct * 100:+.1f}%" if pd.notna(pct) else "N/A"
        for pct in pct_series
    ]

    fig = go.Figure(
        go.Bar(
            x=df["variance"],
            y=df["department"],
            orientation="h",
            marker_color=colors,
            text=hover_texts,
            textposition="outside",
            hovertemplate=(
                "<b>%{y}</b><br>"
                "Variance: $%{x:,.0f}<br>"
                "Variance %: %{text}<extra></extra>"
            ),
        )
    )

    fig.update_layout(
        title=dict(text="Variance by Department", font=dict(size=14)),
        xaxis=dict(
            title="Variance ($)",
            tickformat="$,.0f",
            tickfont=dict(size=12),
            showgrid=True,
            gridcolor="#eeeeee",
            zeroline=True,
            zerolinecolor="#888888",
            zerolinewidth=1,
        ),
        yaxis=dict(
            title="",
            tickfont=dict(size=12),
            showgrid=False,
        ),
        plot_bgcolor="white",
        paper_bgcolor="white",
        margin=dict(l=20, r=80, t=50, b=40),
    )

    return fig


def variance_trend_chart(month_df: pd.DataFrame) -> go.Figure:
    """
    Line chart showing total variance trend by month.
    month_df: result of aggregate_by(df, 'month')
    Columns available: month, budget, actual, variance, variance_pct

    - X-axis: month (sorted chronologically)
    - Y-axis: variance
    - Color fill: red when positive (over budget), green when negative (under budget)
      (Use a single line with markers, color by positive/negative)
    - Title: "Monthly Variance Trend"
    """
    df = month_df.copy()

    # Sort months chronologically; try datetime parse, fall back to string sort
    try:
        df["_month_dt"] = pd.to_datetime(df["month"], infer_datetime_format=True)
        df = df.sort_values("_month_dt").drop(columns=["_month_dt"])
    except Exception:
        df = df.sort_values("month")

    months = df["month"].tolist()
    variances = df["variance"].tolist()

    # Marker colors per point
    marker_colors = [
        "#d62728" if v > 0 else "#2ca02c"
        for v in variances
    ]

    # Build segments with colored fills between the line and zero
    traces = []

    # Main line trace
    traces.append(
        go.Scatter(
            x=months,
            y=variances,
            mode="lines+markers",
            line=dict(color="#333333", width=2),
            marker=dict(color=marker_colors, size=8),
            name="Variance",
            hovertemplate="<b>%{x}</b><br>Variance: $%{y:,.0f}<extra></extra>",
        )
    )

    # Fill areas: one trace per consecutive segment of the same sign
    if len(variances) >= 2:
        i = 0
        while i < len(months) - 1:
            seg_x = [months[i], months[i + 1]]
            seg_y = [variances[i], variances[i + 1]]
            avg_sign = (variances[i] + variances[i + 1]) / 2
            fill_color = "rgba(214,39,40,0.15)" if avg_sign > 0 else "rgba(44,160,44,0.15)"
            traces.append(
                go.Scatter(
                    x=seg_x + [seg_x[-1], seg_x[0]],
                    y=seg_y + [0, 0],
                    fill="toself",
                    fillcolor=fill_color,
                    line=dict(width=0),
                    showlegend=False,
                    hoverinfo="skip",
                )
            )
            i += 1

    fig = go.Figure(data=traces)

    fig.update_layout(
        title=dict(text="Monthly Variance Trend", font=dict(size=14)),
        xaxis=dict(
            title="Month",
            tickfont=dict(size=12),
            showgrid=False,
        ),
        yaxis=dict(
            title="Variance ($)",
            tickformat="$,.0f",
            tickfont=dict(size=12),
            showgrid=True,
            gridcolor="#eeeeee",
            zeroline=True,
            zerolinecolor="#888888",
            zerolinewidth=1,
        ),
        plot_bgcolor="white",
        paper_bgcolor="white",
        margin=dict(l=20, r=20, t=50, b=40),
        showlegend=False,
    )

    return fig


def top_drivers_chart(
    top_adverse: pd.DataFrame, top_favorable: pd.DataFrame
) -> go.Figure:
    """
    Combined horizontal bar chart showing top adverse and favorable variance drivers.
    top_adverse and top_favorable: results from top_variances()

    - Show top 5 from each (or fewer if less available)
    - Adverse bars: red; Favorable bars: green
    - Include department + category as label if both columns exist, else just available
    - Title: "Top Variance Drivers"
    - Sort by absolute variance magnitude
    """
    def _make_label(row: pd.Series, cols: list[str]) -> str:
        parts = []
        if "department" in cols:
            parts.append(str(row["department"]))
        if "category" in cols:
            parts.append(str(row["category"]))
        return " / ".join(parts) if parts else "Unknown"

    # Slice to top 5
    adv = top_adverse.head(5).copy()
    fav = top_favorable.head(5).copy()

    # Build labels
    adv_cols = adv.columns.tolist()
    fav_cols = fav.columns.tolist()

    adv["_label"] = adv.apply(lambda r: _make_label(r, adv_cols), axis=1)
    fav["_label"] = fav.apply(lambda r: _make_label(r, fav_cols), axis=1)

    # Combine and sort by absolute variance magnitude
    adv["_group"] = "adverse"
    fav["_group"] = "favorable"
    combined = pd.concat([adv, fav], ignore_index=True)
    combined["_abs_var"] = combined["variance"].abs()
    combined = combined.sort_values("_abs_var", ascending=True).reset_index(drop=True)

    colors = [
        "#d62728" if g == "adverse" else "#2ca02c"
        for g in combined["_group"]
    ]

    pct_series = combined.get("variance_pct", pd.Series([pd.NA] * len(combined)))
    hover_pcts = [
        f"{pct * 100:+.1f}%" if pd.notna(pct) else "N/A"
        for pct in pct_series
    ]

    fig = go.Figure(
        go.Bar(
            x=combined["variance"],
            y=combined["_label"],
            orientation="h",
            marker_color=colors,
            text=hover_pcts,
            textposition="outside",
            hovertemplate=(
                "<b>%{y}</b><br>"
                "Variance: $%{x:,.0f}<br>"
                "Variance %: %{text}<extra></extra>"
            ),
        )
    )

    fig.update_layout(
        title=dict(text="Top Variance Drivers", font=dict(size=14)),
        xaxis=dict(
            title="Variance ($)",
            tickformat="$,.0f",
            tickfont=dict(size=12),
            showgrid=True,
            gridcolor="#eeeeee",
            zeroline=True,
            zerolinecolor="#888888",
            zerolinewidth=1,
        ),
        yaxis=dict(
            title="",
            tickfont=dict(size=12),
            showgrid=False,
        ),
        plot_bgcolor="white",
        paper_bgcolor="white",
        margin=dict(l=20, r=80, t=50, b=40),
    )

    return fig
