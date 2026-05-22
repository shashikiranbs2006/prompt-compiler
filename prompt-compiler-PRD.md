# PRD — Prompt Compiler
### Product Requirements Document v1.0
**Author:** Shashikiran BS | **Date:** May 2026 | **Status:** Ready to Build

---

## 1. EXECUTIVE SUMMARY

**What it is:** A web app (Chrome extension later) that takes messy natural-language input from any user and compiles it into a production-quality, platform-optimized AI prompt — either instantly (Quick Fix) or through a conversational deep-build flow (Deep Build).

**The one-line pitch:** "You speak human. Your AI needs a prompt. We translate."

**Why it exists:** Every major AI platform — Claude, ChatGPT, Gemini — rewards well-structured prompts. But 90% of users don't know how to write them, and existing tools either do a one-click "make it better" (no context collection) or require you to already know prompt engineering. We sit in the gap: a conversational agent that asks the right questions first, then generates a prompt that matches both the task AND the target platform.

---

## 2. THE PROBLEM (Validated)

### Who suffers:
- A student writing "summarise this paper for me" and getting a 5-paragraph dump instead of the 3-bullet study guide they needed
- A developer typing "write tests for this function" with no context, getting generic garbage
- A marketer prompting "write a cold email" and getting lorem ipsum vibes
- Anyone who has ever thought "why is AI so bad" when the real answer is "your prompt is so bad"

### What they currently do:
1. Give up and accept bad output
2. Keep reprompting randomly until something sticks
3. Google "how to prompt ChatGPT" and get a 47-step Medium article
4. Pay for PromptPerfect ($9.50/mo) which just rephrases without asking questions

### The actual gap:
Nobody is doing **conversational context collection → platform-specific structured output**. That's the product.

---

## 3. PLATFORM DIFFERENCES — WHY THIS MATTERS

Research across official docs from Anthropic, OpenAI, and Google reveals they are **genuinely different**. This is not marketing. Platform-specific prompts are a real feature, not a gimmick.

| Dimension | Claude (Anthropic) | ChatGPT (OpenAI) | Gemini (Google) |
|---|---|---|---|
| **Structure preference** | XML tags `<role>`, `<task>`, `<context>` | Markdown headers, triple-backtick delimiters | Plain text, natural language, inline instructions |
| **Role definition** | Deep persona + context in system prompt | System message with explicit role + behavior rules | Role inline in user turn, lighter touch |
| **Examples (few-shot)** | Wrapped in `<example>` tags, high value | JSON schema + examples, format-first | Brief inline examples, especially for multimodal |
| **Chain of thought** | `<thinking>` tags, extended thinking mode | "Think step by step" inline, reasoning effort levels | "Let's think through this" inline, no special tags |
| **Length instructions** | Explicit word/format constraints work well | Hard limits work ("under 100 words", "3 bullet points") | Scope-based ("a concise overview", "a brief summary") |
| **Output format** | XML-wrapped structured output | JSON schema enforcement, markdown tables | Natural prose or clearly-specified structure |
| **Context handling** | Loves deep background, long system prompts | Cleaner with shorter system prompts, context in user turn | Gemini appreciates real-time data hints, Google Workspace context |
| **Tone instructions** | Works well in system prompt persona | Works well as explicit style rules | Works inline, simpler the better |

**Verdict on platform-specific outputs:** YES, we build platform-specific system prompts. The structural differences are real enough that a Claude-optimized prompt with XML tags looks broken in Gemini's UI and vice versa. One universal format is a compromise that serves nobody optimally.

---

## 4. PRODUCT OVERVIEW

### 4.1 Core User Flow

```
User lands on app
        ↓
Types their rough idea / bad prompt
        ↓
Selects Mode:
  [⚡ Quick Fix]          [🔬 Deep Build]
        ↓                       ↓
Selects target platform  Selects target platform
(Claude / ChatGPT /      (Claude / ChatGPT /
 Gemini / Universal)      Gemini / Universal)
        ↓                       ↓
Instant output:          Conversational Q&A:
3 variations             Agent asks until it has
of improved prompt       enough → generates prompt
        ↓                       ↓
[Copy] [Try Again]       [Copy] [Refine Further]
[Pick this one →         [Start Over]
 Refine it further]
```

---

### 4.2 MODE 1 — QUICK FIX

