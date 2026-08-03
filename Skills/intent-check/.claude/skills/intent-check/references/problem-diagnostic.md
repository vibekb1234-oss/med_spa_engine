# Problem Diagnostic

Deep diagnostic for stress-testing whether you're solving the right problem before investing AI resources in it.

## When to Use
- Nagging feeling you might be solving a symptom instead of a cause
- A project feels stuck and you're not sure why
- Someone asks you to "fix" something and you want to verify the diagnosis first

## Workflow

### Step 1 - Check context
Check memory and conversation history. If relevant context exists, confirm: "Based on our previous conversations, I know [X, Y, Z]. Is this the situation you want to diagnose, or is this something new?" Only ask about what is missing.

### Step 2 - Get the problem
Ask: "What's the problem you think you need to solve? Describe it the way you'd explain it to a colleague."

Wait for response.

### Step 3 - Get the trigger
Ask: "What triggered this? Why are you looking at this now - did something break, did someone flag it, or is this a slow burn?"

Wait for response.

### Step 4 - Get prior attempts
Ask: "What have you already tried or considered? Even partial solutions or rejected ideas help me understand the landscape."

Wait for response.

### Step 5 - Run four diagnostic lenses

**Lens 1 - Upstream Check**
Is this the actual problem, or a symptom of something deeper? Trace the causal chain backward. If you fix this, does the upstream cause just produce a new symptom?

**Lens 2 - Definition Check**
Is the problem defined correctly? Could the same situation be framed differently - and would that reframing change the solution entirely? Are the boundaries of the problem drawn in the right place?

**Lens 3 - Existence Check**
Is this actually a problem - or is it a feature of the system, a tradeoff that was accepted, or a constraint that cannot be changed? Some problems are just the cost of doing business.

**Lens 4 - Outcome Check**
If you solved this problem perfectly tomorrow, what would actually change? Would the user get what they really want? Or would they still be dissatisfied because the real issue is elsewhere?

### Step 6 - Deliver output

**Diagnostic Summary**
2-3 sentences: does this problem hold up under scrutiny? What is the headline finding?

**Lens 1 - Upstream:** Is this the root cause or a symptom?

**Lens 2 - Definition:** Is the problem framed correctly?

**Lens 3 - Existence:** Is this actually a problem, or a feature/tradeoff?

**Lens 4 - Outcome:** Would solving this get the user what they actually want?

**Verdict: [PROCEED / REFRAME / STOP]**

- PROCEED: Brief confirmation of why the problem is correctly identified. Move to intent engineering.
- REFRAME: What the problem should actually be defined as. How this reframing changes the solution approach.
- STOP: Why this is not a problem to solve at all - and what to do instead.

**Next Step**
One concrete action: either "proceed to engineering your intent for this" or "investigate [specific thing] before going further."

## Rules
- Only use information the user provides - do not invent details
- If a lens is inconclusive, say so - do not force a finding
- If the problem is correctly identified, say PROCEED without manufacturing doubt
- Ask ONE clarifying follow-up if a response is too vague to run the diagnostic
- Do not suggest solutions - this diagnostic identifies problems, it does not solve them
