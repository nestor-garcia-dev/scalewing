Scalewing request from Teisoro.

Status: implemented under Teisoro F-002-S05 task 540; pending review and packed-consumer verification.
Renderer: react
Missing surface: `RadioGroup`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: SegmentedControl works for short button toggles but its compact horizontal presentation does not fit longer vertical form options. A raw radio group would require product control styling.
Existing surface this might already be: SegmentedControl.
Workaround I almost used: product-owned control markup and CSS, copied Material behavior, or a value-select that changes the intended semantics.
Teisoro use: NSF payment and record forms plus vault audit resolution.
Proposed API: legend, value, onChange, options (value, label, disabled), description, error.
Behavior and failure boundary: Use native grouped radio inputs with a shared name, one selected value, and correct keyboard behavior. Keep business option values and localized labels in Teisoro.

Scalewing owns the reusable visual and interaction behavior, typed public API, generated CSS, tests, gallery evidence, and changeset. Teisoro owns localized labels, option values, domain validation, role-filtered presentation, and API authorization. Verify packed packages in a disposable Teisoro worktree before the coordinated S05 release.

## Follow-up request (2026-09-28, Teisoro F-007-S05 task 1350): a glyph per option

Status: merged in #75 (2026-09-28) and released in `@scalewing/react` 1.13.0; Teisoro pins it in F-007-S05.
Source: Teisoro UX re-review `services-check-cashing.md`, finding CHK-13 (partly fixed, the Scalewing part). The check-cashing company choice is still `group "Select company"` with `button … [pressed]` toggles, "which task 1325 leaves because Scalewing's `RadioGroup` takes text-only options". The first review's suggested fix was a real radio group with the name and the type glyph in each option.

Teisoro use: the check-cashing form's check type, personal or company (`apps/teisoro-web/src/app/check-cashing/ChecksSection.tsx`), each with a Lucide glyph (a person, a building) beside the words.

Proposed and implemented API (optional, no default change): `RadioGroupOption` gains `icon?: ReactNode`. When set, it renders in `<span aria-hidden="true" class="sw-radio-group-icon">` between the radio's mark and the label text, inside the option's `<label>`: in the text color (`currentColor` for a stroked glyph), centred on the label line, spaced by the option's own gap. The radio's accessible name stays the `label` text, because the glyph is hidden, even when it carries a `<title>`; a press on the glyph chooses the option as the words do. A disabled option fades its glyph with the rest of the option. In forced colors the glyph follows the forced text color.

Rejected alternatives:

