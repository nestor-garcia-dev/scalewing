Scalewing request from Teisoro.

Status: merged in #75 (2026-09-28) and released in `@scalewing/react` 1.13.0; Teisoro pins it in F-007-S05.
Renderer: react
Surface: a disabled native text control: `Field`'s `<input>`, `<select>` and `<textarea>` (the generated canvas rule), `Field`'s adorned frame, and `DateField`'s entry. No new prop.
Source: Teisoro UX re-review `services-drawer-cash-and-audits.md`, finding DRW-17 (minor, the Scalewing part; Teisoro owns a line in the warning).

## Finding

After a lost answer Teisoro locks the drawer's six count fields and Notes (`disabled`), but they were drawn exactly as in the editable dialog: the glass fill, the same grey solid border, the value in the text color. The generated sheet had a disabled rule for buttons, checkboxes, radio options, segmented items, date fields, switches and filter chips (`--sw-disabled-opacity`), and none for a text control. Nothing said the count could not be changed; typing simply did nothing, and a cashier could read the dialog as frozen and cancel it.

Teisoro use: `apps/teisoro-web/src/app/drawer-support/AuditDialog.tsx`, `AdjustmentDialog.tsx` and `TransferDialog.tsx` (`disabled={locked}` on the count grid and Notes).

## Behavior

- A disabled native text control (`input` of a text type, `select`, `textarea` on the canvas) takes the quiet `--sw-color-subtle` fill, a dashed hairline in the same border color, and `cursor: not-allowed`. The dashed border is the cue that does not depend on color.
- The value keeps the text color and full opacity, so a locked count stays readable: text is 10:1 or more on the subtle fill, and the muted placeholder, prefix and suffix are 4.5:1 or more, in every palette and scheme. WebKit's own disabled fade (`opacity` and `-webkit-text-fill-color`) is set back.
- Every typed input's placeholder (canvas `input` text types and `textarea`) is drawn in `--sw-color-muted` at full opacity, enabled or disabled; `DateField`'s entry already was. The browser's own placeholder is one fixed `#757575` in both schemes, 2.28:1 at the lowest on a field across the palettes (on dark fields), while muted keeps 4.55:1 or more on every palette's field fill over the page or the surface, so no enabled placeholder loses contrast. The code review of PR #75 found the muted-placeholder claim below untrue without this rule.
- `Field`'s adorned frame (`prefix`/`suffix`) draws the same look when its input is disabled; the input inside stays transparent.
- `DateField`'s entry uses the same look in place of the 0.4 opacity it had; its calendar button still fades as a disabled button does.
- In forced colors the dashed border stays and the system's disabled color (`GrayText`) draws the border and the value.

The shared declarations are `disabledControlSurface` and `disabledControlForcedColors` in `css/css-document.ts`, beside `controlSurface`, so the canvas, the adorned frame and `DateField` cannot drift apart.

## Rejected alternatives

- The 0.4 `--sw-disabled-opacity` the buttons use (the review's explicit "not"). It fades the value, which the person still needs to read, under 4.5:1.
- A lighter border only. Border color alone is under 3:1 in every palette and disappears in forced colors; the dashed style survives both.
- A lock glyph inside the frame. It is product iconography, takes room from the value, and needs a name of its own.

## Evidence

`field.test.tsx` ("disabled text controls": the canvas rule fills, dashes and keeps opacity 1 without `--sw-disabled-opacity`, the adorned frame and `DateField` entry carry it, forced colors keep the dashed border in `GrayText`, text and muted are at least 4.5:1 on the fill for every palette × light and dark (the shared test-only `forEveryTheme` loop over `createTheme`), and the typed-input placeholder rule is muted at opacity 1); `apps/gallery/e2e/field.spec.ts` "a disabled Field looks locked and keeps its value readable" (the gallery's "Disabled control", new disabled "Recorded habitat" `<select>` and "Survey notes" `<textarea>`, and new adorned "Counted nests": dashed against the editable field's solid border, not-allowed, opacity 1, a different fill, and the value at 4.5:1 or more on the painted background; with forced colors emulated, still dashed and opacity 1 with a border color apart from the editable field's; the textarea's placeholder computes to the muted token) and `date-field.spec.ts` "a disabled DateField entry looks locked as a disabled Field does", on desktop-en, mobile-es and forced-colors.
