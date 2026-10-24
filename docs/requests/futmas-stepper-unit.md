Scalewing request from FutMas.

Status: released in `@scalewing/react` 1.49.0 (PR #245; accepted 2026-10-24; FutMas F-010 "web administration foundation", the first league setup's counts; the owner approved the F-010 canvas v15 and the whole feature on 2026-10-24, with standing approval for Scalewing changes, PRs, merges and publishing).
Renderer: react
Missing surface: `Stepper` `unit`, a short muted word after the count inside the Stepper ("90 min", "7 players").
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: the count is the Stepper's own input; a word placed beside the Stepper sits outside its frame, after +, and is not read with the value. FutMas owns no CSS to draw it inside.
Existing surface this might already be: `Field` `suffix` (a unit inside a native input's frame, but no − and +); `Stepper` `valueText` (says the unit, but draws nothing).
Workaround I almost used: the unit in the label ("Match length (min)"), which crowds the label and still leaves "90" alone in the box.
FutMas use: match length and minutes per half ("min"), players per side ("players") and the field count in the web league and season setup.

## Proposed API (from the brief)

```ts
type StepperProps = {
  // …
  unit?: string;
};
```

## Accepted API (2026-10-24)

The brief's API.

- With `unit`, the count's input and a `span.sw-stepper-unit` sit in one frame (`span.sw-stepper-count`), as `Field`'s suffix: the frame draws the canvas control surface, the focus ring (`:focus-within`), the invalid border, the changed border and tint (the unit taking the text colour on the tint, as a suffix does) and the disabled subtle fill with its dashed edge; the input inside drops its own frame. A press on the unit or the padding focuses the count (not when disabled).
- The unit is the muted colour at the body size, `aria-hidden`; the count's default `aria-valuetext` is the count and the unit ("90 min", the unit trimmed), so it is read once. With no count (an empty box) there is no `aria-valuetext`. A consumer `valueText` still wins; a plural unit ("players") needs it, since the default reads "1 players".
- The input keeps its few-digit width (`5ch`) with its digits against the unit (`text-align: end`), so the frame never follows the count; the pair is centred, also in a `width="full"` Stepper, where the frame fills the column. Every part stays the `md` control height (44 px, also on a coarse pointer). In right-to-left the unit follows the count on the left. Forced colours draw the unit in `CanvasText` and keep `Mark`, `Highlight` and `GrayText` edges on the frame.
- Without `unit` the Stepper is unchanged.

### Deviation from the brief

None in the API. The digits are end-aligned inside their fixed `5ch` box rather than centred, so a short count leaves room before it (" 90 min"); centring would make the frame follow the count's width.

### Classes

`sw-stepper-count`, `sw-stepper-unit`.

### Refused with a `RangeError`

A blank `unit` (empty or whitespace).

No new tokens, public breakpoints or dependencies.
