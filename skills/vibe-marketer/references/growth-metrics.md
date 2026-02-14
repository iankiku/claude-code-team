# Growth Metrics Reference

## Viral Coefficient (K Factor)

### Definition
K measures how many new users each existing user brings in through viral mechanisms.

```
K = i × c

Where:
- i = invitations sent per user
- c = conversion rate of invitations

Or expanded:
K = (% users who share) × (shares per sharing user) × (conversion rate)
```

### Interpretation

| K Value | Meaning | Growth Pattern |
|---------|---------|----------------|
| K < 0.5 | Weak virality | Need significant paid acquisition |
| K = 0.5-0.8 | Moderate | Viral assists but doesn't drive growth |
| K = 0.8-1.0 | Strong | Near self-sustaining |
| K = 1.0 | Self-sustaining | Each user replaces themselves |
| K > 1.0 | Exponential | True viral growth |

### Benchmarks by Loop Type

| Loop Type | Typical K Range | Best-in-Class |
|-----------|-----------------|---------------|
| Embedded (Calendly model) | 0.4-0.8 | 1.5+ |
| UGC (TikTok model) | 0.2-0.6 | 1.0+ |
| Casual Contact | 0.05-0.15 | 0.3 |
| Referral Program | 0.1-0.3 | 0.5 |

### Calculating K in Practice

**Method 1: Cohort Analysis**
```python
# Track a cohort over time
cohort_users = 1000
referred_users_30_days = 150

K = referred_users_30_days / cohort_users
# K = 0.15
```

**Method 2: Component Breakdown**
```python
total_users = 10000
users_who_shared = 800  # 8%
total_shares = 4000  # 5 per sharing user
conversions = 300  # 7.5% conversion rate

K = (800/10000) * (4000/800) * (300/4000)
# K = 0.08 × 5 × 0.075 = 0.03
```

**Method 3: Growth Attribution**
```python
new_users_month = 5000
new_users_from_referral = 750
new_users_organic = 2000
new_users_paid = 2250

viral_contribution = 750 / 5000  # 15%
# But this isn't K—need to know active user base
```

---

## Viral Cycle Time

### Definition
Time from a user signing up to them successfully referring a new user.

### Why It Matters
```
Same K, different cycle times:

K = 0.5, cycle = 7 days:
Week 0: 1000 users
Week 4: 1000 × (1 + 0.5)^4 = 5,062 users

K = 0.5, cycle = 30 days:
Day 30: 1000 × 1.5 = 1,500 users
Day 120: 1000 × (1.5)^4 = 5,062 users

Same result, 4x longer timeline
```

### Optimization Levers

| Factor | Impact | How to Improve |
|--------|--------|----------------|
| Time to value | High | Faster onboarding, immediate gratification |
| Sharing friction | High | 1-click share, pre-populated messages |
| Share timing | Medium | Prompt at peak satisfaction moments |
| Recipient friction | High | No account required to see value |

### Measuring Cycle Time
```python
# Track time between events
signup_time = user.created_at
first_referral_time = user.first_successful_referral_at

cycle_time = first_referral_time - signup_time

# Median is more useful than mean (outliers skew)
median_cycle_time = np.median([user.cycle_time for user in users_who_referred])
```

---

## Activation Rate

### Definition
Percentage of signups that reach the "aha moment" where they understand product value.

### Why It Matters for Virality
```
Users can't share what they don't value.

Low activation = low K
Even if you have perfect viral mechanics,
users who don't activate won't share.
```

### Common Activation Metrics

| Product Type | Activation Event | Target |
|--------------|------------------|--------|
| Productivity SaaS | Created first project | >60% day 1 |
| Social Network | Added 5 friends | >40% week 1 |
| Marketplace | Completed first transaction | >30% |
| Content Tool | Created first shareable output | >50% |

### The Activation → Sharing Pipeline
```
Signup → Activation → Satisfaction → Sharing

Each step has dropoff:
1000 signups
→ 400 activated (40%)
→ 200 satisfied enough to share (50% of activated)
→ 80 actually share (40% of satisfied)
→ 12 conversions (15% conversion rate)

K = 12/1000 = 0.012

Improving activation by 25%:
1000 signups
→ 500 activated (50%)
→ 250 satisfied
→ 100 share
→ 15 conversions

K = 15/1000 = 0.015 (25% higher)
```

---

## Share Rate

### Definition
Percentage of users who share at least once within a time period.

### Benchmarks

| Share Mechanism | Typical | Good | Excellent |
|-----------------|---------|------|-----------|
| Embedded (required) | 70-90% | 90%+ | 95%+ |
| Embedded (optional) | 20-40% | 50%+ | 70%+ |
| UGC | 10-25% | 30%+ | 50%+ |
| Referral Program | 5-10% | 15%+ | 25%+ |

### Diagnosing Low Share Rate

| Symptom | Likely Cause | Solution |
|---------|--------------|----------|
| <5% share rate | No natural sharing moment | Embed in workflow |
| Sharing but no conversions | Recipient value unclear | Improve landing experience |
| Shares to 1 person only | High friction | Reduce clicks, batch sharing |
| Shares once, never again | No ongoing triggers | Create multiple share moments |

---

## Net Promoter Score (NPS)

### Definition
```
NPS = % Promoters (9-10) - % Detractors (0-6)

Range: -100 to +100
```

### Relationship to Virality
```
Promoters are your viral engine.
Detractors are anti-viral (actively discourage).

NPS 50 → Strong viral potential
NPS 20 → Moderate
NPS 0 → Promoters and detractors cancel out
NPS -20 → Actively hurting growth
```

### NPS Benchmarks by Industry

| Industry | Average NPS | Top Quartile |
|----------|-------------|--------------|
| SaaS | 30 | 50+ |
| Consumer Tech | 40 | 60+ |
| E-commerce | 35 | 55+ |
| Fintech | 25 | 45+ |

---

## Dashboard Metrics

### Primary Metrics (Track Daily)
1. **K Factor** - Are we viral?
2. **Cycle Time** - How fast?
3. **Activation Rate** - Are users getting value?
4. **Share Rate** - Are users sharing?

### Secondary Metrics (Track Weekly)
1. **NPS** - Are users advocates?
2. **Shares per user** - Depth of sharing
3. **Conversion rate** - Quality of referrals
4. **Referral LTV** - Value of referred users

### Diagnostic Metrics (When Troubleshooting)
1. **Share funnel** - Where's the dropoff?
2. **Time to first share** - Cycle time components
3. **Share method breakdown** - Which channels work?
4. **Referred user activation** - Quality of loop

---

## Anti-Metrics (Don't Optimize These)

| Metric | Why It's Misleading |
|--------|---------------------|
| Raw invite count | High if everyone invites 100 people who ignore |
| Signup count | Vanity if they don't activate |
| Share button clicks | Measures intent, not completion |
| Viral "reach" | Impressions without conversion = noise |
