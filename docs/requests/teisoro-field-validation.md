Scalewing request from Teisoro.

Status: implemented and verified under Teisoro F-002-S05 task 600; pending independent review and commit.
Renderer: react
Missing surface: `Field description and validation`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: Existing Field labels children but does not own stable description/error IDs, invalid association, or generated validation styling. A second product form wrapper would duplicate this logic.
Existing surface this might already be: Field.
Workaround I almost used: product-owned control markup and CSS, copied Material behavior, or a value-select that changes the intended semantics.
Teisoro use: Closeout, employee, Services, check-cashing, and vault forms with hints and errors.
Proposed API: extend Field with description, error, required, and documented input association.
Behavior and failure boundary: Create stable IDs, announce description/error correctly, avoid duplicate or stale errors, and style invalid state from tokens. Keep validation rules in the consumer/API.

Scalewing owns the reusable visual and interaction behavior, typed public API, generated CSS, tests, gallery evidence, and changeset. Teisoro owns localized labels, option values, domain validation, role-filtered presentation, and API authorization. Verify packed packages in a disposable Teisoro worktree before the coordinated S05 release.

Verification on 2026-09-19: `pnpm check` passed format, lint, 30 token tests, 86 React tests, 37 native tests, three gallery tests, builds, and typechecks. `pnpm --filter @scalewing/gallery test:browser` passed 27 Chromium runs across desktop English, mobile Spanish, and forced-colors projects; the Field mobile error screenshot was inspected. Browser checks prove stable hint/error association, required and invalid states, label focus, error clearing, and a visible invalid border. Built `@scalewing/tokens` and `@scalewing/react` tarballs were installed via temporary overrides in a disposable detached Teisoro worktree. `pnpm verify:react` passed lint, 346 React unit tests at 100% coverage, boundary check, build, and 25 Chromium E2E journeys. The Teisoro task records the final review fingerprint and commit hash after commit.

## Follow-up request (2026-09-28, Teisoro F-007-S05 task 1335): one announcement per submit

Status: merged in #73 (2026-09-28) and released in `@scalewing/react` 1.12.0; Teisoro pins it in F-007-S05 task 1340.
Source: Teisoro UX reviews `services-check-cashing.md`, finding CHK-3 (major, WCAG 3.3.1 and 2.4.3, the Scalewing part), and `services-drawer-cash-and-audits.md`, finding DRW-6 (minor, WCAG 3.3.1 and 4.1.3, the Scalewing part).

