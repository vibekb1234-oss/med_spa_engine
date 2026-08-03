---
name: intent-check
description: "Structured AI delegation framework that catches two critical failures before they happen - solving the wrong problem, and unclear intent. Four modes: (1) Quick Start gut-check before any delegation, (2) Problem Diagnostic to stress-test whether you're solving the right thing, (3) Intent Engineering to build a complete intent specification, (4) Team Delegation Audit to map risk across all AI use. Use when the user says 'problem check', 'intent check', 'am I solving the right thing', 'engineer intent for this', 'delegation audit', 'check this before I delegate', 'is this the right problem', or before handing a significant task to an AI agent."
---

# Intent Check

Catches the two biggest AI delegation failures before they cost you: solving the wrong problem, and giving the AI unclear intent.

## Modes

Select based on what the user needs. Default to Quick Start unless they ask for something deeper.

| Mode | When to Use | Reference |
|---|---|---|
| **Quick Start** | Before any delegation - 2-3 min gut-check | This file |
| **Problem Diagnostic** | Nagging feeling you're solving a symptom, not a cause | `references/problem-diagnostic.md` |
| **Intent Engineering** | Building a complete intent spec for a significant delegation | `references/intent-engineering.md` |
| **Delegation Audit** | Quarterly review of all team AI delegations | `references/delegation-audit.md` |

---

## Quick Start (Default Mode)

Run this before handing any meaningful task to an AI agent.

### Step 1 - Check context
Before asking anything, check conversation history and memory for context about the user's work and projects. If relevant context exists, confirm briefly: "I know you've been working on [X] - is this related?" Then proceed.

### Step 2 - Get the task
Ask: "What task are you about to hand off to AI? Give me the instruction you'd paste in - or describe what you want done."

Wait for response.

### Step 3 - Get the outcome
Ask: "What's the actual outcome you're hoping for? Not the task - the result. What does done well look like?"

Wait for response.

### Step 4 - Run two silent checks

**Problem Check:**
- Is the stated task actually the right thing to solve, or is there a more fundamental problem upstream?
- Would completing this task perfectly actually produce the outcome they described?
- Are there signs the user is solving a symptom rather than a root cause?

**Intent Check:**
- Where are the gaps between the instruction and the desired outcome?
- What could an AI reasonably do that technically follows the instruction but misses the point?
- What constraints, edge cases, or value judgments are left implicit?

### Step 5 - Deliver output

**Problem Check: [PASS / CAUTION / STOP]**
1-2 sentences explaining the verdict. If CAUTION or STOP, explain what the upstream problem might actually be.

**Intent Gaps Found:**
List each gap - where AI could technically comply but miss the point. Be specific.

**Tightened Instruction:**
Rewritten version of their instruction with intent gaps closed - constraints explicit, value judgments surfaced, edge cases handled.

**Confidence:** How confident in this assessment? If low, state what additional context would help.

---

## Rules

- Only use information the user provides - do not invent scenarios
- If the task is genuinely clear and well-aimed, say so - do not manufacture problems
- Problem Check should be honest, not cautious - if it is fine, say PASS
- If STOP on the problem check, explain clearly what they should think about before proceeding
- For deeper analysis, load the appropriate reference file and follow its workflow
