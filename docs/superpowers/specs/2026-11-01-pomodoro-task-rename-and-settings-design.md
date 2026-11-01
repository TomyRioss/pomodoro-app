# Pomodoro task renaming and timer settings

## Goal

Let users rename created tasks and retain their configured work and break durations after closing and reopening the app.

## Design

- Add an edit control to each task row. It switches the task name to an inline editor with explicit save and cancel controls.
- Enter saves the edited name. Escape cancels. Whitespace-only names are not saved. Saving preserves the task's estimated minutes and completion state.
- Persist task edits through the existing `pomodoro-tasks` localStorage record.
- Persist work and break durations in localStorage and restore them on the next app launch. Do not restore an in-progress countdown.
- Read saved durations after client hydration so server-rendered defaults do not conflict with browser storage. Keep input validation at one minute or more.
- Preserve the existing visual style and keyboard focus behavior.

## Scope and constraints

- No account, backend, or cloud sync.
- No task schema change or change to daily task completion reset behavior.
- Existing unrelated local edits must remain unstaged and uncommitted.
- Commit only the requested feature files and this design document, then push to `origin/main` without force.

## Verification

- Manually rename a task using the edit control and Enter, then confirm its estimate and completion state remain unchanged after reload.
- Cancel a rename with Escape and confirm the original name remains.
- Change both timer durations, reload the app, and confirm both values remain.
- Confirm a fresh browser storage state still starts at the existing 25/5 minute defaults.