**Trigger:** User wants fast improvement, no questions asked.

**What it does:**
- Takes user's raw input
- Applies Anthropic's core principles: clarity, specificity, context, constraints, format
- Does NOT add role/XML/structure unless the prompt clearly benefits from it
- Generates **3 distinct variations** — each a different angle on the same intent

**The 3 variations are NOT just rewrites of each other. They represent:**
- **Variation A — Minimal:** Cleanest, most direct version. Removes vagueness, adds one key constraint.
- **Variation B — Contextual:** Adds audience + format + tone that the user probably meant but didn't say.
- **Variation C — Structured:** Full specificity — role hint if relevant, clear output format, concrete constraints.

**User can then:**
- Copy any variation directly
- Click "Refine this one" to enter a mini-refinement loop (1-2 targeted follow-ups, not the full Deep Build)

**What Quick Fix does NOT do:**
- Ask questions
- Add XML tags unless user is on Claude platform
- Change the user's core intent

---

### 4.3 MODE 2 — DEEP BUILD

**Trigger:** User wants a genuinely high-quality, purpose-built prompt. Doesn't mind a short conversation.

**Philosophy:** Information collector first. Prompt generator second. The follow-up questions ARE the product.

**Flow:**

```
Step 1 — Intent Extraction (silent, no user sees this)
Agent reads input, internally identifies:
  - Task type (write / analyze / code / brainstorm / explain / other)
  - What's clear
  - What's critically missing (not nice-to-have — CRITICAL gaps only)

Step 2 — Conversational Q&A
Agent asks questions ONE AT A TIME, conversationally.
NOT a form. NOT a checklist. A chat.
No maximum question limit — but agent is trained to ask only
what is NECESSARY. If it can infer something reasonably, it does.
Typical flow: 3-6 questions for most tasks.

Step 3 — Confirmation
Agent shows a brief summary:
"Here's what I'm working with: [task summary]. 
 Generating your [platform] prompt now..."

Step 4 — Prompt Generation
Platform-specific, structured, complete prompt.

Step 5 — Display
Shows the generated prompt in a clean chat-style output.
Two actions: [Copy Prompt] [Refine Further]

Step 6 — Refinement Loop (optional)
User can say "make it shorter", "add more examples",
"make it sound more casual" etc.
Agent makes targeted edits and returns updated prompt.
```

**Question Intelligence Rules:**
The agent MUST follow these rules when asking questions:

1. **Never ask what it can infer.** If the user says "write a Python function", don't ask "what programming language?". Infer Python.
2. **Never ask more than one question at a time.** One question per message. Always.
3. **Prioritise critical gaps over nice-to-haves.** The 4 critical fields are: goal clarity, audience, output format, constraints. Ask about these first if missing.
4. **If the task is simple enough, skip straight to generating.** Don't manufacture questions for a simple task like "explain what an API is".
5. **Acknowledge what you understood.** Each question should briefly confirm what was understood first: "Got it — you're writing a cover letter for a software role. Who's the target audience — a recruiter or a technical hiring manager?"

---

## 5. PLATFORM-SPECIFIC SYSTEM PROMPT ARCHITECTURE

Each platform gets its own generation system prompt, loaded when user selects their target.

### 5.1 Claude (Anthropic) — Output Format

The generated prompt uses Anthropic's official XML tag structure:

```
<role>
[Expert persona matching the task. Not generic — specific.]
</role>

<context>
[Background information the model needs. User's situation, constraints, what has been tried.]
</context>

<task>
[Clear, specific action. Use imperative verbs. One primary task.]
</task>

<requirements>
[Numbered list of specific requirements derived from user's answers]
</requirements>

<output_format>
[Exactly what the output should look like — format, length, structure, tone]
</output_format>

<examples>
[If user provided examples or if examples help — included here]
</examples>
```

Sources: Anthropic official docs — XML tags, system prompts, multishot prompting, be clear and direct.

---

### 5.2 ChatGPT / GPT (OpenAI) — Output Format

OpenAI prefers markdown structure, triple-backtick delimiters, explicit role in system, format-first approach.

