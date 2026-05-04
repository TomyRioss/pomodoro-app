# SPEC.md — Pomodoro App

## §G — Goal

Web pomodoro timer: configurable work/break durations, soft alarm on completion, task list with estimated time and completion toggle. Stack: Next.js 16 + React 19 + Tailwind 4 + TypeScript.

## §C — Constraints

- Palette: pastel red (#E8A0A0 or similar) + light green (#A8D5A2 or similar). No harsh saturated colors.
- No SVG unless explicitly requested.
- No DB, no backend, no Prisma. State in-memory / localStorage only.
- No OpenAI calls for now. .env key reserved for future use.
- No external audio libraries — use Web Audio API or HTML5 audio.
- All UI components in `app/` or `components/`.

## §I — Interfaces

| id | surface | notes |
|----|---------|-------|
| I1 | TimerDisplay | Shows MM:SS countdown, work vs break mode label |
| I2 | TimerControls | Start / Pause / Reset buttons |
| I3 | TimerConfig | Input fields: work duration (min), break duration (min) |
| I4 | AlarmSound | Soft tone on timer end via Web Audio API |
| I5 | TaskList | List of tasks: name, estimated time (min), done toggle (strikethrough) |
| I6 | TaskForm | Add task: name + estimated time |

## §V — Invariants

- V1: Timer never goes below 00:00. On reaching 0 → emit alarm, switch mode (work↔break), auto-start break.
- V2: Work duration and break duration must be positive integers (min ≥ 1).
- V3: Alarm plays once per timer completion, not on manual reset.
- V4: Task list persists across page refreshes (localStorage).
- V5: Done tasks show strikethrough style, not removed from list.
- V6: UI palette: ONLY pastel red (#E8A0A0) + light green (#A8D5A2). No other colors. Text: black (#1a1a1a) or white (#fff) only. Page bg = mode color. Cards = white.

## §T — Tasks

| id | status | task | cites |
|----|--------|------|-------|
| T1 | x | Scaffold layout: header, timer section, task section | I1,I2,I3 |
| T2 | x | Implement countdown timer hook (useTimer) with work/break state | V1,V2,I1 |
| T3 | x | Build TimerDisplay + TimerControls components | I1,I2 |
| T4 | x | Build TimerConfig inputs with validation | I3,V2 |
| T5 | x | Implement Web Audio alarm (soft tone) | I4,V3 |
| T6 | x | Build TaskList + TaskForm with localStorage persistence | I5,I6,V4,V5 |
| T7 | x | Apply palette styles globally | V6 |

## §B — Bugs

| id | date | cause | fix |
|----|------|-------|-----|
