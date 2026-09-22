---
trigger: always_on
---

# MINIMALIST AGENT RULES (COST & ARCHITECTURE OPTIMIZED)

## 1. QUOTA & BUDGET CONTROL (ANTI-BURNING)

- **Max Iterations:** Agent is STRICTLY LIMITED to max 3-5 loops per task. If stuck or error repeats >2 times, STOP immediately and ask the user.
- **Context Preservation:** DO NOT read large log files, `node_modules`, `dist`, `build`, or `.git` directories.
- **Explain-and-Fix:** NO nested error loops. If debugging fails on the first try, stop and output [Root Cause] and [Proposed Fix] for approval.

## 2. CODE ARCHITECTURE & STANDARDS

- **Atomic Law:** MUST ALWAYS use existing customized UI components from `src/shared/ui` (or your project's component folder) and the project's existing CSS tokens. NO inline custom HTML/CSS for primitive elements inside pages.
- **CSS Token Enforcement:** Absolutely NO hardcoded/inline CSS hex colors (e.g. `bg-[#E0E5EC]`, `text-[#3D4852]`) or raw custom shadows (`shadow-[9px_...]`). MUST always use Tailwind configuration tokens (e.g. `bg-background`, `text-foreground`, `text-muted`, `text-primary`, `shadow-neo`, `shadow-neo-inset`, `rounded-button`, `rounded-card`, etc.).
- **Design System Alignment:** Strictly align with the Adaptive Luxury Minimalism Design System described in `DESIGN.md`. Ensure that elements adhere to an editorial flat layout, soft single-direction shadows for interactive elements, and premium glassmorphic overlays without introducing heavy 3D neumorphic clay structures.
- **Skill File Constraints:** SKILL files (e.g., minimalist-ui) are ONLY for learning UI design structure and layout. DO NOT use the colors or specific design tokens mentioned in SKILL files. You MUST strictly use the project's existing color palette and CSS tokens.
- **Tech Stack Guardrails:** Strictly follow Node.js v22.14.0, React 19.1.1, Tailwind CSS ^3.4.18, TypeScript (~5.9.3), Vite (^5.4.8). NO deprecated syntax or mismatched dependencies.
- **No Hardcoding:** Centralize all environment variables (`.env`), API endpoints, and style tokens. Hardcoding sensitive data, magic numbers, or raw style values is STRICTLY FORBIDDEN.

## 3. RULES OF ENGAGEMENT (EXECUTION PIPELINE)

For EVERY task (create/modify file), Agent MUST strictly follow:

1. **Plan Phase:** Analyze request $\rightarrow$ Output a strict **3-bullet plan** (Structure, Logic, API/State) $\rightarrow$ **STOP & WAIT FOR USER APPROVAL.** Do not code yet.
2. **Code Phase:** Once approved $\rightarrow$ Write clean, production-grade code block $\rightarrow$ **STOP.** NO unsolicited explanations, NO layout auto-generation, NO next-step suggestions.
