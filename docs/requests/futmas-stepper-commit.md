Scalewing request from FutMas.

Status: implemented for `@scalewing/react` 1.54.0 (accepted 2026-10-25; FutMas F-010-S14 "Rules saving" gap 2: season rules save as you go, one PUT per finished entry; standing owner approval).
Renderer: react
Missing surface: a Stepper callback for a finished entry. An extension of `Stepper`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: `onChange` fires on every typed digit (and with empty or out-of-range counts), so saving on change sends a request per keystroke; `Stepper` has no blur or commit prop, and the − / + presses keep focus in place, so a wrapper's blur never sees them.
Existing surface this might already be: none; `onChange` is the only callback.
Workaround I almost used: `ui/CommitStepper.tsx`, a `Box` round the Stepper catching bubbling blur and Enter, plus its own 600 ms timer after changes.

## Accepted API (2026-10-25)

`Stepper` gains `onCommit?: (value: number | null) => void` and `commitDelay?: number` (ms, default 600).

- `onCommit` fires once per finished entry: on blur, on Enter (a form round the count still submits), and `commitDelay` ms after the last − / + press or step key (ArrowUp, ArrowDown, Home, End); each press restarts the wait, and blur or Enter while it waits commits at once.
- Typed digits never commit by themselves; they wait for blur or Enter.
- It gives the count the consumer holds at that moment, `null` or outside the bounds included (as `onChange` reports typed counts), so validate before saving.
- It does not fire when that count equals the last committed one, or, before any commit, the count held before the first edit. A count the consumer sets while nothing waits (such as a server's answer) becomes the new baseline.
- A commit still waiting when the Stepper unmounts is made then.
- `onChange` is unchanged. A `commitDelay` that is negative or not finite throws a `RangeError`.

Evidence: `stepper-commit.test.tsx` (settled presses, custom delay, typed counts on blur and Enter, null, step keys, unchanged counts, baseline, latest callback, unmount, without onCommit, refused delays); `apps/gallery/e2e/stepper-commit.spec.ts` (presses, Enter, blur, step key in every project); gallery Stepper section "Feeding time, saved as you go".
