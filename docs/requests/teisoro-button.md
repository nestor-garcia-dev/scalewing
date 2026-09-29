Scalewing request from Teisoro.

Status: merged in #73 (2026-09-28) and released in `@scalewing/react` 1.12.0; Teisoro pins it in F-007-S05 task 1340.
Renderer: react
Surface: `Button` with `aria-pressed` (a toggle button). No new prop.
Source: Teisoro UX review `services-nsf.md`, finding NSF-1 (major, WCAG 1.4.3), the Scalewing part for buttons. The badge on a filled button is `teisoro-badge.md`, the quiet filter chip `teisoro-filter-chips.md`.

## Finding

The generated stylesheet faded every unpressed toggle button: `.sw-button[aria-pressed='false'] { opacity: var(--sw-quiet-opacity) }` (0.55). The label and any badge inside it faded with the fill, so pressable controls read as disabled and failed text contrast: Teisoro's risk-management party rows (names at 3.8:1, badges 2.4:1 to 2.8:1), the check table's "Select", and the sign-in page's unpressed "English", all at about 3.8:1 against the 4.5:1 text needs. None of them is disabled.

Teisoro use: `apps/teisoro-web/src/app/risk/RiskEntityColumn.tsx` (`PartyButton`), `NsfRecordPage.tsx` ("Select"), `LoginPage.tsx` (language), and `check-cashing/ChecksSection.tsx` (the company choice), which gives both states `variant="secondary"` and so relied on the fade alone.

## Behavior

