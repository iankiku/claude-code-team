---
name: strategic-discovery
description: |
  Guided strategic discovery interview for startups. Use when: (1) Defining target customer and ICP, (2) Understanding competitive alternatives, (3) Building prospect lists, (4) Crafting outreach strategies, (5) Developing pricing models, (6) Creating positioning and differentiation. This skill uses persistent memory stored in .claude/memory/strategy-sessions.json.
---

# Strategic Discovery Interview

A structured framework for founder-market fit conversations. Forces clarity on customer, alternatives, pricing, and go-to-market.

**Memory Location**: `.claude/memory/strategy-sessions.json`

---

## Before Starting

1. Read the memory file to understand previous sessions
2. Review the current company positioning and open questions
3. Build on previous insights rather than starting fresh

---

## The Interview Framework

### Phase 1: Customer Clarity

**Q1: Who pays you, and why?**

Not the persona deck version. The actual person who signs the contract.

| Probe | Why It Matters |
|-------|----------------|
| What's their title? | Budget authority |
| What keeps them up at night? | Pain intensity |
| Why pay vs. build themselves? | Differentiation |
| Why pay vs. ignore the problem? | Urgency |

**Red flag**: "Developers" or "users" as answer. Developers have influence, not budget.

**Framework for clarifying customer types:**

| Customer Type | Who Signs | Why They Pay | GTM |
|---------------|-----------|--------------|-----|
| Enterprise | CFO / Dept Head | Compliance, risk reduction | Sales-led |
| Startups | Founder / CTO | Ship faster, don't build infra | Product-led |
| Platforms | Partnerships / BD | Enable capability for their users | Biz dev |

---

### Phase 2: Alternative Analysis

**Q2: What are customers doing today?**

List the actual alternatives, not the competitors you wish you had.

Common patterns:
1. **Nothing** - Problem not urgent enough yet
2. **Manual workaround** - Spreadsheets, human processes
3. **Homegrown solution** - Built something janky internally
4. **YOLO mode** - Ignoring the risk entirely

**Key insight**: Customers with homegrown solutions have felt the pain. They're your best prospects.

---

### Phase 3: Blockers to Action

**Q3: What's stopping you from talking to customers?**

Common blockers:

| Blocker | Real Issue | Solution |
|---------|------------|----------|
| "Need demo first" | Fear of rejection | You have enough to show |
| "Don't know where to find them" | Lack of process | Build prospect list now |
| "Don't know what to say" | Lack of script | Use templates below |
| "Need more features" | Productive procrastination | Features come from conversations |

**Rule**: If you're >50% built with zero customer conversations, the ratio is wrong.

---

### Phase 4: ICP Definition

**Q4: Define your Ideal Customer Profile**

| Attribute | Definition |
|-----------|------------|
| **Stage** | Company stage (Seed, Series A, etc.) |
| **Product** | What they're building |
| **Current state** | Already doing X or about to |
| **Pain indicator** | Signal they've felt the problem |
| **Buying signal** | Raised money, hiring, launching |

**Concrete examples to search for:**
- [List specific use cases in their space]
- [List job titles that indicate fit]
- [List technologies/tools they'd use]

---

### Phase 5: Prospect List Building

**Q5: Build the list now**

Search channels:
- Twitter/X: [relevant keywords]
- Product Hunt: [category] + last 6 months
- YC Directory: Filter by [category], recent batches
- LinkedIn: [title] + [keywords]
- Hacker News: "Show HN" + [topic]
- Discord/Slack: [relevant communities]

**Deliverable**: CSV with:
- Company name
- Website
- Description
- Contact name
- Contact role
- LinkedIn URL
- Twitter handle
- Funding status
- Fit reason
- Tier (1/2/3)

---

### Phase 6: Commitment

**Q6: Set a deadline**

| Task | Deadline |
|------|----------|
| Vet the list | [DATE] |
| Send first 5 messages | [DATE] |
| Complete 3 calls | [DATE] |

**Vetting criteria (timebox to 2 hours):**
- Still active? (30 sec - check website/LinkedIn)
- Product involves [relevant action]? (30 sec)
- Contact findable? (30 sec)

If 2/3 check out, they stay on the list.

---

### Phase 7: Pricing & Differentiation

**Q7: Why should they pay you vs. build it themselves?**

**The wrong answer**: Features they could build in a week.

**The right answer**: Complexity they don't want to maintain.

| What You Offer | Why It's Hard to Build | Time In-House |
|----------------|------------------------|---------------|
| [Capability 1] | [Complexity] | [Estimate] |
| [Capability 2] | [Complexity] | [Estimate] |
| [Capability 3] | [Complexity] | [Estimate] |

**30-second pitch template:**
> "You could build [simple version] in a week. But you'd be maintaining [complexity 1], [complexity 2], and [complexity 3] for the next year. We've already done that. You integrate in [X lines/minutes], and you're [key benefit] from day one. We charge [pricing] - costs nothing until [trigger]."

**Pricing model options:**

| Model | Pros | Cons | Best For |
|-------|------|------|----------|
| Flat fee per unit | Simple, predictable | Doesn't scale with value | High-volume, low-value |
| % of value | Scales with success | Expensive at scale | Early stage |
| SaaS subscription | Predictable MRR | Hard to sell early | Enterprise, later |
| Hybrid | Best of both | Complex to explain | Growth stage |

---

## Outreach Templates

**Template 1: Direct (Tier 1 prospects)**
```
Hey [Name] - saw you're building [product]. Quick question: how are you handling [specific problem]?

We're building [your solution] - [key capabilities]. Talking to teams who've felt the pain.

15 min this week?
```

**Template 2: Consultative (Tier 2 prospects)**
```
Hey [Name] - [Company] looks interesting. As you scale, how are you thinking about [problem area]?

We're building [solution category] - [capabilities]. Would love to understand how you're approaching this.

Open to a quick chat?
```

**Template 3: Warm intro angle**
```
Hey [Name] - congrats on [recent news/funding]. Quick question from someone building in the same space:

How are you handling [specific problem]? We're building [solution] and would love to compare notes.

15 min?
```

---

## Session Closing

After each session, update `.claude/memory/strategy-sessions.json` with:

1. **Session metadata**: Date, type, topics covered
2. **Key insights**: What was learned
3. **Action items**: Tasks with deadlines
4. **Open questions**: What to revisit later
5. **Artifacts created**: Files generated (prospect lists, etc.)

---

## Red Flags During Discovery

| Signal | What It Means |
|--------|---------------|
| "Haven't talked to customers yet" | Validation risk |
| "Everyone is our customer" | No focus |
| "We just need to build X first" | Avoidance pattern |
| "Competitors don't understand" | Hubris |
| "We're 6 months from launch" for 6+ months | Execution risk |

---

## Follow-Up Sessions

Use subsequent sessions to:

1. **Review action item completion**
2. **Capture learnings from customer calls**
3. **Refine ICP based on conversations**
4. **Update positioning based on feedback**
5. **Identify new open questions**

**Parting principle**: The next 30 days should be talking > building. Every call teaches more than another week of code.
