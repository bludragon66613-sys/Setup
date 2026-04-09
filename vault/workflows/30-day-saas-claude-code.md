---
title: 30 day saas claude code
type: workflow
status: active
---

# 30-Day SaaS Build Playbook with Claude Code

**Source:** CyrilXBT (@cyrilXBT)  
**Date:** 2026-04-03  
**Link:** https://x.com/cyrilxbt/status/2039899776712405290

## Core Thesis

You don't need money, a co-founder, or a dev team to build a SaaS product. You need Claude Code, a clear problem, and 30 days of focused execution.

**Key mental shift:** Most people think about the *product* (features, design, infrastructure). People who actually ship think about the *customer* first:

1. Who is this for?
2. What problem keeps them up at night?
3. What are they currently paying to solve badly?
4. What would a 10x better solution look like?

Answer these four questions before opening Claude Code.

## Week 1: Validate Before You Build (Days 1–7)

### Days 1–3: Find a Real Problem
- Go to Reddit, Product Hunt reviews, App Store reviews in your target market
- Look for comments like:
  - "I wish this tool could just..."
  - "Why does nobody build something that..."
  - "I have been doing this manually for years"
- These comments are product roadmaps written by future customers
- **Pick one problem. Just one.** Resist the temptation to solve multiple problems.

### Days 4–7: Validate Demand
- Build a landing page (plain language: problem + solution)
- Put a waitlist signup on it
- Share in 3 relevant communities + DM 10 people who have the problem
- **If you can't get 20 emails in a week:** You don't have a validated idea. Go back and find a better problem.
- **If you get 20+ signups:** You have enough signal to start building.

This is the step most people skip because they're excited to build. It prevents wasting 30 days on something nobody wants.

## Week 2: Build the Core in Claude Code (Days 8–14)

**You are NOT building the full product.** You're building the ONE feature that delivers core value and nothing else.

### The Scoping Prompt
Describe the entire product vision to Claude first (architectural context). Then ask:

> "Given everything I just described, what is the absolute minimum I need to build to deliver the core value to my first user? Help me scope week two down to a single shippable feature."

Let Claude tell you what to build first. It's almost always smaller and more focused than what you had in mind. And almost always right.

### The 2026 Solo SaaS Stack
- **Frontend:** Next.js
- **Database + Auth:** Supabase
- **Deployment:** Vercel
- **Payments:** Stripe
- **AI Features:** Claude API

**Don't deviate from this stack in your first 30 days.** Every new tool is a new thing that can go wrong and a new skill to learn.

### Your Job
- Review what Claude builds
- Catch anything that doesn't make sense
- Keep moving

By end of week two: something live, functional (not polished), that a real human can use to experience core value.

## Week 3: Get It in Front of Real Users (Days 15–21)

**Don't stay in building mode.** This is when most solo builders get scared and hide.

### Day 15: Email Your Waitlist
- Tell them your MVP is live
- Offer free access in exchange for a 20-minute feedback call
- **Talk to at least 5 users this week** (not surveys — actual conversations)

### Questions to Ask on Every Call
1. What problem were you hoping this would solve?
2. Walk me through exactly how you tried to use it.
3. Where did you get confused or frustrated?
4. If you could change one thing, what would it be?
5. Would you pay for this? If so, how much?

Take notes. Look for patterns. 2–3 people mentioning the same friction point = your priority for week four.

### Set Up Your First Payment
- Even if it's just \/mo
- Even if only one person pays
- Getting your first paid customer changes something in your head that's hard to describe until it happens
- Use Stripe (30 minutes to set up, Claude Code writes the integration)

## Week 4: Close the Loop and Compound (Days 22–30)

### Fix the #1 Friction Point
Based on user calls from week three, you know exactly what the biggest friction point is. Fix that and **only that** this week.

### Set Up Three Compounding Systems

**1. Automated Onboarding**
- When someone signs up, they receive an email sequence that:
  - Explains the product
  - Shows the fastest path to value
  - Asks for feedback
- Claude writes all of this in ~20 minutes if you describe your product and user clearly

**2. Basic Analytics**
- Know which features people actually use vs. ignore
- Posthog is free to start
- Claude Code can add it in under an hour

**3. Feedback Channel**
- Simple Slack or Discord where users tell you what they want next
- Most engaged early users become your most loyal long-term customers and best source of product ideas

### By Day 30 You Should Have
- A live product
- At least one paying customer
- A clear picture of what to build next

## The Honest Part

30 days is enough to ship something **real**, not something **perfect**.

People who succeed with this model accept that the first version is going to be rough and ship it anyway.

Every week you spend in building mode without real users is a week where you're guessing instead of learning.

Claude Code dramatically reduces the time between idea and live product, but it does **not** remove the need to:
- Talk to customers
- Make hard prioritization decisions
- Actually ship the thing

The tools have never been better. Distribution channels have never been more accessible. The barrier between having an idea and a live product people can pay for has never been lower.

The only thing standing between you and a SaaS product in 30 days is whether you start this week.

## Related Workflows

- [[stitch-mcp-design-system]] — Google Stitch + Claude Code for UI design
- [[structured-design-critique-ai]] — Using taste signals to improve AI design outputs