`Field` rendered every error with `role="alert"`, while `Checkbox`, `RadioGroup` and `DateField` tied their errors to the control without one. Two problems followed. A refused submit with several invalid fields fired several alerts at once (the new-customer form: three), so a screen reader read a pile of errors or only the last. And on a form that mixed a `Field` and a `Checkbox`, only the `Field` error was announced (the drawer audit: the recount checkbox's error was silent, the notes error was read).

Behavior:

- No field error is `role="alert"` any more. Every field control (`Field`, `Checkbox`, `RadioGroup`, `DateField`; `Select`'s new `error` in `teisoro-select.md` follows) keeps its error in a polite live region, the internal `FieldErrorRegion`: a `span` with `aria-live="polite"` that is always rendered, empty while there is no error. The error's text is swapped into it, so a screen reader announces a new error once, politely, whether it appears while the person types (Teisoro's entry form shows "too long" errors live) or after a submit, and several errors from one submit queue politely instead of interrupting as several alerts.
- The control lists the region in `aria-describedby` and sets `aria-invalid` while it has text; `Field` shows the error in place of the hint, as before, but the hint and the error now have their own ids.
- Generated CSS takes an empty region out of the layout (`:empty { position: absolute; }` on `sw-field-error`, `sw-checkbox-error`, `sw-radio-group-error` and `sw-date-field-error`), never out of the accessibility tree, which would stop the announcement. `RadioGroup`'s invalid marks now key off the fieldset's `aria-invalid` instead of the error element's presence.
- The form still owns the refused submit: it moves focus to the first invalid control, or to one form-level summary, once per attempt. No API change.

The first version of this change (review of PR #73) only dropped `role="alert"`, so an error that appeared while typing was never announced; `Checkbox`, `RadioGroup` and `DateField` had the same gap.

Rejected alternatives:

- Giving `Checkbox` `role="alert"` as well (DRW-6's suggestion). It makes the two consistent by making the pile of alerts larger; CHK-3 is the other half of the same problem.
- A form-level error summary component in Scalewing now. It is a new public surface and needs its own request; focusing the first invalid control already meets WCAG 3.3.1 and 2.4.3, and Teisoro's `FormShell` owns that step.
- Rendering the region only while there is an error. A live region that is inserted together with its text is not reliably announced; it must exist first.
- Hiding the empty region with `display: none` or `hidden`. That removes it from the accessibility tree, and the text swapped in would not be announced.
- A `live` prop on `Field` to keep the alert opt-in. A single field validated on blur is the only case where it helps, and the consumer can announce that itself; a prop would keep the several-alerts trap one flag away.

Consumer note: a product that relied on `Field`'s alert to announce a refused submit gets a polite announcement instead, and should also move focus to the first invalid control. A test that found the error by the hint's id should find it by its text. Teisoro's CHK-3 and DRW-6 fixes do that (`FormShell`, `create()`, `add()`).

Evidence: `field-error-region.test.tsx` (for `Field`, `Checkbox`, `RadioGroup` and `DateField`: the region exists, empty and `aria-live="polite"`, before the error and is not in `aria-describedby`; the error's text is swapped into the same element, which the control then lists with `aria-invalid="true"`; no `alert`; the region empties again); `field.test.tsx` (the error replaces the hint on screen in the region that existed before; the hint's id returns after); `checkbox.test.tsx` (the checkbox's description includes its error, no `alert`); `css/stylesheet.test.ts` (the empty-region rules, `RadioGroup`'s `aria-invalid` selector); `apps/gallery/e2e/field.spec.ts` and `checkbox.spec.ts` on desktop-en, mobile-es and forced-colors: the invalid input and the invalid checkbox have their error as the accessible description, `aria-invalid="true"`, and the section has no `alert`; the input's polite region exists empty before "Validate sighting", holds the error after it, and empties again without moving the button below (the empty region takes no room); the checkbox's region stays, empty and polite, once it is ticked.

## Follow-up request (2026-09-30, Teisoro F-007-S05 task 1375): an invalid field without its own message

Status: merged in #83 (2026-09-30) and released in `@scalewing/react` 1.16.0; Teisoro adopts it next.
Source: Teisoro UX final check `services-drawer-cash-and-audits.md`, finding DRW-18 (minor, WCAG 3.3.1), the part left for Scalewing: "The count fields themselves get no red border; the caption sits in the total box under them" (`admin/06-…dialog.png`, `closed-refusal/01-a-count-of-zero-refused.dialog.png`).

Teisoro need: when a drawer dialog's count adds up to nothing, "Enter at least one bill or coin." is one message for the whole group, shown under the grid, and every count field is in error. Teisoro's `DenominationEntryGrid` (`apps/teisoro-web/src/app/drawer-forms/DenominationEntryGrid.tsx`) marks the group `data-invalid` so focus lands on its first field, but each `Field` shows the danger border and sets `aria-invalid` only when it renders its own `error` message; ten copies of the sentence would be noise.

Existing surface this might already be: `Field` `error`, which always renders its message; and the child's own `aria-invalid`, which `Field` passes through but which draws no border (the border comes from `sw-field-invalid`, set only by `error`). Teisoro owns no CSS.

Proposed and implemented API (optional, no default change): `invalid?: boolean` on `Field`, named after the state it sets (`aria-invalid`), as `required` sets `required`. With it:

- the control gets `aria-invalid="true"` and the field `sw-field-invalid`, so the same danger border as `error` (on the frame of a `prefix`/`suffix` field too, and `Mark` in forced colors);
- no message: the field's polite error region stays empty, its `description` stays on screen and keeps describing the control, and the consumer's own `aria-describedby` is kept, so it can point at the group's message;
- `error` implies it (`invalid={false}` never clears an error's state); like `error`, it needs one native control child, or `Field` throws a `TypeError`.

Rejected alternatives:

- Letting the child's `aria-invalid` draw the border. It would work without API, but `Field` owns its control's validation state (`error` overrides the child's `aria-invalid`), and a prop beside `error` and `required` is the discoverable, typed way; the child's attribute still passes through as before.
- `error=""` or `error={true}` to mean "invalid without a message". An empty string is no error everywhere in Scalewing (`Select`, `SegmentedControl`), and a boolean would make `error` two types.
- A group-level error on `Grid` or a new `FieldGroup`. Teisoro's group already renders its message and focus rule; what was missing is the per-field state, and a group component is a larger surface for one prop's worth of need.
- Repeating the group's message under every field. Ten identical messages on a phone, each announced.

Evidence: `field.test.tsx` ("marks a control invalid without a message of its own": `aria-invalid`, the class, an empty region and the consumer's `aria-describedby` kept; "keeps its hint while invalid, and clears the state when invalid goes"; "lets error win over invalid, and invalid mark an adorned frame"; "rejects invalid on a child that is not one native control"); `apps/gallery/e2e/field.spec.ts` "Field invalid marks a control without a message of its own" on desktop-en, mobile-es and forced-colors, with the gallery's new "Nest count" group (Eggs and Chicks, one message under the group): after "Check nest count" both fields have `aria-invalid`, the group's message as their accessible description, a changed border (the danger token outside forced colors) and an empty region of their own; the message shows once and there is no alert; a count clears both states and the border.

### Revision after the code review of PR #83 (2026-09-30)

Failing early: the first version threw its `TypeError` for a non-native child only once `invalid` turned true, so a form that validates a group would render fine while valid and crash on its first failed submit. `Field` now checks whether `invalid` was passed (even as `invalid={false}`, but not as `invalid={undefined}`, so a wrapper that forwards an optional `invalid` does not throw) and requires one native control from the first render. `invalid` is new, so no working consumer passes it yet.

`error` keeps its existing rule: it requires the native control only while it holds a message, so `error={undefined}` beside a composed child still renders. (A first revision applied the early failure to `error` too; the coordinator's review of it rejected that, because it would throw in working consumer code, which a minor release cannot do.)

Evidence: `field.test.tsx` "rejects a validated non-native child on its first, valid render" (`invalid={false}` beside a `span` throws; the same child without it renders), "treats invalid={undefined} as not passed, for a wrapper forwarding it" and "keeps rendering a composed child beside error={undefined}, as before" (it renders; with a message it throws, as it always did).

Parity: `invalid` exists on `Field` only. `DateField`, `Select`, `SegmentedControl`, `RadioGroup` and `Checkbox` have `error` but no `invalid`; each can gain the same prop, with the same meaning (`aria-invalid` and its danger outline without a message), when a consumer asks for it. Not built now: Teisoro's group error is a grid of `Field`s.

## Follow-up request (2026-10-08, Teisoro F-006-S11 task 1875): a changed value

Status: merged in #101 (2026-10-09) and released in `@scalewing/react` 1.22.0 for Teisoro F-006-S11 task 1875; Teisoro pins and adopts it in task 1880.
Source: Teisoro UX review `admin-correction.md`, finding COR-5 (minor; the Scalewing part). In an admin's correction of a finalized register closeout, a changed field looks like every other once the focus leaves it. F-007 task 1635 shows "Was 25" under each changed field and counts the changes on the action bar; the review also asked for "Scalewing's accent border or a dot" on the field, which `Field` cannot draw (it has `invalid`, the danger border, only).

Teisoro need: the correction's changed fields (the POS amounts, the card totals) marked at a glance, beside their "Was …" words.

Proposed API: `changed?: boolean` on `Field`.

Behavior and failure boundary: `sw-field-changed` on the field sets the native control's border (`[data-theme] .sw-field-changed > :is(input, select, textarea)`) or an adorned frame's (`.sw-field-changed .sw-field-adorned`) to the accent and adds `inset 0 0 0 1px` of it, so the border reads a hairline thicker without changing the control's size. A focused native control keeps the canvas's `box-shadow: none` and its focus ring. `invalid` and `error` win: the field then carries only `sw-field-invalid`. Forced colors draw `Highlight`. No ARIA state: "changed" is not an accessibility state, and the consumer's description says what the value was. Passing `changed` (even `false`, not `undefined`) requires a native control child from the first render, as `invalid` does.

Rejected alternatives:

- A dot beside the label. A second mark in another place; the border is where the eye already is, and the words are under it.
- Reusing `invalid` with another tone. A changed value is not invalid, and `aria-invalid` would say it is.
- A tinted fill. The control's fill is the canvas's glass; a tint would change the value's contrast.

Evidence: `field-changed.test.tsx` (the class and the description; an adorned field; `invalid` and `error` win; the native-control rule; the generated rules); `apps/gallery/e2e/field.spec.ts` "Field changed marks a corrected value with the accent border, and says what it was" on desktop-en, mobile-es and forced-colors: typing 26 over the saved 25 changes the border color, adds the inset shadow, keeps the box, describes the field "Was 25" and counts "1 value changed"; the adorned weight's frame changes color too; typing 25 again removes the mark.

## Follow-up request (2026-10-09, Teisoro F-006-S11 task 1890): a changed value that does not read as focus

Status: implemented on `teisoro/f006-s11-review-findings` for Teisoro F-006-S11 task 1890; awaiting review, merge and a `@scalewing/react` minor release.
Source: Teisoro's storyboard re-review of F-006-S11 (task 1890). `sw-field-changed` drew the accent border a hairline thicker, and the focus ring is the same accent, doubled; once the person tabs to the next field, two fields are outlined in the accent, and "changed" reads as "where I am".

Teisoro need: the correction's changed fields marked so they read apart from the focused one at a glance, still beside their "Was …" words.

Decision: keep the accent border and its inset hairline, and tint the control's fill with the accent at 12 %. Focus draws a ring and never tints, so the two marks differ in kind, not only in weight. This reverses the earlier rejection of a tinted fill ("a tint would change the value's contrast"): the contrast is now tested in every palette and scheme instead of avoided.

API: none new. `changed` on `Field` keeps its name, its class (`sw-field-changed`) and its rules (`invalid` and `error` win; passing it needs a native control from the first render); only its look changes.

Behavior and failure boundary:

- The tint is a background image, `linear-gradient(color-mix(in srgb, var(--sw-color-accent) 12%, transparent), …)`, over the control's own background color, which stays (the glass fill, or the subtle fill of a disabled control). It is on the native control (`[data-theme] .sw-field-changed > :is(input, textarea)`) or on an adorned frame (`.sw-field-changed .sw-field-adorned`), whose input is transparent, so it shows once. A select lists its chevron's two layers above the tint (`selectChevronLayers`, now shared with the canvas's select rule); the layers are placed from `--sw-select-chevron-inset`, which the select rule sets to space 4 and an `xs` field's to space 3, so a changed `xs` select keeps its chevron where its size puts it. The tint is on the canvas's text controls and the select only, not on a range, color or file input.
- While a placeholder shows (`:placeholder-shown`), there is no value to mark and the fill stays plain, so the muted placeholder keeps its 4.5:1. On the tint (a frame holding a value), an adorned frame's prefix and suffix take the text color, since muted falls to 3.55:1 there.
- The value, in the text color, keeps 6.74:1 or more on the tint over the glass fill (lowest: mocha dark) and 8.16:1 or more over the subtle fill (sunburst dark); a select's muted chevron, a graphic, keeps 3.55:1 (ink dark); the tint stands apart from the plain fill at 1.15:1 or more (synthwave dark). The accent border stays the primary mark.
- Forced colors drop the tint and the shadow (the rules say so; Chromium also drops a gradient image there) and keep the `Highlight` border.
- No ARIA change.

Rejected alternatives:

- A tint with no border. The border is where the eye already looks, and forced colors drop backgrounds.
- A different border color for "changed" (success, or muted). Success says "saved" and muted is weaker than the plain hairline's purpose; the accent is the system's one "this is yours" color.
- Tinting under focus too, or changing the focus ring. The ring is the canvas's one focus mark for every control.
- 16 % as on `CalendarButton`'s range band. A whole control is a larger area than a day cell; 12 % is clearly visible and leaves the muted chevron more room.

Evidence: `field-changed.test.tsx` ("generates the accent border, thicker without moving, a tint over the fill, and forced colors": the tint rule, the select's layers, the prefix and suffix color, no background in a text control's focus rules, the forced-colors resets; "places a changed select's chevron for its size, xs included"; "limits the tint to text controls and a select, and the adornment color to a frame on the tint"; "keeps the value at 4.5:1 on the tint in every palette and scheme"); `calendar-button-range.test.tsx` now shares the compositing helpers in `every-theme.test-support.ts`; `apps/gallery/e2e/field.spec.ts` "Field changed marks a corrected value with the accent border and a tint focus never draws, and says what it was" on desktop-en, mobile-es and forced-colors: the changed "Adult herons" keeps its fill color and gains the tint image, the focused unchanged "Feed weight" frame beside it has its ring and no tint (screenshot `field-changed-beside-focus.png`), a changed field keeps its tint while focused, the adorned frame tints once (its input has no image), the new "Colony habitat" select keeps its chevron above the tint, and the mark goes when the saved value returns; in forced colors no tint image is computed.