```
**Role:** [Specific expert persona]

**Task:** [Clear primary action with specific deliverable]

**Context:**
[User's situation and background, 2-4 sentences]

**Requirements:**
1. [Specific requirement]
2. [Specific requirement]
3. [Specific requirement]

**Output Format:**
[Exact format specification — use concrete examples like "respond in a table with columns X, Y, Z" or "write exactly 3 paragraphs where the first paragraph does X"]

**Constraints:**
- [Hard limit 1]
- [Hard limit 2]

---
[Task-specific data or input if applicable goes below the line]
```

Sources: OpenAI official prompt engineering guide — system messages, formatting, few-shot examples, chain of thought.

---

### 5.3 Gemini (Google) — Output Format

Gemini works best with natural language, inline context, lighter structure. No XML. Markdown is optional.

```
You are [specific role with relevant expertise].

[2-3 sentence context paragraph: who the user is, what they're working on, why this matters.]

Your task: [Clear imperative statement of what to do.]

Please make sure to:
- [Key requirement 1]
- [Key requirement 2]
- [Key requirement 3]

Format your response as [specific format — be concrete but natural sounding].

[Tone/style note if relevant — "Keep the tone conversational and jargon-free" etc.]
```

Sources: Google Gemini official prompting strategies — consistent formatting, context inclusion, few-shot examples.

---

### 5.4 Universal — Output Format

When user selects "Universal" (works across all platforms), we produce a clean, tag-free, readable format that degrades gracefully everywhere.

```
ROLE: [Expert persona]

CONTEXT: [Background and situation]

TASK: [Primary action — specific and clear]

REQUIREMENTS:
• [Requirement 1]
• [Requirement 2]
• [Requirement 3]

OUTPUT FORMAT: [Specific format expectation]

CONSTRAINTS: [Hard limits]
```

---

## 6. THE CORE SYSTEM PROMPTS (What runs behind the scenes)

These are the actual system prompts fed to the Groq API (llama-3.3-70b-versatile — free, fast, capable).

### 6.1 Quick Fix Agent System Prompt

```
You are a world-class prompt engineer trained on official documentation 
from Anthropic, OpenAI, and Google. Your job is to take a user's rough, 
vague, or poorly-structured prompt and transform it into 3 distinct 
improved versions that dramatically increase the quality of AI responses.

The user has selected: [TARGET_PLATFORM]

Core principles you apply (from official docs):
1. CLARITY: Remove vagueness. Be specific about the task.
2. CONTEXT: Add relevant background the AI needs to respond well.
3. CONSTRAINTS: Add output format, length, tone, or audience 
   if missing and relevant.
4. SPECIFICITY: Replace generic requests with precise ones.
5. EXAMPLES: Add an inline example if the task benefits from it.

CRITICAL RULES:
- Do NOT change the user's intent. Improve HOW they express it.
- Do NOT add a role/persona unless the task clearly benefits 
  from domain expertise.
- Do NOT manufacture constraints the user didn't imply.
- Generate exactly 3 variations labeled A, B, C.
- Each variation must be meaningfully different — not just 
  a synonym swap.
- Variation A: minimal fix (clarity only)
- Variation B: adds context + format
- Variation C: fully structured with all relevant elements

Output format (strict):
---VARIATION A---
[Label]: Minimal Fix
[prompt text]

---VARIATION B---
[Label]: Contextual
[prompt text]

---VARIATION C---
[Label]: Fully Structured
[prompt text]

Apply [TARGET_PLATFORM] formatting conventions to all three variations.
```

### 6.2 Deep Build — Intent Extraction Agent System Prompt

```
You are the first stage of a two-stage prompt engineering system.
Your job is to analyze user input and extract structured intent.

Given the user's raw input, identify:
{
  "task_type": "write|analyze|code|explain|brainstorm|summarize|other",
  "goal": "what the user actually wants to achieve",
  "target_ai": "claude|chatgpt|gemini|universal",
  "clearly_stated": ["list of things that are clear"],
  "critical_gaps": ["list of things that are CRITICALLY missing"],
  "can_infer": ["list of things you can reasonably infer without asking"]
}

CRITICAL GAPS are ONLY:
- Goal ambiguity (you can't generate a prompt without knowing what they want)
- Missing audience (if it meaningfully changes the prompt)
- Missing output format (if multiple formats are plausible)
- Missing key constraints (if their absence would produce a useless prompt)

Do NOT flag as critical gaps:
- Things you can infer from context
- Nice-to-have details
- Things that have obvious defaults

Return only valid JSON. No preamble or explanation.
```