- An unpressed toggle button is drawn at full strength: the fade is gone, so its label keeps the contrast its variant has (4.5:1 by the token contrast tests).
- The pressed button gets an accent ring outside its fill whatever its variant: `box-shadow: 0 0 0 2px var(--sw-color-background), 0 0 0 4px var(--sw-color-accent)`, a 2 px gap in the page background and a 2 px accent ring. The ring touches only the background (the gap inside, the page outside), so it keeps the accent's contrast on the canvas, at least 4.5:1 in every palette and scheme (above the 3:1 WCAG 1.4.11 asks for a state indicator), on every variant's fill. A consumer that uses the same variant for both states (Teisoro's company choice) still shows which one is pressed.
- The ring takes the space the focus outline uses, so a focused pressed button moves its outline out by the ring's 4 px (`outline-offset: calc(var(--sw-focus-ring-offset) + 4px)`); the two stay apart.
- In forced colors, which drop box shadows, the pressed button is filled with `Highlight` and `HighlightText`, as a checked `FilterChips` chip, `Checkbox` or `Switch` is; the button stays under forced colors (no `forced-color-adjust: none`).

The first version of this change (review of PR #73) drew an inset 1 px ring and the border in the accent: on a `primary` fill that was 1.00:1 against the fill, and it was barely visible on `danger`, `tertiary` and the `signal` palette's filled `secondary`. It also opted the pressed button out of forced colors.

No API change. `--sw-quiet-opacity` stays for the muted zero cells of `DenominationGrid`.

## Rejected alternatives

- Fading only the unpressed button's fill or border. The secondary fill is the surface color, so a faded fill is invisible, and a faded border drops the control's own boundary under 3:1.
- Relying only on the consumer's variant choice. A consumer that keeps one variant would lose every visual difference between the states once the fade is gone.
- A check glyph in the pressed button. It changes the button's width when pressed and is product copy in a design-system control; the ring is enough and keeps widths stable.
- Making `Text` inherit its color inside a button (the review's optional part). `Text` always setting `color` is how every other surface gets its tone; changing that default is a separate change across all surfaces. Teisoro renders the name as a plain span in `PartyButton`.

## Evidence

`css/stylesheet.test.ts` (no `aria-pressed='false'` rule, the outset ring, the focus offset, the forced-colors fill, no `forced-color-adjust` in the button's CSS); `button.test.tsx` (aria-pressed reaches the native button; the generated ring is outside the fill past a gap, and it is at least 3:1 against the gap and the page for every variant × every palette × light and dark, from `createTheme`); `apps/gallery/e2e/button.spec.ts` on desktop-en, mobile-es and forced-colors, with the gallery's new "Preferred habitat" toggle group of three `secondary` buttons: the unpressed button has opacity 1 and its label and the pressed one's are at least 4.5:1 against the painted background; the pressed button carries two outset shadows ending in a 4 px accent ring, and so does the pressed `primary` in the new "Survey shift" pair (the system highlight fill in forced colors); a focused pressed button's outline offset is 6 px; pressing another moves the ring.

## Follow-up (2026-09-28, Teisoro F-007-S05 task 1350): the pressed label in forced colors

Status: implemented on `claude/services-rereview-fixes` for Teisoro F-007-S05 task 1350; pull request pending review.
Source: found while verifying the Services re-review fixes (PR #75), a regression from this request's 1.12.0 change. With forced colors active, a pressed toggle's label disappeared: the gallery's pressed "Select c-221" and "Forest", and the "Marsh" label beside its badge, showed as an empty light box inside a dark pill.

Cause: in forced colors the pressed rule filled the button with `Highlight` and set `color: HighlightText`. Chromium paints the forced-colors backplate behind a `<button>`'s text in `Canvas`, so the label was `HighlightText` on `Canvas`, measured at 1.00:1 on the painted pixels. The computed colors say 11:1, which is why the 1.12.0 e2e check (`textContrast`, computed colors) passed. A `FilterChips` chip, a `<span>` face, draws the same pair readably, at 11.31:1 painted. Teisoro's pressed toggles were affected: the NSF check picker's "Select", the risk party rows and the company choice.

Behavior (no API change):

- In forced colors a pressed button keeps the forced `ButtonFace` and `ButtonText` every other button has. Its label, a glyph in `currentColor`, and a label or badge in their own elements all paint at 21:1 in the emulated scheme.
- The pressed state is the same ring the page draws outside forced colors, drawn with a border because forced colors drop shadows: a `::after` with a 2 px `Highlight` border, out of flow (`position: absolute`, `inset: calc(-1px - 4px)`, `pointer-events: none`), past the same 2 px gap. The button's own border turns `Highlight` too. The ring's outer edge is the shadow ring's, so a focused pressed button's outline, 4 px further out, still clears it.
- Nothing sets `forced-color-adjust`, so no descendant keeps author colors (the code review of #73 removed that). `pressedRingGap` joins `pressedRingWidth` as the shared geometry.

Rejected alternatives (each was drawn and measured on the painted pixels in the forced-colors gallery):

- Keeping the `Highlight` fill and dropping `HighlightText`. The label is forced to `ButtonText` on its `Canvas` backplate: readable (21:1), but a light box sits inside the dark pill.
- `forced-color-adjust: none` on the pressed button, restoring `auto` on every descendant. The button's own text paints at 11.31:1, but a label inside a `<span>` (Teisoro's `PartyButton`, the gallery's "Marsh") gets its own `Canvas` backplate behind `HighlightText` and is invisible again (1.00:1). With `none` inherited instead, the whole subtree keeps author colors, as #73's review found, and the author accent shadow comes back.
- A `Highlight` outline for the pressed state. It is readable, but the focus outline uses the same property, so a focused pressed button would lose one of the two cues.

Evidence: `button.test.tsx` ("pressed toggle in forced colors": the forced block sets no background, `HighlightText` or `color`; no `forced-color-adjust` in the button's CSS; the `::after` ring is a `Highlight` border whose width and inset follow `pressedRingGap` and `pressedRingWidth`, and the pressed focus offset still clears it); `css/stylesheet.test.ts` (the forced-colors pressed rule); `apps/gallery/e2e/contrast.ts` gains `paintedTextContrast`, which screenshots a text box and returns the ratio between its lightest and darkest pixels, so it sees the backplate; `apps/gallery/e2e/button.spec.ts`, with `emulateMedia({ forcedColors: 'active' })`: "a pressed toggle Button keeps its label readable in forced colors" measures the pressed "Forest" (secondary), "Day" (primary), and "Marsh"'s label span and badge at 4.5:1 or more painted, and fails at 1.00:1 against the 1.12.0 rule. The toggle test's forced-colors branch checks the `::after` ring (`Highlight`, solid, 2 px), none on an unpressed button, and the `Highlight` border.
