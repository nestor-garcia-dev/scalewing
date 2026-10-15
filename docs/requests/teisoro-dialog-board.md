Scalewing request from Teisoro.

Status: released in `@scalewing/react` 1.41.0 (PR #195; accepted 2026-10-14; Teisoro F-012-S23, release M4 "board fidelity", item 10; plan approval under Teisoro decisions O-1, D-1 and D-9).
Renderer: react
Missing surface: four opt-in `Dialog` and `ActionBar` changes:

- a footer that can hold a plain text or status line beside the actions;
- a grey (canvas) body so cards sit on grey;
- a grabber on the phone bottom sheet;
- an `ActionBar` summary that does not throw when its value is empty.

Why Box/Stack/Inline/Card/Text/Button/Field cannot do this:

- The manager sheets' boards put a short line ("saved", "nothing yet") beside the footer actions, lay their cards on the page grey inside the sheet, and draw a grabber on the phone sheet.
- `Dialog` has only `summary` in its footer, the glass or surface fill, and no grabber.
- A screen whose figure is not known yet, such as before a count starts, must pass a placeholder value or leave out the whole summary, because an empty value throws.
- Teisoro's F-012 web stories list these as remaining differences.

Existing surface this might already be:

- `Dialog footer` (actions only: a text line there sits among the buttons, outside the live region);
- `ThemeProvider canvas="grouped"` (paints the page, not a dialog on the top layer);
- `ActionBar status`.

Workaround I almost used:

- a `Text` inside `footer`;
- a grey `Box` around the dialog's children, which would leave the dialog's own padding white;
- a dash as the summary value.

Teisoro use: the manager sheets on phones (bank order, closeout review, settings).
Proposed API: `Dialog status`, `Dialog canvas="grouped"`, `Dialog sheetGrabber`, and an empty summary value meaning "no figure yet".

## Accepted API (2026-10-14)

- `Dialog` gains `status?: ReactNode`.
  - It is one line in the footer after the summary and before the actions, in the footer's existing polite live region (`sw-dialog-footer-note`, muted caption words).
  - It can also be a `Badge` and a short line in one `span`. A status alone makes a footer; nothing (`undefined`, `null`, `false`, or blank words) leaves it out, as in `ActionBar`.
- `Dialog` gains `canvas?: 'default' | 'grouped'` (`ThemeCanvas`, `themeCanvases`, as `ThemeProvider`), default `default` (unchanged).
  - `grouped` (`sw-dialog-canvas-grouped`) fills the dialog with the grouped canvas grey (`var(--sw-canvas-grouped)`), solid with no blur, so `Card`s inside stand apart.
  - A banded title row and the footer keep the surface. Forced colours paint the system canvas.
- `Dialog` gains `sheetGrabber?: boolean`, which needs `sheetBelow`.
  - Below the sheet's breakpoint it draws `sw-dialog-grabber`, a space-6 by space-1 bar on the muted colour at 40 %, centered a space-2 step under the top edge (`CanvasText` in forced colours).
  - It is hidden from assistive technology, does not drag, and stays at the top while the content scrolls (sticky).
  - It sits over a banded title band: a new stacking layer `sheetGrabber`, between `topChrome` and `popup`. The banded title band's top padding grows to space-5 (`sw-dialog-has-grabber`) to keep the gap under the bar.
  - Its margins add up to nothing, so a glass dialog's title keeps its place. From the breakpoint up it is not drawn.
- `ActionBar` and `Dialog` `summary`: an empty `value` (`''` or only spaces) means there is no figure yet.
  - The summary line is left out and the live region stays, so the first figure is announced when it arrives.
  - A blank `label` or `detail`, a non-string `value`, or an unknown `tone` still throws a `RangeError`.
  - Leaving `summary` out (`undefined`) is equivalent and stays the plain way to show no figure; the empty value saves a consumer switching between two shapes. It has a cost: a formatter that returns `''` by mistake hides the figure (and its detail and tone) silently, so format before you pass it.
  - We chose this over drawing the label alone: a label with nothing after it reads as a missing number, and a placeholder figure would be product copy.
- An unknown `canvas`, or `sheetGrabber` without `sheetBelow`, throws a `RangeError`. No new tokens or dependencies.

### Differences from the boards (Teisoro D-2)

- The grabber and the grey are the theme's muted colour and grouped canvas. The sheet keeps Scalewing's padding and title style.

No board figures are quoted here.

Evidence:

- `dialog-board.test.tsx`:
  - an empty value keeps the same empty live region until the first figure;
  - a blank label and a non-string value still refused;
  - the status after the figure and before the actions, a Badge status, and a status-only footer;
  - nothing for `false`;
  - the canvas class and its refusal;
  - the hidden grabber first in the dialog and its refusal without `sheetBelow`;
  - the generated rules with forced colours, and the catalog.
- The `action-bar-summary.test.tsx` refusals, updated for the empty value.
- The gallery "Dialog" section: two roost tally sheets, glass and banded.
- `apps/gallery/e2e/dialog-board.spec.ts` on desktop-en, mobile-es and forced-colors:
  - no figure until the first count, then the figure in the same region;
  - the grouped fill unblurred and apart from the cards, light and dark;
  - the status words at 4.5:1 on the footer;
  - on the phone, the grabber centered a space-2 step under the top edge, above the title, over a banded title band, still there after scrolling, with no sideways scroll at 390 px;
  - from `md` up, no grabber.
