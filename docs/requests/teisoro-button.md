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
