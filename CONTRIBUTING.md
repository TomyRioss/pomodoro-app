# Contributing to Pomodoro App

Thanks for your interest in contributing. This document explains how to get started.

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Local Setup

```bash
git clone https://github.com/TomyRioss/pomodoro-app.git
cd pomodoro-app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How to Contribute

### Reporting Bugs

Open a [Bug Report issue](https://github.com/TomyRioss/pomodoro-app/issues/new?template=bug_report.md). Include steps to reproduce, expected vs actual behavior, and your environment.

### Suggesting Features

Open a [Feature Request issue](https://github.com/TomyRioss/pomodoro-app/issues/new?template=feature_request.md). Describe the problem it solves and your proposed solution.

### Submitting Pull Requests

1. Fork the repository
2. Create a branch: `git checkout -b feat/your-feature` or `fix/your-bug`
3. Make your changes following the guidelines below
4. Run `npx tsc --noEmit` — must pass with zero errors
5. Push and open a PR against `main`

## Code Guidelines

| Rule | Detail |
|------|--------|
| **Styling** | TailwindCSS only. Never write raw CSS. Never touch `globals.css` |
| **Components** | Max 500 lines per file. Modularize if needed |
| **UI Components** | Use shadcn/ui for prebuilt components |
| **Errors** | Always catch errors. Show visual feedback (toast/banner) + `console.error` |
| **Responsive** | PC-first, but must work on mobile |
| **Architecture** | MVC + modular components |
| **TypeScript** | Strict types. No `any` |

## Project Structure

```
app/
  page.tsx          # Main layout and state orchestration
  layout.tsx        # Root layout (TooltipProvider, Toaster)
  globals.css       # Do not touch — shadcn managed
components/
  TimerDisplay.tsx  # Circular progress ring + countdown
  TimerControls.tsx # Play/Pause/Reset/Skip buttons
  TimerConfig.tsx   # Collapsible settings (duration, alarm tone)
  TaskList.tsx      # Task list with localStorage persistence
  TaskForm.tsx      # Add task form
  SessionCounter.tsx# Completed session dots
  MotivationalQuote.tsx # Fetched quote with cache
  ui/               # shadcn/ui components (do not edit manually)
hooks/
  useTimer.ts       # Core timer logic — Web Worker based interval
  useAlarm.ts       # Alarm sound synthesis
public/
  timer-worker.js   # Web Worker — prevents background tab throttling
```

## Commit Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(component): add X
fix(timer): resolve Y
chore: update deps
docs: update README
```

## Questions

Open a [Discussion](https://github.com/TomyRioss/pomodoro-app/discussions) or email **tomyrios2006@gmail.com**.