- `label: ReactNode`. The label is also the option's accessible name, and it is the text the gallery, tests and the consumer find the option by; a node would let the name drift from the words (or carry the glyph's title into it) and make an empty name possible. A separate slot keeps `label` a string.
- A card-style option with a description and a badge (the first review's fuller suggestion). Teisoro's re-review asks only for the glyph; a description line can come as its own prop when a consumer asks for it.
- Keeping pressed `Button` toggles. They are not a radio group: no arrow keys between choices, no single tab stop, and each is announced as a toggle button rather than one choice of two.

Evidence: `radio-group.test.tsx` ("RadioGroup option icons": the radio's name is the label even with an `svg` `<title>` in the glyph, the slot is `aria-hidden` and sits between the control and the text, an option without an icon has no slot, and a press on the glyph chooses the option; the generated slot in the text color and its catalog class); `apps/gallery/e2e/radio-group.spec.ts` "RadioGroup options show a glyph beside the label, named by the label" on desktop-en, mobile-es and forced-colors (emulated), with the gallery's new "Sighting source" (Field observer, Camera trap, drawn with the gallery's one shared `Glyph`, which the Toast, StatTile and DenominationGrid sections now use too instead of their own copies): exact names, the hidden glyph visible between the mark and the words and centred on the label line, the same color as the words, and a press on the glyph checks "Camera trap".

## Follow-up request (2026-09-29, Teisoro F-007-S05 task 1365): a description per option

Status: implemented on `claude/radio-option-description` for Teisoro F-007-S05 task 1365; pull request pending review.
Source: Teisoro's check cashing. The customer picks the company whose check they are cashing from a `RadioGroup`; each option reads "{company} · {type}" with a building or person glyph. Each company has a history, such as "Most recent" or "2 checks · last Sep 13, 2026". Today Teisoro can only put it in the group's `description`, under the whole group, where it reads as belonging to the last option. The owner approved showing each option's own history on its row.

Teisoro use: the check-cashing company choice (`apps/teisoro-web/src/app/check-cashing/ChecksSection.tsx`): each company's history as its option's description, "Most recent" as a small `Badge`.

Proposed and implemented API (optional, no default change): `RadioGroupOption` gains `description?: ReactNode`. When set:

- The label text and the description share a wrapping body (`sw-radio-group-body`, a flex row that wraps) after the radio and the glyph. The label grows, so the description (`sw-radio-group-option-description`, the caption type in the muted color) sits at the row's inline end while both fit. When they do not, it wraps to a second line that starts under the label text, not under the radio. The label keeps the first line. Below `md` the description always takes its own line (`flex-basis: 100%` under the shared breakpoint query), so the options on a phone read alike instead of mixing one-line and two-line rows. The option fills the group's width, and its radio and glyph stay on the label's line.
- The radio's accessible name stays the `label` text: the input takes `aria-labelledby` on the label text, since the description sits inside the `<label>` and would otherwise join the name. The description is the input's `aria-describedby`, so a screen reader reads it with its radio. A press on it chooses the option, as the label does. A disabled option fades its description with the rest of the option. In forced colors the muted caption follows the forced text color.
- The body's items align to its line's start, not a shared baseline, and a caption line is centred on the label's line box, so a description taller than the label (a default-size `Badge`, 28 px) grows the row downward and the label stays on the radio's line.
- `undefined`, `null`, `false`, `true` and `''` are no description; any other node is one, `0` included (React renders it) and a component that renders nothing included, so a consumer passes `undefined` when there is nothing to say.
- Without a description the option's markup is unchanged: no body, no `aria-labelledby`, no id on the label text.

Why `ReactNode` rather than a string and a `badge` slot: the description is never the accessible name, so a node cannot make the name drift or go empty (the reason `label` stays a string). Its text, a badge's included, is the accessible description, which is what a reader should hear. A node lets Teisoro write "Most recent" as a `Badge` and a plain history as text without Scalewing choosing the badge's tone, size or position, and it matches `icon`. The limit is the one any label content has: phrasing content only, nothing interactive, because it sits inside the `<label>`. The README and the prop's doc comment say so.

Rejected alternatives:

- `description: string` plus `badge?: ReactNode`: two slots for one line of secondary text, and Scalewing would have to pick where the badge goes and how it wraps.
- A media query alone (description on the row from `md` up, under it below): a long history beside a long label would overflow or squeeze the label on a desktop. The natural wrap handles that at any width, and the `md` rule only keeps a phone's rows alike.
- Placing the description outside the `<label>`: a press on it would not choose the option.

Evidence: `radio-group-description.test.tsx` (each radio's accessible description is its own description and its name is the label alone, a `Badge` included; the body after the glyph with the label then the description; an option without a description unchanged; a press on the description, or on the badge, chooses the option and a disabled one ignores it; the generated rules and catalog classes; muted at 4.5:1 or more on the page, a surface and a glass card over the page, for every palette in light and dark with `forEveryTheme()`); `apps/gallery/e2e/radio-group.spec.ts` "RadioGroup option descriptions sit on their own option, describe its radio and choose it" on desktop-en, mobile-es and forced-colors (emulated), with the gallery's "Sighting source" (a "Most recent" badge, a history, and a disabled "Acoustic monitor"), the same options in a narrow card column ("Den survey source"), and an Arabic right-to-left group: the exact name and the accessible description; on the same row at the inline end on desktop and on a second line starting under the label text on a phone (under it in the narrow column everywhere; at the left end and right-aligned under the text in right to left); the muted token color (`CanvasText` in forced colors); 4.5:1 or more for the caption and the badge; a press on the description and on the badge chooses its option; the disabled option faded and not chosen by a press. The phone check fails without the `md` rule, and the name check fails without `aria-labelledby`.

Code review of the pull request (2026-09-29), fixed in a follow-up commit: with baseline alignment a default-size `Badge` pushed the label about 4 px below the radio from md up, so the body now aligns to the line's start (the gallery adds "Drone survey" with a default-size "Trial" badge, and the e2e checks every described option's label centre within 2 px of its radio's, which fails at 4 px under baseline alignment); `Boolean(description)` dropped `0`, so the check is now "React renders something", with unit tests for `0`, `false`, `true`, `''` and `null`; and the README example and unit tests use gallery sample copy instead of Teisoro's.
