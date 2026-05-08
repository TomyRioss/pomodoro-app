@AGENTS.md

# Project Rules

## Communication
- Always invoke `/caveman ultra` skill every response.
- Be concrete and direct. Verbose responses are unacceptable.
- Never do more than asked. Follow requirements to the letter.
- Always explain what you want to do, what it solves, and how — before proposing a plan. Plans without this will be rejected.

## Errors
- Always catch errors with both console feedback and visual UX/UI feedback (toast, banner, inline message).

## Third-party Libraries
- Always investigate if a third-party library exists for logic/UI problems. Propose it before implementing from scratch.

## Components & Styling
- Always use **shadcn/ui** for general prebuilt components.
- Always use **TailwindCSS** for all styling. Never write raw CSS. Never touch `global.css`.
- Never create components larger than 500 lines. Modularize.
- Use MVC methodology and modular components.

## Responsive Design
- Always design mobile-first and responsive for both mobile and desktop.

## Database
- Always ask before making any database changes. Only proceed with explicit user consent (explicit message).

## Research
- For any unknown problem, search the internet and communities (Stack Overflow, Reddit, etc.) before implementing.

## Skills & Agents

### Database
Use `supabase/agent-skills` skill with `claude-sonnet-4-6` model + Supabase MCP.
Examples: Supabase Auth with Next.js, adding indexes to tables.

### Browser Testing
Use `playwright` skill with `claude-haiku-4-5` model, minimum token usage.
Tip: combine with `/caveman ultra` to maximize token savings.

### Code Review & Audit
Use `code-simplifier` and `code-review` skills with `claude-haiku-4-5` model.

### Git & GitHub
Use `commit-commands` skill + GitHub MCP for commits and GitHub actions.

### Design & UI/UX
Use `frontend-design` skill, `superpowers:brainstorming` for design thinking, and `expo-design` skill.
