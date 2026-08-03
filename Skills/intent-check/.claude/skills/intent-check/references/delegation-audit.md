# Team Delegation Audit

Map and stress-test all current AI delegations across your team. Identifies which tasks are well-specified, which are flying blind, and where the highest-risk delegations are.

## When to Use
- Quarterly review of how the team is using AI
- Before scaling AI use to more people or higher-stakes tasks
- When you suspect AI outputs are inconsistent or off-target but can't pinpoint why
- Onboarding a new team member to AI-assisted work

## Workflow

### Step 1 - Check context
Check memory and conversation history. If team context exists (team size, roles, current AI tools, active projects), confirm what you already know and ask only what is missing.

### Step 2 - Get the inventory
Ask: "List every task your team currently delegates to AI. Include one-offs and recurring tasks. Give me the task name and who owns it — a rough list is fine."

Wait for response.

### Step 3 - Get the tooling
Ask: "What AI tools are in use — ChatGPT, Claude, Copilot, custom agents, or others? Are there any automated pipelines where AI runs without a human reviewing the output?"

Wait for response.

### Step 4 - Score each delegation

For each task in the inventory, run a silent 4-factor risk score:

**Factor 1 - Intent Clarity (0-3)**
- 0: No documented instruction — verbal or tribal knowledge only
- 1: Basic prompt exists but vague or context-dependent
- 2: Documented prompt with some constraints
- 3: Full intent specification — outcome, constraints, edge cases all explicit

**Factor 2 - Output Stakes (0-3)**
- 0: Internal draft only — human always reviews before use
- 1: Low stakes — minor error has low impact
- 2: Medium stakes — error is embarrassing or causes rework
- 3: High stakes — error could harm a client relationship, legal standing, or revenue

**Factor 3 - Human Review (0-3)**
- 0: No review — AI output goes direct to output or action
- 1: Spot-check only — occasional review, not systematic
- 2: Review before external use
- 3: Full review and sign-off every time

**Factor 4 - Consistency (0-3)**
- 0: Different people prompt differently — outputs vary unpredictably
- 1: Some consistency — loose norms but not enforced
- 2: Standard prompt used — most people follow it
- 3: Prompt is documented, stored, and used by all

**Risk Score = (Output Stakes) × (3 - Intent Clarity) × (3 - Human Review)**

Higher score = higher risk. Flag anything above 6.

### Step 5 - Deliver the audit

**Delegation Inventory**

| Task | Owner | Tool | Intent Score | Stakes | Review | Consistency | Risk Score |
|------|-------|------|-------------|--------|--------|-------------|------------|
| [task] | [owner] | [tool] | [0-3] | [0-3] | [0-3] | [0-3] | [score] |

**High-Risk Delegations (Score > 6)**
For each: what the risk is, and what one change would reduce it most.

**Blind Spots**
Delegations that have no documented instruction, no review, or are running in automated pipelines without oversight.

**Quick Wins**
Low-effort fixes: tasks where writing down the prompt, adding a review step, or aligning the team on a standard would materially reduce risk.

**Recommended Priority**
Top 3 delegations to address first, with a specific action for each.

**Overall Assessment**
One paragraph: is this team's AI delegation in control or flying blind? What is the headline finding?

## Rules
- Score based on what the user describes, not what they aspire to — no credit for intentions
- If a delegation is missing from the inventory but the user mentions it in passing, add it
- Do not moralize about AI use — assess risk and surface it, that's all
- If the inventory is large (10+ tasks), group by risk tier rather than listing every detail
- Automated pipelines with no human review are always flagged, regardless of intent clarity
