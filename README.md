# ▶ promptcompiler

**You speak human. Your AI needs a prompt. We translate.**

Most people get bad AI output not because the AI is bad — because their prompt is bad. promptcompiler fixes that. Paste your rough idea, get a production-quality prompt back — either instantly or through a smart 30-second conversation.

![promptcompiler](https://img.shields.io/badge/status-live-brightgreen?style=flat-square&labelColor=0d0d14&color=5858d0)
![stack](https://img.shields.io/badge/stack-React%20%2B%20Vite%20%2B%20Groq-blue?style=flat-square&labelColor=0d0d14&color=5858d0)
![model](https://img.shields.io/badge/model-llama--3.3--70b-orange?style=flat-square&labelColor=0d0d14&color=e8a87c)
![license](https://img.shields.io/badge/license-MIT-gray?style=flat-square&labelColor=0d0d14)

---

## What is this

A web app with two modes:

**⚡ Quick Fix** — you type a bad prompt, you get 3 improved versions back in seconds. No questions asked. Each version is a different angle: minimal fix, contextual, fully structured.

**🔬 Deep Build** — a conversational agent asks you smart questions one at a time (never a form, never a checklist — a real chat), collects exactly what it needs, then generates a production-quality prompt tailored to your target platform.

Both modes output prompts formatted specifically for the platform you choose.

---

## Why platform-specific prompts matter

Claude, ChatGPT, and Gemini are genuinely different. A prompt that works great on one performs poorly on another.

| | Claude | ChatGPT | Gemini |
|---|---|---|---|
| **Structure** | XML tags | Markdown headers | Natural language |
| **Role** | Deep persona in system prompt | Explicit role + rules | Inline, lighter touch |
| **Examples** | `<example>` tags | JSON schema | Brief inline |
| **Output format** | XML-wrapped | Markdown tables | Natural prose |

promptcompiler knows this. Switch platforms, the output format changes automatically.

---

## Demo

> Input: *"write a cold email i need a job im broke lol"*

**Quick Fix output (3 variations):**

```
A — Minimal Fix
Write a concise cold email to a hiring manager at a tech startup
applying for an entry-level SDE role. Keep it under 100 words.

B — Contextual  
Write a cold email to the HR team at an early-stage startup for
an entry-level software engineering role. Tone: friendly and direct.
Format: subject line + 3-paragraph email. Max 150 words.

C — Fully Structured
Role: Career coach and professional email writer
Task: Write a cold outreach email for an entry-level SDE position
at a tech startup...
[full structured prompt]
```

---

## Tech stack

- **Frontend** — React + Vite
- **Styling** — Tailwind CSS v4
- **AI** — Groq API (`llama-3.3-70b-versatile`) — free and fast (~800 tok/sec)
- **Deploy** — Vercel
- **Auth** — none (V1 is open, no login)

---

## Project structure

```
src/
├── api/
│   └── groq.js                 # API client — all calls go through here
├── constants/
│   ├── platforms.js            # Platform definitions (Claude, ChatGPT, Gemini, Universal)
│   └── systemPrompts.js        # All agent system prompts
├── hooks/
│   ├── useQuickFix.js          # Quick Fix state and logic
│   └── useDeepBuild.js         # Deep Build state and logic
├── components/
│   ├── QuickFixPanel.jsx       # Quick Fix mode UI
│   ├── DeepBuildPanel.jsx      # Deep Build chat UI
│   ├── PromptCard.jsx          # Output card with copy button
│   ├── ChatBubble.jsx          # Chat message bubble
│   ├── CopyButton.jsx          # One-click copy
│   └── LoaderDots.jsx          # Loading animation
├── utils/
│   └── parsers.js              # Response parsers for each agent
└── App.jsx                     # Root — orchestration only
```

The 800-line single-file prototype was deliberately split into this structure. Each file has one job.

---

## Run locally

**Prerequisites:** Node 18+, a free [Groq API key](https://console.groq.com)

```bash
# 1. Clone
git clone https://github.com/YOUR_USERNAME/prompt-compiler.git
cd prompt-compiler

# 2. Install
npm install

# 3. Add your Groq key
cp .env.example .env
# open .env → paste your key as VITE_GROQ_API_KEY=gsk_...

# 4. Run
npm run dev
# → http://localhost:5173
```

---

## Deploy to Vercel

```bash
npm install -g vercel
vercel
# follow prompts → add VITE_GROQ_API_KEY as environment variable
```

Or connect your GitHub repo on [vercel.com](https://vercel.com) and add the env var in the dashboard. One click after that.

---

## How the agents work

### Quick Fix agent
Single API call. System prompt instructs the model to generate exactly 3 variations with strict delimiters (`---VARIATION_A---` etc). A custom parser splits the response into cards.

### Deep Build agent
Multi-turn. Each user message is sent with the full conversation history embedded in the system prompt as context. The model responds with a `PHASE:` flag — either `QUESTION` (ask one more thing) or `GENERATE` (produce the final prompt). The phase flag controls the UI state.

### Refinement
After any output, the user can type a refinement request. A separate lightweight agent applies only the requested change and returns the updated prompt.

---

## Roadmap

- [x] Quick Fix — 3 variations
- [x] Deep Build — conversational Q&A → prompt
- [x] Platform-specific formatting (Claude / ChatGPT / Gemini / Universal)
- [x] Inline refinement loop
- [ ] Fix parsing edge case when generation is delayed
- [ ] localStorage prompt history (last 10 prompts)
- [ ] Chrome extension — detect platform, auto-fill prompt into input box
- [ ] BYOK (bring your own API key) for power users
- [ ] Team prompt library with sharing

---

## The problem this solves

Everyone's prompting AI wrong. Not because they're lazy — because nobody told them how. Existing tools either do a one-click "make it better" with no context, or require you to already know prompt engineering.

promptcompiler sits in the gap: it asks the right questions first, then generates something that actually works.

---

## Built by

**Shashikiran BS** — [GitHub](https://github.com/YOUR_USERNAME) · [LinkedIn](https://linkedin.com/in/YOUR_PROFILE)

*Built as a portfolio project to demonstrate: LLM workflow design, multi-agent architecture, conversational UX, and API integration.*

---

<p align="center">
  <sub>No login. No tracking. No fluff. Just better prompts.</sub>
</p>
