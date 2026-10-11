Scalewing request from Teisoro.

Status: released in `@scalewing/react` 1.28.0 (PR #121; Teisoro F-011-S03, release R2 "feedback", item 8; the redesign inventory's row 23).
Renderer: react
Missing surface: `Progress` `tone="warning"`. An extension of `Progress` (`teisoro-progress.md`), not a new component.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: the F-011 SignInIdle board warns before an idle sign-out with an alert dialog: "Are you still working?", a countdown sentence ("Teisoro will sign you out in 1:42"), and an orange bar of the time left. `Progress` tones are accent, success and danger; orange (the warning tone, `teisoro-warning-tone.md`) is not one of them, and danger says the wrong thing before anything has gone wrong.
Existing surface this might already be: `Progress` (tones without warning); `Toast` `showRemaining` (a line inside a toast, not a labelled progress bar).
Workaround I almost used: `tone="danger"`.
Teisoro use: the idle sign-out warning (`Dialog role="alertdialog"` with a `Progress tone="warning" showCount={false}` and its own throttled countdown sentence).

## Accepted API (2026-10-11)

- `ProgressTone` gains `'warning'`; `progressTones` (`['accent', 'success', 'warning', 'danger']`) is exported. `tone="warning"` fills the bar with the semantic `warning` color (generated `sw-progress-warning`). Everything else is unchanged.
- An unknown `tone` now throws a `RangeError` (it used to render an unstyled bar).
- The warning fill keeps 3:1 against the bar's track (`border`) in every palette and scheme (`progress.test.tsx`), the non-text contrast floor.
- Differences from the board (Teisoro D-2): the bar stays `space-2` (8) high (the board's is 4). `Progress` always shows its `label` above the bar, where the board has the countdown sentence directly over an unlabelled bar; Teisoro labels the bar with the time-left words ("Time left") and puts its countdown sentence under it (`showCount={false}`), so the dialog has one line the board does not. The fill is the `warning` token (`#B54708` light, `#FDB022` dark) instead of the board's `#FF9500`, on the `border` track instead of `#E5E5EA`. The tightest track contrast is harvest light at 3.05:1, guarded by the test. In forced colors every tone is `Highlight`; the words carry the warning.

Evidence: `progress.test.tsx` (the warning class and rule, 3:1 on the track in every theme, an unknown tone throws); gallery "Progress" ("Daylight left for the count"); `apps/gallery/e2e/progress.spec.ts` on desktop-en, mobile-es and forced-colors (the bar's color resolves to the warning token).
