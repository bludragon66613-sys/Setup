---
title: structured design critique ai
type: workflow
status: active
---

# Structured Design Judgment for AI Design Outputs

**Source:** Alex Kehr (@alexkehr)  
**Date:** 2026-04-03  
**Link:** https://x.com/alexkehr/status/2039803876900237519

## Core Thesis

"AI sucks at design" is mostly a **skill issue**. The problem isn't the tool — it's that people ask AI to "make it better" without providing structured feedback.

AI doesn't have taste. **You provide the taste signal; AI compresses the gap between critique and execution.**

## The 3-Step Workflow

### 1. Write a Design Critique
Take a screenshot of the page you want to improve. Answer these 6 questions:

1. **What is this page trying to do?**
2. **What do I notice first?**
3. **Is it easy to understand?**
4. **What can I do here?**
5. **Does it feel cohesive?**
6. **What would I change first?**

This forces you to slow down and think like a designer before prompting like an operator.

### 2. Turn Critique into a Clean Prompt
Paste your critique into ChatGPT (or any LLM) with this prompt:

> "I did a design critique and want to give my thoughts to [YOUR AI CODING TOOL] to improve the [NAME OF PAGE] page. Can you help me turn my critique into a prompt? The prompt should start with: I did a design critique on [BRIEF DESCRIPTION OF PAGE]. We need to get this page to world-class, 10/10 UI/UX."

Example:
> "I did a design critique and want to give my thoughts to Cursor to improve the AI search feature page. Can you help me turn my critique into a prompt? The prompt should start with: I did a design critique on the blank state of our AI search feature. We need to get this page to world-class, 10/10 UI/UX."

### 3. Feed Screenshot + Refined Prompt to Your AI Coding Tool
Paste the screenshot and the ChatGPT-refined prompt into Cursor, Claude Code, or your preferred tool.

## The Iteration Loop

**Don't treat the first output as the answer.** Treat it as design exploration.

After the first output, take another screenshot and do a follow-up round:

> "Is this now a 10/10 design? Here's my feedback: [add your thoughts]. Take a moment to critique your own design updates and tell me how you'd elevate this to a true 10/10 if it's still not there."

The model improves design output significantly when you make it **critique its own work** and raise the bar.

Alex's example: Superlocal's search blank state went from cluttered/text-heavy to polished UI with time-of-day-aware "Explore More" feature in ~35 minutes.

## What AI Is Actually Good At

1. Turning messy thoughts into structured direction
2. Rapidly iterating on implementation
3. Responding well to clear taste signals

The mistake most people make: expecting AI to have great taste on its own.

What actually works: **using your taste to create the feedback loop.**

AI is not replacing the designer here. It's compressing the gap between critique and execution. That's the superpower.

## Example Changes from Alex's Workflow

From cluttered blank state to polished UI:

**Header:**
- Merged subtitle and personalization into single dynamic line ("Powered by your 6,224 check-ins & 29 saved places")
- Falls back to "Search powered by your taste, not generic ratings" when user has zero data
- Tightened vertical spacing for focused two-line header

**Suggestion Pills (docked above input):**
- Added 2 compact, time-of-day-aware prompt chips
- Chips hide when user starts typing, reappear when text is cleared
- Subtle reminder that search is personalized
- Added "Explore More" button

**Explore Suggestions Sheet:**
- New sheet with lots of suggested searches
- "Good morning" greeting based on time-of-day (subtle personalization reminder)

**Input Field Improvements:**
- Instead of static "Ask your map anything..."
- Now rotates through time-of-day-aware search ideas (e.g., morning: "best place to get coffee and croissants now")

## Key Insight

The changes were directed by Alex's experience as a designer, but AI dramatically compressed the gap between taste and execution.

## Related Workflows

- [[stitch-mcp-design-system]] — Google Stitch + Claude Code for systematic design
- [[30-day-saas-claude-code]] — Full SaaS build playbook

