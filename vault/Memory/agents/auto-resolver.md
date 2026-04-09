# Auto Resolver

Status: template v1
Purpose: define when the assistant should automatically resolve a signal, when to draft and ask, and when to escalate without acting.

This file is the canonical auto-resolution policy layer.

## Relationship to other source-of-truth files

- `clawchief/priority-map.md` decides *who / what matters* and *how urgent it is*
- this file decides *what to do next* once the signal is understood
- `clawchief/tasks.md` remains the source of truth for live task state
- your calendar, inbox, tracker, and CRM remain the source of truth for their own domains

## Core principle

After classifying a signal, prefer to *resolve the obvious next step* instead of merely summarizing it.

That means:
- do low-risk operational work in the same turn when authority is clear
- update the relevant source of truth as part of doing the work
- interrupt the principal only when judgment, approval, ambiguity, or sensitivity requires it

## Resolution modes

### 1) Auto-resolve now
Use when the action is low-risk, operationally clear, and reversible or easy to audit.

### 2) Draft and ask the principal
Use when the likely next action is clear, but the principal should approve the wording or decision first.

### 3) Escalate without acting
Use when there is too much ambiguity, risk, or missing authority to safely draft or send.

### 4) No action / archive
Use when the signal is noise, duplicative, already handled, or not worth surfacing.

## Safe auto-resolve lane

Default to auto-resolve when all of these are true:
- the signal is clearly understood
- the correct source of truth is known
- the action is operational rather than strategic
- authority is already clear
- a mistake would be low-cost and recoverable

Examples:
- update `clawchief/tasks.md`
- turn meeting-note action items into tasks
- add a reminder or follow-up task
- update a tracker after a reply, booking, reschedule, or cancellation
- send low-risk scheduling / confirmation / cancellation messages when authority is clear
- create, update, or cancel calendar events when authority is clear
- send a short factual follow-up on an existing operational thread
- archive an email after it is truly handled
- send the principal a short update after resolving something important

## Draft-first lane

Draft and ask when the next step is visible but the judgment call is the principal's.

Examples:
- legal or policy answers
- investor / board / fundraising messaging
- pricing-sensitive replies
- press, podcast, speaking, or public-facing responses in the principal's voice
- emotionally sensitive personal or family communication
- messages where wording matters more than the logistics

## Escalate-without-acting lane

Escalate without acting when:
- authority is unclear
- the signal is contradictory or incomplete
- there is reputational, legal, or financial risk without enough context
- the action would expose private context the principal would not want disclosed
- there is no reliable source of truth to ground the response

## Auto-resolve workflow

1. read the priority map
2. read the relevant domain source of truth
3. classify the signal
4. choose a resolution mode
5. if auto-resolving:
   - do the operational work
   - update the source of truth in the same turn
   - create a follow-up task if a future dependency remains
6. if drafting:
   - prepare the recommended next action
   - ask only for the minimum needed approval / decision
7. if escalating:
   - send one crisp summary with the blocker and recommendation

## Source-of-truth rule

Do not auto-resolve from memory alone.
Always ground the action in the relevant live source of truth before acting.

Examples:
- task state -> `clawchief/tasks.md`
- outreach state -> live tracker / sheet / CRM
- people / program urgency -> `clawchief/priority-map.md`
- scheduling state -> live calendar + thread context

## Output rule

When auto-resolve succeeds, prefer a short update that says what changed and what, if anything, still needs the principal.

Good examples:
- "Booked it. Invite sent."
- "Updated the tracker and replied with the next step."
- "I turned the meeting-note follow-ups into tasks and handled the ones I could resolve."
- "Rescheduled for Tuesday at 2pm; nothing else needed from you."
