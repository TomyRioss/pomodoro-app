# Pomodoro App

A focused, minimal Pomodoro timer built with Next.js 16, React 19, and TailwindCSS. Designed to keep you in flow — no distractions, no accounts, no cloud sync required.

[![License: MIT](https://img.shields.io/badge/License-MIT-red.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://typescriptlang.org)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen)](CONTRIBUTING.md)

---

## Vision

Most productivity tools add friction. Pomodoro App does the opposite — it gets out of your way. The timer is the hero. Everything else (tasks, sessions, quotes) is secondary and available when you need it.

The project is built on three principles:

- **Accuracy first** — the countdown uses a Web Worker so it never freezes or drifts, even when the browser tab is hidden
- **Zero dependency on your focus** — no account, no server, no internet required after load
- **Open and extensible** — MIT licensed, modular architecture, easy to fork and customize

---

## Features

- **Real-time countdown** — Web Worker based interval, immune to background tab throttling
- **Work / Break modes** — smooth color transitions with alarm on phase completion
- **Circular progress ring** — visual feedback on remaining time
- **Customizable durations** — set work and break minutes independently
- **Alarm tones** — Sharp, Gentle, Bell, Pulse
- **Task list** — add tasks with estimated time, mark done, persisted in `localStorage`
- **Session counter** — tracks completed work + break cycles
- **Motivational quotes** — fetched from API and cached locally for 6 hours
- **Keyboard shortcuts** — `Space` to start/pause or confirm transitions
- **PC-first responsive design** — works on mobile too

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | TailwindCSS 4 |
| UI Components | shadcn/ui (Base UI) |
| Toasts | Sonner |
| Icons | Lucide React |
| Timer | Web Worker (`public/timer-worker.js`) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
git clone https://github.com/TomyRioss/pomodoro-app.git
cd pomodoro-app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
npm start
```

---

## Project Structure

```
app/
  page.tsx              # Main layout and state orchestration
  layout.tsx            # Root layout — TooltipProvider, Toaster
components/
  TimerDisplay.tsx      # Circular progress ring + countdown display
  TimerControls.tsx     # Start/Pause/Reset/Skip controls
  TimerConfig.tsx       # Collapsible settings panel
  TaskList.tsx          # Task management with localStorage
  TaskForm.tsx          # Add task form
  SessionCounter.tsx    # Completed session dot visualization
  MotivationalQuote.tsx # Cached motivational quote
  ui/                   # shadcn/ui components (do not edit manually)
hooks/
  useTimer.ts           # Core timer logic (Web Worker interval)
  useAlarm.ts           # Web Audio API alarm synthesis
public/
  timer-worker.js       # Web Worker — throttle-proof interval
```

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Start / Pause timer |
| `Space` | Confirm phase transition |

---

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting a PR.

- [Report a bug](https://github.com/TomyRioss/pomodoro-app/issues/new?template=bug_report.md)
- [Request a feature](https://github.com/TomyRioss/pomodoro-app/issues/new?template=feature_request.md)
- [Read the contribution guide](CONTRIBUTING.md)

---

## License

[MIT](LICENSE) — free to use, fork, and modify.

---

## Author

**TomyRioss** — [GitHub](https://github.com/TomyRioss)