### 6.3 Deep Build — Question Agent System Prompt

```
You are a conversational prompt engineering assistant. You are 
having a friendly, focused conversation to collect the information 
needed to build the user a perfect AI prompt.

You have been given the structured intent analysis from the previous 
step. Your job is to ask about critical gaps ONE AT A TIME in a 
natural, conversational way.

RULES — follow these strictly:
1. Ask ONE question per message. Never two.
2. Always briefly confirm what you understood before asking.
3. If you can infer something reasonably, infer it — don't ask.
4. Ask questions in order of importance (goal > audience > format > constraints).
5. Once you have enough to generate a great prompt, stop asking 
   and say: "Perfect, I have everything I need. Generating your prompt..."
6. Keep questions SHORT and conversational. No corporate speak.
7. Never ask for information the user already gave.

Tone: Friendly, smart, efficient. Like a senior engineer 
      helping a colleague, not a form wizard.
```

### 6.4 Deep Build — Prompt Generator System Prompt

```
You are a world-class prompt engineer. You have collected structured 
information about the user's task through a conversation. Now generate 
the final, production-quality prompt.

Target platform: [TARGET_PLATFORM]
Apply the correct formatting conventions for this platform:

CLAUDE: Use XML tags — <role>, <context>, <task>, <requirements>, 
        <output_format>, <examples>
CHATGPT: Use markdown headers and triple-backtick delimiters. 
         Format-first approach.
GEMINI: Use natural language with light structure. No XML. 
        Inline role and context.
UNIVERSAL: Use clean labeled sections. No XML. Works everywhere.

Standards you must meet:
1. Role: Specific expert persona (not "you are a helpful assistant")
2. Context: Real background that changes how the AI responds
3. Task: Imperative, specific, single primary action
4. Requirements: Numbered, concrete, testable
5. Output format: Exact specification — format, length, structure, tone
6. Examples: Include if the user provided any or if they help

Quality bar: This prompt should work on the first try.
A bad prompt needs reprompting. Yours should not.

Output ONLY the final prompt. No explanation, no preamble, 
no "here is your prompt". Just the prompt itself.
```

---

## 7. UI/UX SPECIFICATION

### 7.1 Layout

```
┌─────────────────────────────────────────┐
│  PROMPT COMPILER          [⚡] [🔬]      │
│  ─────────────────────────────────────  │
│  Target: [Claude ▾] [ChatGPT ▾]        │
│           [Gemini ▾] [Universal ▾]     │
│  ─────────────────────────────────────  │
│                                         │
│  [Chat / conversation area]             │
│                                         │
│  ─────────────────────────────────────  │
│  Type your rough idea...          [→]   │
└─────────────────────────────────────────┘
```

### 7.2 Key UX Decisions

**Mode selector:** Two tabs at top — ⚡ Quick Fix and 🔬 Deep Build. Visually distinct. Default is Quick Fix.

**Platform selector:** Dropdown or 4 pill buttons — Claude | ChatGPT | Gemini | Universal. Persists across session. Default: Universal.

**Quick Fix output:** Shows 3 variation cards side by side (or stacked on mobile). Each has a Copy button and a "Refine this" button.

**Deep Build output:** Conversational chat UI. Agent messages on left, user on right. Final prompt appears in a distinct output card with syntax-like styling, full-width, with copy button.

**Copy behavior:** One-click copy. Button changes to "Copied ✓" for 2 seconds.

**Refinement:** After any output (Quick Fix or Deep Build), user can type a refinement request directly into the input ("make it shorter", "add a tone of urgency"). Agent applies it and returns updated prompt. No full restart needed.

**No login for V1.** No history. No accounts. Just open and use.

---

## 8. TECH STACK

| Layer | Choice | Reason |
|---|---|---|
| Frontend | React + Vite | Fast setup, you know it |
| Styling | Tailwind CSS | Speed, no custom CSS needed |
| AI API | Groq API (free) | llama-3.3-70b-versatile — fast, free, smart enough |
| State | useState / useReducer | No backend needed for V1 |
| Deployment | Vercel (free) | One command deploy |
| API calls | Client-side fetch | No backend for V1 |

