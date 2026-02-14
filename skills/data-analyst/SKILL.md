---
name: data-analyst
description: |
  Data analysis specialist focused on extracting insights, building dashboards, and driving data-informed decisions. Masters SQL, analytics tools, visualization, and statistical thinking for product and business intelligence.

  Use when: (1) Writing SQL queries for analysis, (2) Building dashboards and visualizations, (3) Analyzing user behavior and product metrics, (4) A/B test analysis and experiment design, (5) Funnel analysis and conversion optimization, (6) Creating data models and ETL pipelines, (7) Answering business questions with data.
---

# Data Analyst

Correlation is not causation. Sample size matters. Always check your assumptions.

## Core Principles

**Data Over Opinions**: "I think users want X" < "Data shows users do Y."

**Statistical Rigor**: Significance without practical significance is noise.

**Actionable Insights**: Analysis without recommendations is just reporting.

**Reproducibility**: If you can't reproduce it, you can't trust it.

---

## SQL Query Patterns

### Funnel Analysis
```sql
WITH funnel AS (
  SELECT
    user_id,
    MAX(CASE WHEN event = 'page_view' THEN 1 END) AS viewed,
    MAX(CASE WHEN event = 'add_to_cart' THEN 1 END) AS added,
    MAX(CASE WHEN event = 'checkout' THEN 1 END) AS checked_out,
    MAX(CASE WHEN event = 'purchase' THEN 1 END) AS purchased
  FROM events
  WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
  GROUP BY user_id
)
SELECT
  COUNT(*) AS total_users,
  SUM(viewed) AS viewed,
  SUM(added) AS added_to_cart,
  SUM(checked_out) AS checkout,
  SUM(purchased) AS purchased,
  ROUND(100.0 * SUM(purchased) / NULLIF(SUM(viewed), 0), 2) AS conversion_rate
FROM funnel;
```

### Cohort Retention
```sql
WITH cohorts AS (
  SELECT
    user_id,
    DATE_TRUNC('week', MIN(created_at)) AS cohort_week
  FROM events
  GROUP BY user_id
),
activity AS (
  SELECT
    c.cohort_week,
    DATE_TRUNC('week', e.created_at) AS activity_week,
    COUNT(DISTINCT e.user_id) AS active_users
  FROM events e
  JOIN cohorts c ON e.user_id = c.user_id
  GROUP BY 1, 2
)
SELECT
  cohort_week,
  activity_week,
  active_users,
  ROUND(100.0 * active_users / FIRST_VALUE(active_users)
    OVER (PARTITION BY cohort_week ORDER BY activity_week), 2) AS retention_pct
FROM activity
ORDER BY cohort_week, activity_week;
```

### Rolling Averages
```sql
SELECT
  date,
  daily_value,
  AVG(daily_value) OVER (
    ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) AS rolling_7d_avg
FROM daily_metrics;
```

---

## A/B Test Analysis

### Sample Size Formula
```
n = 2 * (Za + Zb)^2 * p(1-p) / MDE^2

Where: Za = 1.96 (95% confidence), Zb = 0.84 (80% power),
       p = baseline conversion rate, MDE = minimum detectable effect
```

### Significance Check
```sql
WITH experiment AS (
  SELECT
    variant,
    COUNT(*) AS users,
    SUM(CASE WHEN converted THEN 1 ELSE 0 END) AS conversions,
    AVG(CASE WHEN converted THEN 1.0 ELSE 0.0 END) AS conversion_rate
  FROM experiment_users
  GROUP BY variant
)
SELECT variant, users, conversions, ROUND(conversion_rate * 100, 2) AS conversion_pct
FROM experiment;
```

### Common Pitfalls
- Peeking at results before sample size reached
- Running too many variants (multiple comparison problem)
- Ignoring novelty effects
- Not accounting for seasonality

---

## Data Quality Checks

```sql
-- Check for nulls
SELECT COUNT(*) - COUNT(column_name) AS null_count FROM table_name;

-- Check for duplicates
SELECT column, COUNT(*) FROM table_name GROUP BY column HAVING COUNT(*) > 1;

-- Check date range
SELECT MIN(created_at), MAX(created_at) FROM events;

-- Check for outliers
SELECT PERCENTILE_CONT(0.01) WITHIN GROUP (ORDER BY value) AS p1,
       PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY value) AS p99
FROM metrics;
```

Data quality dimensions: Completeness, Accuracy, Consistency, Timeliness.

---

## Analysis Workflow

1. **Question** - What are we trying to learn?
2. **Hypothesis** - What do we expect to find?
3. **Data** - What data do we need?
4. **Analysis** - Run queries, build visualizations
5. **Validate** - Check assumptions, verify results
6. **Insight** - What does this mean?
7. **Action** - What should we do?

---

## Communication Template

```markdown
## Finding: [One-line summary]

**Context**: Why we looked at this
**Data**: What we analyzed (time period, sample)
**Finding**: What we discovered (with numbers)
**So What**: Why this matters
**Recommendation**: What to do next
```

### Presenting Numbers
- Always include confidence intervals
- Compare to benchmarks (industry, historical)
- Use relative change AND absolute numbers
- Round appropriately (2 decimal places max)
