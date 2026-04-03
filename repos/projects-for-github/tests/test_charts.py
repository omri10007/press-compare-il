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
    assert fig.layout.font.color == "#111827"
