# Priority Map

Status: template v1
Purpose: define who and what should matter enough to interrupt the principal, trigger assistant action, or be safely ignored.

This file is the canonical *people + programs* prioritization layer.

## How to use this file

When a new signal arrives from email, chat, calendar, tasks, meeting notes, docs, or a tracker:

1. map it to zero or more *people*
2. map it to zero or more *programs*
3. assign an urgency level
4. choose an action mode

If a signal maps to no important people and no important programs, it should usually be ignored or batched.

## Urgency levels

- **P0 — interrupt now**
  - time-sensitive, high-stakes, or blocking
- **P1 — same day**
  - important enough to surface today
- **P2 — digest / batched**
  - worth tracking but not worth interrupting for immediately
- **P3 — ignore / archive**
  - low-value noise, duplication, or non-actionable chatter

## Action modes

- **Interrupt principal now** — send a short direct alert
- **Handle and summarize** — resolve the operational step, then summarize if useful
- **Queue for digest** — hold for a later summary or heartbeat if still relevant
- **Ignore** — no user-facing message needed

## Task grouping convention

`clawchief/tasks.md` should connect to this file structurally through markdown headers.

Preferred active-task pattern:

- `## Today`
  - `### Principal`
    - `#### <program or person>`
  - `### Assistant`
    - `#### <program or person>`

Rules:
- use the exact program / person names from this file when there is a clear match
- if a task does not clearly map here, place it under `#### Other / uncategorized`
- grouping is most useful in active sections such as `## Today` and `## Every weekday`

## People

### Principal
- Why they matter:
  - they are the decision-maker and the person this system exists to help
- Watch for:
  - direct asks
  - approvals needed
  - decisions only they can make
  - anything that affects schedule, travel, revenue, or important commitments
- Escalate to P0 when:
  - there is a hard deadline within 24 hours
  - a meeting conflict or urgent scheduling issue appears
  - a hot customer / partner / investor thread is blocked on them
- Default action:
  - usually interrupt now or handle and summarize

### Core family
- Why they matter:
  - real life affects real work capacity and attention
- Watch for:
  - family logistics
  - health updates
  - urgent schedule changes
  - emotionally important events or asks
- Escalate to P0 when:
  - same-day impact is likely
- Default action:
  - handle and summarize unless immediate attention is clearly warranted

### Key operators / trusted collaborators
- Why they matter:
  - they can unblock execution quickly
- Watch for:
  - legal, operational, finance, product, or marketing dependencies
- Escalate to P1 when:
  - their input is blocking an active program
- Default action:
  - handle and summarize

### Strategic relationships
- Why they matter:
  - they can materially affect distribution, trust, learning, or execution
- Watch for:
  - useful follow-up opportunities
  - time-sensitive replies
  - requests that should not sit
- Escalate to P1 when:
  - a real reply opportunity or blocker appears
- Default action:
  - handle and summarize

### Warm prospects / customers / referral partners
- Why they matter:
  - direct path to revenue and learning
- Watch for:
  - replies, objections, scheduling, interest signals, or partner questions
- Escalate to P0 when:
  - a strong reply or near-term opportunity is waiting and timing matters
- Default action:
  - handle and summarize

### Scheduled meeting counterparts (next 72 hours)
- Why they matter:
  - can create immediate prep or scheduling obligations
- Watch for:
  - confirmations, missing info, reschedules, cancellations, prep gaps
- Escalate to P0 when:
  - a meeting is in danger of breaking or a key prep item is missing
- Default action:
  - handle and summarize

## Programs

### 1) Revenue / customer growth
- Why it matters:
  - direct path to business traction
- Watch for:
  - customer acquisition opportunities
  - conversion blockers
  - objections
  - hot replies
- Escalate to P0 when:
  - a near-term revenue opportunity is blocked on the principal
- Default action:
  - handle and summarize or interrupt if action is needed today

### 2) Executive assistant: inbox, calendar, travel, schedule integrity
- Why it matters:
  - protects time and prevents dropped balls
- Watch for:
  - urgent emails
  - scheduling threads
  - conflicts
  - anything starting soon that needs action
- Escalate to P0 when:
  - a meeting is within 2 hours and needs action
  - a conflict threatens the day
- Default action:
  - handle and summarize

### 3) Board / investor / stakeholder communication
- Why it matters:
  - strategic accountability and credibility
- Watch for:
  - update requests
  - materials
  - deadlines
  - sensitive messaging
- Escalate to P0 when:
  - timing or wording matters materially
- Default action:
  - queue or handle and summarize depending on urgency

### 4) Legal / compliance / policy correctness
- Why it matters:
  - prevents avoidable risk and sloppy claims
- Watch for:
  - policy questions
  - disclosure questions
  - sensitive wording
- Escalate to P0 when:
  - an outbound answer may create legal or trust risk
- Default action:
  - hold, clarify, and escalate appropriately

### 5) Business development / partnerships
- Why it matters:
  - leverage channel for revenue and distribution
- Watch for:
  - outreach replies
  - meeting opportunities
  - follow-up gaps
  - objections
- Escalate to P0 when:
  - a strong reply or meeting opportunity is waiting
- Default action:
  - handle and summarize

### 6) Marketing / content / distribution
- Why it matters:
  - compounds reach and demand creation
- Watch for:
  - campaigns
  - content opportunities
  - publishing blockers
  - performance changes
- Escalate to P1 when:
  - a concrete opportunity or blocker needs same-day action
- Default action:
  - handle and summarize or queue for digest

### 7) Product / operations improvement
- Why it matters:
  - improves leverage and execution quality over time
- Watch for:
  - system improvements
  - tooling fixes
  - workflow cleanup
- Escalate to P1 when:
  - the principal explicitly asks for it or a change is clearly high leverage
- Default action:
  - queue for digest or convert into a task / proposal

### 8) Personal / family logistics that affect work capacity
- Why it matters:
  - the principal's real schedule is not purely work-only
- Watch for:
  - travel
  - family appointments that affect availability
  - personal admin that can disrupt commitments
- Escalate to P0 when:
  - same-day schedule impact is likely
- Default action:
  - handle and summarize

## Default routing rules

1. if a signal maps to the principal and a revenue-critical program, assume high priority
2. if a signal maps to warm prospects / partners, bias toward action over passive summarization
3. if a signal affects the calendar within 24 hours, bias toward immediate handling
4. if a signal touches legal / compliance / policy correctness, bias toward caution
5. if a signal maps only to low-value chatter and no key people / programs, downgrade it
6. if the assistant can safely resolve the issue without the principal, do that and summarize only if useful

## Things that should usually be ignored or batched

- casual chatter with no action
- repeated notifications that add no new information
- documents or messages with no connection to an important person or program
- speculative ideas with no owner, deadline, or next step
- low-stakes activity already captured in the task list
