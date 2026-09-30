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

Status: merged in #75 (2026-09-28) and released in `@scalewing/react` 1.13.0; Teisoro pins it in F-007-S05.
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

## Follow-up request (2026-09-30, Teisoro F-007-S05 task 1375): a glyph's gap from its label

Status: implemented on `claude/services-leftovers` for Teisoro F-007-S05 task 1375; pull request pending review.
Source: Teisoro UX final check `services-nsf.md`, "Seen and not filed" (app-wide, older than the Services changes): every button with a glyph sets it about 2 px from its label ("Record payment", "Log activity", "Write off", "Buscar"; `logs-a-call-with-a-follow-up-and-lists-it-on-the-record/en-1280/02-the-activity-logged.part-1.png`). `.sw-button` had no `gap` in any release.

Teisoro need: `<Button><Glyph icon={Plus} />{copy.record}</Button>` (for example `NsfListPage.tsx`, `NsfRecordPage.tsx`) reads as one glyph and one label, a consistent space apart. Other Teisoro buttons wrap the two in `<Inline as="span" gap={2} align="center">` (24 of them) or `gap={1}` (the back links), so the product has three spacings for one pattern.

Existing surface this might already be: `Inline` inside the button, which is what Teisoro's wrapped buttons use. It works, but every consumer has to remember it, and the ones that do not get a glyph touching its label; the button is a flex container already, so the gap belongs on it.

Behavior (no API change): `.sw-button` gains `gap: var(--sw-space-2)` (8 px). The button's own children are its flex items, so:

- a glyph and a label passed as direct children sit 8 px apart, at every `size`;
- an icon-only button has one item and is unchanged;
- a glyph and label already wrapped in one element (Teisoro's `<Inline as="span" gap={2}>`) are one item, so there is no second gap: the wrapper's own gap is the only one. The wrapper can be dropped, and the `gap={1}` back links get 8 px once they drop theirs;
- a visually hidden name (`sw-sr-only`, as in `CalendarButton`) is absolutely positioned, out of the flex flow, so it adds no gap and the glyph stays centred;
- an element hidden below a breakpoint (`Box hideBelow="md"`, Teisoro's "Services reports") is `display: none` there, so the icon-only phone button has no gap either.

Migration: nothing breaks. A button whose children are several elements meant to read as one phrase (`Save <strong>draft</strong>`) now shows 8 px between them instead of a word space; keep such a phrase in one element.

Rejected alternatives:

- A gap per `size` (4 px on `xs`). The glyph is the same 16 px at every size, and Teisoro's wrappers use 8 px on every size; one token is the consistent answer the finding asks for.
- An `icon` prop on `Button`. It would fix the gap only for consumers that migrate, add a slot that `children` already covers, and need rules for its position and its name; the gap fixes every existing button.
- `margin-inline-end` on a direct `svg` child. It misses a glyph wrapped in a span and adds space after an icon-only glyph; `gap` separates items only.

Evidence: `button.test.tsx` ("icon-to-label gap": the base rule's `gap: var(--sw-space-2)` on an `inline-flex` button; a glyph and a label stay direct children; a label wrapped in one `Inline` is a single child; the visually hidden declarations are absolutely positioned); `apps/gallery/e2e/button.spec.ts` "a Button sets its glyph one token gap from its label, once" on desktop-en, mobile-es and forced-colors, with the gallery's new "With a glyph" row: "Log sighting" at `xs`, `sm` and `md` has 8 px between the glyph and the first letter, the "Field log" button wrapped in `<Inline as="span" gap={2}>` also 8 px (not 16), and the icon-only "Back to the field log", named by a visually hidden `sw-sr-only` span beside its glyph, keeps the glyph centred. Without the rule the glyph touches the label (0 px).
