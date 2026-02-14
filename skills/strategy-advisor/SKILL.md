---
name: strategy-advisor
description: |
  Strategic leadership and decision-making across executive, technical, product, and research perspectives. Use when: (1) Strategic planning and resource allocation, (2) Build vs buy decisions, (3) Technical debt and architecture governance, (4) Product prioritization and roadmaps, (5) PRDs and user stories, (6) Market research and competitive analysis, (7) Evidence-based decision making, (8) Executive communication and board materials.

  For guided strategic discovery interviews (customer definition, ICP, prospect lists, pricing), use /strategic-discovery instead. This skill uses persistent memory stored in .claude/memory/strategy-sessions.json.
---

# Strategy Advisor

Every resource is an investment. What's the expected return?

---

## Executive Leadership

### Strategic Priority Filter

Before committing resources:
1. Does this move our primary metric?
2. Is this a one-way door?
3. What do we say no to if we say yes?
4. Can we afford the opportunity cost?

**Rule**: If it doesn't serve top 3 priorities, it doesn't happen.

### Resource Allocation Model
```
70% Core:            Existing business, proven ROI
20% Adjacent:        Related opportunities, emerging bets
10% Transformational: Future business, experiments
```

### Executive Communication

| Audience | Lead With | Support With |
|----------|-----------|--------------|
| Board | Outcomes, risks, asks | Metrics, plans |
| Investors | Growth, efficiency, market | Competitive position |
| All-hands | Vision, progress, recognition | Context, next steps |
| Leadership | Decisions needed | Context, options, rec |

### BLUF Structure
1. **Bottom Line Up Front**: Key message in first sentence
2. **Context**: Why this matters now
3. **Details**: Supporting information
4. **Ask**: What you need

---

## Technical Leadership

### Build vs Buy Decision Matrix

| Factor | Favors Build | Favors Buy |
|--------|--------------|------------|
| Core differentiator | ✅ | ❌ |
| Commodity capability | ❌ | ✅ |
| Deep customization | ✅ | ⚠️ |
| Time-to-market critical | ❌ | ✅ |

**Default**: Buy unless it's core to your value proposition.

### Technical Debt Prioritization

Priority order:
1. **Security debt**: Fix immediately
2. **Reliability debt**: Fix before next incident
3. **Velocity debt**: Fix when it's the bottleneck
4. **Architecture debt**: Fix when scaling requires it
5. **Code quality debt**: Fix opportunistically

### Technology Adoption Framework
```
Experiment (10%): New tech, low stakes, learning-focused
Pilot (20%):      Proven in experiment, limited blast radius
Adopt (60%):      Proven in pilot, standard for new projects
Retire (10%):     Deprecated, migration path defined
```

### Team Topology Principles
- **Two-pizza teams**: 5-8 engineers maximum
- **Full-stack ownership**: Build, deploy, run
- **Clear interfaces**: Team boundaries = API boundaries

---

## Product Management

### Prioritization Framework (RICE)
```
Score = (Reach × Impact × Confidence) / Effort

Reach:      Users affected per quarter (1-10)
Impact:     Behavior change magnitude (0.25, 0.5, 1, 2, 3)
Confidence: Data backing (20%, 50%, 80%, 100%)
Effort:     Person-weeks
```

### One-Way vs Two-Way Doors

| One-Way (Irreversible) | Two-Way (Reversible) |
|------------------------|----------------------|
| Database schema changes | UI changes |
| Public API contracts | Feature flags |
| Pricing model changes | Copy changes |

**Rule**: One-way doors need more analysis. Two-way doors need more speed.

### PRD Essential Sections
1. **Problem Statement**: What pain, for whom, how do we know
2. **Success Metrics**: Leading (behavior) + Lagging (outcome)
3. **User Stories**: As a [who], I want [what], so that [why]
4. **Scope**: Explicitly in, explicitly out
5. **Risks**: What could go wrong, mitigations
6. **Dependencies**: Technical, organizational, external

### User Story Format
```
As a [user type],
I want [capability],
so that [benefit].

Acceptance Criteria:
- Given [context], when [action], then [outcome]
```

---

## Research & Analysis

### Source Hierarchy

| Tier | Source Type | Trust Level |
|------|-------------|-------------|
| 1 | Primary data, peer review | High |
| 2 | Expert analysis, industry reports | Medium-High |
| 3 | Reputable journalism | Medium |
| 4 | Blogs, forums | Low |
| 5 | Social media | Very Low |

### Evidence Strength Assessment
```
Strong:    Replicated, peer-reviewed, large N
Moderate:  Single study, expert consensus, medium N
Weak:      Case studies, expert opinion, small N
Anecdotal: Individual reports, unverified claims
```

### Confidence Language

| Confidence | Language |
|------------|----------|
| High (>80%) | "Evidence shows...", "Research confirms..." |
| Medium (50-80%) | "Suggests...", "Indicates..." |
| Low (20-50%) | "May...", "Some evidence for..." |
| Very Low (<20%) | "Speculation suggests..." |

### Competitive Analysis Framework

| Dimension | Our Position | Comp A | Comp B |
|-----------|--------------|--------|--------|
| Positioning | | | |
| Target segment | | | |
| Pricing model | | | |
| Key features | | | |
| Strengths | | | |
| Weaknesses | | | |

---

## Decision Frameworks

### For Big Decisions
1. What would we have to believe for this to work?
2. What's the cost of being wrong?
3. What are we not seeing? (Assign devil's advocate)
4. Who disagrees and why?
5. Is this decision reversible?

### Decision Speed Heuristic
- **One-way door**: Take time, get it right
- **Two-way door**: Decide fast, correct later
- **Default**: Most decisions are two-way doors

---

## Red Flags

### Organizational
- Key person dependencies on critical systems
- Customer concentration >25% of revenue
- Cash runway <12 months
- Top performer attrition >10% annually
- Strategic confusion in leadership

### Product
- Feature requests without problem statements
- "Customers want X" without data
- Scope creep as "while we're at it"
- "MVP" that's actually V1

### Research
- Conflict of interest undisclosed
- Sample size not mentioned
- Claims without citations
- Single-source claims as fact

---

## Quick Reference

### Investment Thesis Template
```
Hypothesis:      What we believe to be true
Evidence:        Why we believe it
Experiment:      How we'll test it
Success criteria: What "working" looks like
Kill criteria:   When we stop
Timeline:        Decision points
Resources:       What we're committing
```

### MVP Definition
Minimum Viable Product = smallest thing that:
- Tests the core hypothesis
- Delivers value to early users
- Generates learning for iteration

MVP ≠ crappy V1. MVP = focused experiment.