**Groq model:** `llama-3.3-70b-versatile`
- Free API key
- ~800 tokens/second
- Context window: 128k tokens
- More than capable for prompt generation tasks

**Fallback:** If Groq rate limits, queue the request or show a "busy" message. No paid fallback needed for V1.

---

## 9. DATA FLOW DIAGRAM

```
USER INPUT
    │
    ▼
[Mode: Quick Fix?] ─── YES ──► Intent understood inline
    │                           │
    NO                          ▼
    │                    [Quick Fix Agent]
    ▼                    (single API call)
[Deep Build]                    │
    │                           ▼
    ▼                    3 Variations Output
[Intent Extraction]             │
Agent (API call 1)              ▼
    │               [User picks / copies / refines]
    ▼
[Question Agent]
(API call 2, 3, 4...)
    │
    ▼
[User answers collected]
    │
    ▼
[Prompt Generator]
(API call N)
    │
    ▼
Final Platform-Specific
Prompt Output
    │
    ▼
[User copies / refines]
```

---

## 10. WHAT WE ARE NOT BUILDING (V1 Scope Limits)

These are explicitly OUT of scope for V1. Adding them will delay the launch and add complexity without validating the core.

| Feature | Status | Reason |
|---|---|---|
| User accounts / login | ❌ V1 | Adds auth complexity before product is validated |
| Prompt history / saving | ❌ V1 | No backend yet |
| Chrome extension | ❌ V1 | Build after web app is proven |
| Multiple AI calls in parallel | ❌ V1 | Complexity |
| Prompt evaluation / scoring | ❌ V1 | Out of scope |
| Team features / sharing | ❌ V1 | Not needed yet |
| Fine-tuned model | ❌ V1 | Groq + good system prompts is enough |
| Analytics / tracking | ❌ V1 | Focus on building, not measuring yet |

---

## 11. SUCCESS METRICS (post-launch)

Since this is a portfolio / learning project first, success looks like:

**Functional success:**
- Quick Fix generates 3 meaningfully different variations in < 3 seconds
- Deep Build asks no more than 6 questions for 90% of tasks
- Generated prompts produce noticeably better AI responses than the original input
- Platform-specific formatting is correctly applied

**Reach success (if you post it):**
- Shared on LinkedIn → gets engagement from peers / recruiters
- Someone who doesn't know you uses it and sends feedback
- You can demo it in < 2 minutes to anyone

**Resume success:**
- Shows: LLM workflow design, multi-agent architecture, API integration, product thinking
- Not: "built a chatbot that uses ChatGPT"

---

## 12. PHASED ROADMAP

### Phase 1 — Core Web App (2-3 weeks)
- [ ] Groq API integration
- [ ] Mode selector (Quick Fix / Deep Build)
- [ ] Platform selector (4 options)
- [ ] Quick Fix: intent → 3 variations
- [ ] Deep Build: conversational Q&A → prompt output
- [ ] Copy button
- [ ] Basic refinement loop
- [ ] Deploy on Vercel

### Phase 2 — Polish (1 week after core works)
- [ ] Better UI — variation cards, chat bubbles, output styling
- [ ] Platform-specific formatting preview
- [ ] Mobile responsive
- [ ] "What changed" tooltip on Quick Fix variations

### Phase 3 — Chrome Extension (after web app is proven)
- [ ] Manifest V3 setup
- [ ] Popup with both modes
- [ ] Content script for auto-detecting current AI platform
- [ ] Auto-paste generated prompt into platform's input box
- [ ] Publish to Chrome Web Store ($5 one-time)

---

## 13. OPEN QUESTIONS (Decide before building)

| Question | Current thinking |
|---|---|
| Groq API key — user provides their own or you host it? | Host it for V1 (hide in .env). If usage spikes, switch to BYOK. |
| What if user selects "Universal" in Deep Build? | Generate the Universal format. Mention it works across platforms. |
| Refinement loop — how many rounds? | No hard limit. But each refinement is a new API call. UX should feel light. |
| Quick Fix — do we show which technique was applied? | Yes — small label under each variation: "Added specificity", "Added context + format", "Full structure". Teaches the user. |
| Mobile vs desktop priority? | Desktop for V1. Extension is the mobile story. |

---

*This document is the complete source of truth for Prompt Compiler V1.*
*Build Phase 1 first. Ship it. Then decide what's next.*
