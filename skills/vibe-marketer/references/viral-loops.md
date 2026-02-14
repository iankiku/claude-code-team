# Viral Loop Deep Dive

## The Four Loop Types

### 1. Embedded Loops

**Definition**: Sharing is inherent to product usage—users share to accomplish their own goals, not to help you grow.

**Examples**:
- **Calendly**: User shares scheduling link to get meetings booked
- **Loom**: User shares video message for recipient to watch
- **DocuSign**: User sends contract for signature
- **Notion**: User shares workspace for collaboration
- **Figma**: Designer shares file for feedback

**Characteristics**:
- Highest K factor potential (0.5-2.0+)
- Zero friction—sharing IS the use case
- Every active user is a distribution channel
- Recipients must engage with product

**Implementation Checklist**:
- [ ] Identify workflow that requires external party
- [ ] Make shareable link the default output
- [ ] Recipient gets value without account
- [ ] Account creation is prominent but optional
- [ ] Track: links generated, link views, conversions

**K Factor Calculation**:
```
K = active_users × links_per_user × view_rate × conversion_rate

Example (Calendly-style):
- 1000 active users
- 10 scheduling links sent per user per month
- 80% of links are viewed
- 5% of viewers create account

K = 1000 × 10 × 0.80 × 0.05 = 400 new users per month
Per-user K = 10 × 0.80 × 0.05 = 0.4
```

---

### 2. User-Generated Content Loops

**Definition**: Product enables creation of content that users share on external platforms, driving discovery.

**Examples**:
- **TikTok**: Users create videos, share everywhere, viewers join
- **Canva**: Users create designs, share on social, viewers see "Made with Canva"
- **Spotify Wrapped**: Annual listening stats, mass social sharing
- **Strava**: Activity maps shared on social
- **Duolingo**: Streak screenshots, achievement badges

**Characteristics**:
- K factor: 0.3-1.0
- Leverages external platforms for distribution
- Content is identity-reinforcing
- Subtle product attribution

**Implementation Checklist**:
- [ ] Auto-generate shareable assets at milestones
- [ ] Make sharing 1-click with pre-populated content
- [ ] Include tasteful product branding
- [ ] Optimize for each platform's format
- [ ] Time shares at peak satisfaction moments

**Design Principles**:
```
Good shareable content:
- Says something about the user's identity
- Has visual appeal (screenshot-worthy)
- Has a hook that creates curiosity
- Makes viewers want to create their own

Bad shareable content:
- Generic "I used ProductX" messages
- Too much product branding
- No personal element
- Doesn't spark "how did you do that?"
```

---

### 3. Casual Contact Loops

**Definition**: Passive exposure during normal product usage creates awareness among non-users.

**Examples**:
- **Intercom/Zendesk**: "Powered by" widget on customer sites
- **Mailchimp**: Branding in email footers
- **Zoom**: Logo during video calls
- **Lime/Bird**: Branded scooters visible on streets
- **Stripe**: "Pay with Stripe" at checkout

**Characteristics**:
- K factor: 0.1-0.3
- Low friction exposure
- Compounds over massive usage
- Works best with high-frequency products

**Implementation Checklist**:
- [ ] Branding visible during natural usage
- [ ] Branding is tasteful, not intrusive
- [ ] Clear path from exposure to signup
- [ ] Track impression → visit → conversion

**Optimization Levers**:
```
Increase exposure:
- More prominent placement
- More frequent visibility
- More usage = more impressions

Increase click-through:
- "Powered by X - Try free" beats just logo
- Contextual relevance (show at moment of value)
- Curiosity-inducing copy

Increase conversion:
- Landing page matches context
- Free tier available
- Immediate value demonstration
```

---

### 4. Referral Programs

**Definition**: Explicit incentives for users to share product with others.

**Examples**:
- **Dropbox**: Extra storage for referrals
- **Uber/Lyft**: Ride credits for both parties
- **Robinhood**: Free stock for referrals
- **Notion**: Credit toward paid plans

**Characteristics**:
- K factor: 0.1-0.4 (lower than embedded loops)
- Explicit ask = friction
- Works best with utility-based rewards
- Two-sided rewards outperform one-sided

**Implementation Checklist**:
- [ ] Reward aligns with product value (storage, credits, not cash)
- [ ] Both referrer and referee benefit
- [ ] Sharing is 1-click
- [ ] Progress/reward is visible
- [ ] Fraud prevention in place

**Reward Design**:
```
Best rewards (aligned with product):
- More of what product provides (Dropbox storage)
- Extended access (extra months free)
- Premium features unlocked

Medium rewards (tangible value):
- Credit toward purchase
- Discount on upgrade

Avoid:
- Pure cash (attracts wrong users, feels transactional)
- One-sided (only referrer benefits)
- Delayed rewards (get X after friend pays)
```

---

## Combining Loops

Most successful products use multiple loops:

**Slack Example**:
1. Embedded loop: Slack Connect invitations
2. Casual contact: "Join us on Slack" links
3. UGC loop: Slack integrations visible in other tools
4. Network effects: Team invites team members

**Canva Example**:
1. UGC loop: Designs shared on social
2. Casual contact: "Made with Canva" attribution
3. Embedded loop: "Share this design" for collaboration
4. Referral: Pro credits for invites

---

## Loop Velocity Optimization

Viral cycle time = time from signup to referring new user

**Fast cycles compound faster**:
```
100 users, K=0.5, cycle time = 1 week
Week 1: 100 → 150
Week 4: 100 → 506
Week 8: 100 → 2,562

Same K, cycle time = 1 month
Month 1: 100 → 150
Month 4: 100 → 506

4x faster growth with same K
```

**Accelerate cycle time**:
- Move "aha moment" earlier in onboarding
- Prompt sharing at first value realization
- Remove account creation friction for recipients
- Make re-sharing easy for existing content
