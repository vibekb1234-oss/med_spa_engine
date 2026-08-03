# Intent Engineering Workshop

Build a complete intent specification for a significant AI delegation — one that closes the gap between what you say and what you mean.

## When to Use
- You have a task you're confident is worth solving (passed Problem Diagnostic or Quick Start PROCEED)
- The task is significant enough that a misfire would cost you real time or money
- The instruction you'd write has ambiguities you can feel but haven't articulated

## Workflow

### Step 1 - Check context
Check memory and conversation history. If you know what the user is working on, confirm: "I know you're working on [X] — is this the task you want to engineer intent for?" Only ask about what is missing.

### Step 2 - Get the raw instruction
Ask: "What's the instruction you'd give the AI right now — the version you'd paste in if you were just getting on with it?"

Wait for response.

### Step 3 - Get the real outcome
Ask: "What does done well actually look like? Describe it as if you were explaining to someone what a great result would feel like — not just what it would contain."

Wait for response.

### Step 4 - Get the constraints
Ask: "What are the constraints? Think about: things it must not do, formats it must follow, audiences it's writing for, tone it must hit, or prior decisions it must respect."

Wait for response.

### Step 5 - Get the edge cases
Ask: "What could go wrong — even if the AI technically does what you asked? What would make you look at the output and say 'that's not what I meant'?"

Wait for response.

### Step 6 - Run the intent gap analysis

Work through each dimension silently, then surface only the gaps you find:

**Dimension 1 - Outcome Clarity**
Is the desired outcome specific enough that two people reading it would produce similar results? Or is it vague enough that the AI could produce wildly different outputs and both be "correct"?

**Dimension 2 - Audience and Tone**
Who is the output for? What do they already know? What register should it be written in? Is this explicit in the instruction, or assumed?

**Dimension 3 - Scope Boundaries**
What is out of scope? What should the AI not include, not suggest, not change? Are any existing decisions or prior work that must be respected?

**Dimension 4 - Format and Structure**
Is the expected format clear? Length, structure, headings, output type (list vs prose vs table vs code)? If left open, could the AI produce something technically correct but practically unusable?

**Dimension 5 - Value Judgments**
Are there judgment calls embedded in this task that the AI will have to make? Which option to recommend, which framing to use, what to prioritise? Are those judgments explicit — or left to the AI to guess?

**Dimension 6 - Quality Bar**
How would you know if this was done well vs done adequately? Is there a standard, a comparison, or a specific quality signal? If not, the AI will aim for "good enough."

### Step 7 - Deliver the intent specification

**Intent Specification**

**Task:** [Restated clearly in one sentence]

**Outcome:** [What done well looks like — specific, testable]

**Audience:** [Who this is for and what they need]

**Constraints:**
- [Hard constraint 1]
- [Hard constraint 2]
- [etc.]

**Out of Scope:** [What the AI should not do, even if it seems helpful]

**Format:** [Expected structure, length, output type]

**Judgment Calls — Made Explicit:**
- [Decision point 1 → what choice to make and why]
- [Decision point 2 → what choice to make and why]

**Quality Signal:** [How you'll know if this is done well]

**Engineered Instruction:**
[The full, tightened instruction — ready to paste in. Incorporates all of the above. Self-contained: the AI needs no other context to execute this correctly.]

**Confidence:** How complete is this specification? If any dimension was left uncertain, note what additional context would close it.

## Rules
- Only use information the user provides — do not invent constraints or decisions
- If a dimension is genuinely not applicable, skip it — do not force it
- The engineered instruction must be self-contained: no assumed context, no references to "what we discussed"
- If the user has not made a judgment call, surface it — do not make it for them
- The goal is a specification precise enough that a different AI (or a different session) could execute it correctly with no further input
