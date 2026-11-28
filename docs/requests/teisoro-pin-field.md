Scalewing request from Teisoro.

Status: released in `@scalewing/react` 1.71.0 (PR #318; accepted 2026-11-27; Teisoro F-010 "counter PIN switching", story S11 "Scalewing pieces", task 3150; the counter PIN component inventory's rows 11, 12, 13 and 21 and its §2; plan approved by the owner under F-010 D-15).
Renderer: react
Missing surface: `PinField`, a labelled entry of a fixed number of digits that never shows them: dots for the digits entered, typed on a keyboard or pressed on an optional on-screen pad.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: `Field` wraps a native input, which either shows the digits (`type="text"`) or is a password field (`type="password"`), and a password field makes the browser and password managers offer to save a short PIN over the account's real password. A consumer cannot draw dots over a real input, keep the digits out of the DOM, announce a count in place of the digits or build a pad of 64 px keys without its own CSS, which products do not ship.
Existing surface this might already be: `Field` with `<input type="password" inputmode="numeric">` (the save-password offer, the digits in the input's value); `Stepper` (a count, not a code); `LiveRegion` (the announcement only).
Workaround I almost used: a Teisoro composite with a transparent input over hand-drawn dots and a grid of `Button`s, with local CSS for the dots, the 64 px keys and the hidden input.
Teisoro use: "Set your PIN" and "Change your PIN" (New PIN, Enter it again; typed, on a computer and a phone) and the counter's "Enter your PIN" (the pad, sent at the sixth digit).

## Proposed API (from the brief)

`label`, `value`, `onChange`, `onComplete` (called at the last digit), `length` (default 6), `error`, `description`, `disabled`, `autoFocus`, `pad?: boolean` (twelve on-screen keys, each at least 64 px), `labels` (the count template "{count} of {length} digits entered", the Delete key's name, the pad's name). One real input that takes the focus, `inputmode="numeric"`, no `type="password"`, no autofill; digits only, from a keyboard, a paste or the pad; dots; the count announced politely, never a digit; the value never written to an attribute or to visible text.

## Accepted API (2026-11-27)

Exports: `PinField`, `PinFieldProps`, `PinFieldLabels`, `defaultPinFieldLabels`.

```ts
type PinFieldLabels = {
  /** The count's words; `{count}` and `{length}` are replaced. */
  count: string;
  /** The pad's Delete key's name. */
  delete: string;
  /** The pad's name, a group. */
  pad: string;
};

type PinFieldProps = {
  label: string;
  labelVisuallyHidden?: boolean;
  value: string; // the digits entered so far, held by the consumer
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  length?: number; // 1 to 12, default 6
  description?: string;
  error?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  pad?: boolean;
  labels?: Partial<PinFieldLabels>;
  id?: string; // the input's id; its parts' ids start with it
  'aria-describedby'?: string;
};
// forwardRef<HTMLInputElement, PinFieldProps>
```

- **One input.** A native `<input type="text" inputmode="numeric">` named by `label` (a `<label>` above it, or hidden with `labelVisuallyHidden` where a heading already says it) and the field's one typed tab stop; the ref is the input. It is told to stay out of autofill: `autocomplete="off"`, no `name`, `autocorrect`/`autocapitalize` off, `spellcheck="false"`, and the ignore hints the common password managers read (`data-1p-ignore`, `data-lpignore`, `data-bwignore`, `data-form-type="other"`). It is never `type="password"`.
- **Digits only, added at the end.** Typed or pasted text keeps its ASCII digits (0–9) and drops everything else; what is kept is added after the digits already entered and cut to `length`. Backspace removes the last digit. `onChange` receives the new digits, only when they changed.
- **`onComplete(value)`** is called once, after `onChange`, by the entry (a key, a paste or a pad press) that brings the count to `length`. It is not called for a `value` the consumer sets, nor again while the field stays full; deleting a digit and entering one again completes again.
- **Dots.** `length` dots, a filled one per digit entered, hidden from assistive technology.
- **The count.** The input is described by the count's words (`labels.count`, "3 of 6 digits entered"), and after each entry the same words are announced in a polite, visually hidden `LiveRegion`. Nothing is announced before the first entry. No digit is in either.
- **`description`** is Field's muted hint, **`error`** Field's error: a polite live region in place of the hint, in the input's description, `aria-invalid`, the frame's edge in the danger colour (`Mark` in forced colours).
- **`pad`** adds a group named `labels.pad` of twelve positions in three columns: 1 to 9, an empty one, 0 and Delete (named `labels.delete`, a private backspace glyph). Each key is a native `<button type="button">` and its own Tab stop, at least 64 px both ways (`2 × space-6`), on the subtle fill inside a 1 px edge in the muted colour (3:1 or more against the fill and the surface in every palette), with the accent focus ring. A press changes the value as typing does and moves no focus: the pressed key keeps it. Delete is `aria-disabled` while there is nothing to delete, never `disabled`, so focus is not dropped. With the pad the field is a centred column at most 320 px wide (`10 × space-6`), centred in a wider parent by its own inline margins, the dots stand without a frame, and the hint and error sit under the pad, so the keys never move when an error appears.
- **`disabled`** disables the input (the frame dashed on the subtle fill, as a disabled text control) and every pad key.
- **`autoFocus`** focuses the input when it mounts.
- Refused with a `RangeError`: a blank `label`; a `length` that is not a whole number from 1 to 12; a `value` holding anything but ASCII digits or longer than `length`; a blank label in `labels`.
- No new tokens, layers or dependencies. New classes `sw-pin-field`, `sw-pin-field-with-pad`, `sw-pin-field-entry`, `sw-pin-field-input`, `sw-pin-field-dots`, `sw-pin-field-dot`, `sw-pin-field-dot-filled`, `sw-pin-field-pad`, `sw-pin-field-key`, `sw-pin-field-key-delete`, `sw-pin-field-glyph`.

## How the digits stay out of the page

The requirement: the value must not be recoverable from the page by reading its text, its attributes (the input's `value` included) or its accessible names.

**Chosen: the input never holds the digits.** The digits live only in the consumer's `value` prop (JavaScript memory). The input is a controlled input whose DOM value is a mask: one `•` (U+2022) per digit entered. When the person types, pastes or deletes, the browser edits that mask; the component reads the edited text once in the `input` event (`readPinEntry`, pure, in `src/pin-entry.ts`): the mask characters left say how many of the earlier digits survive, the ASCII digits in it are the new ones. It hands the result to `onChange`, and React at once writes the mask for the new count back. So after every entry the input's `value` property and `value` attribute hold only `•` characters, the dots are empty elements, the count's words hold only the count, and nothing else in the component is derived from the digits: the rendered DOM is a function of how many digits were entered, never of which.

Why this and not the others:

- **`type="password"`**: masks natively and keeps screen readers from echoing keys, but the browser and password managers then offer to save and fill the PIN as the site's password. Ruled out by the brief.
- **A normal controlled input made invisible** (transparent text, `-webkit-text-security`): the digits are still the input's `value` property, and React also writes them to the `value` attribute. Fails the requirement.
- **An always-empty input that only listens for keys**: nothing to delete, so Backspace sends no `input` event, and Android's virtual keyboards send no usable `keydown` either; deleting would break on phones. The mask keeps a real character to delete, so Backspace is an ordinary edit everywhere.
- **No input at all** (a focusable `div` with key handlers): no virtual keyboard on a phone, no paste, no native text-field semantics.

The input is drawn at `opacity: 0` over its frame (the frame draws the control surface, the dots and, while the input has focus, the accent ring), so the mask characters are never painted, in forced colours either, and the caret is not shown: the dots are the only drawing. Its type size stays the body's 17 px, so iOS does not zoom on focus.

Proof: `pin-field.test.tsx` and `pin-field-pad.test.tsx` enter two different codes step by step (typing, a paste, Backspace, the pad) and assert, after each step, that the serialized DOM and every input's `value` property are identical for both codes, and that neither holds any digit of the code outside the pad's own key labels; `apps/gallery/e2e/pin-field.spec.ts` repeats the check in a browser.

### Limits to know

- **A screen reader's own key echo.** Desktop screen readers can speak each key as it is pressed ("typed characters" in NVDA and JAWS, VoiceOver's typing echo), from the keyboard, not from the page. Only a password field turns that off. `PinField` never announces a digit itself; whether the keys are echoed is the person's screen reader setting, as it is for any text field.
- **The mask is read.** The input's value is the mask, so a screen reader that reads a text field's value says it ("bullet bullet bullet", or "3 bullets") on focus and when it reviews the field, beside the described count ("3 of 6 digits entered"). It never holds a digit, but the two say the same thing twice; how each screen reader words it is for the real-device pass.
- **The pad's keys** are named 0 to 9, and a screen reader says the key it presses. That is the one place a digit is named, by design.
- **Editing in the middle.** The entry only adds and removes at the end: a digit typed with the caret moved back is still added last, and a character deleted from the middle removes the last digit.
- **Only ASCII digits** are kept; full-width or other scripts' digits are dropped.
- **A form.** The input has no `name` and its DOM value is the mask, so it must not be read from a form submission: send the `value` the consumer holds.
- **The consumer's own code** can still leak the value (rendering it, putting it in an address or in storage); the component cannot prevent that.
- **The virtual keyboard with the pad.** The input keeps `inputmode="numeric"` with `pad`, so on a touch screen with no hardware keyboard, focusing it (or `autoFocus`) opens the system's number keyboard as well as the pad. A consumer that wants only the pad on such a device leaves `autoFocus` off there.

### Differences from the boards

- The boards' typed fields show only the entered dots in a text field 48 px high; `PinField` draws all `length` dots (hollow, then filled), as the brief asks, in the md control (44 px).
- The pad's keys use the md radius (16 px, the boards' 14) and a space-2 gap (8 px, the boards' 10); the digit is the heading size (28 px, the boards' 26). The Delete key has the same edge as the digit keys on a transparent fill (the boards draw it with no edge; the brief asks for a visible edge on each key).
- The dots are 16 px with a 2 px ring in the muted colour and space-3 (12 px) between them (the boards' 14).

Evidence: `pin-entry.test.ts` (the mask, digits added last, everything but ASCII digits dropped, deletion from the end, a paste cut to the length, the count's words, the refusals, the labels); `pin-field.test.tsx` (one text input that is not a password field and stays out of autofill, the dots, typing, the length's stop, a paste, Backspace, `onComplete` once and after `onChange`, not for a value the consumer sets, disabled, the hint and the announced error, the count as the description and in the polite status only after an entry, the consumer's count words, the same page for two different codes through typing, a paste and Backspace with no digit of the code in it, the ref, `id`, `autoFocus`, a hidden label, the refusals, a digit typed with the caret moved back added last, everything selected then replaced by a digit or cleared with Delete, a deletion in the middle removing the last digit, a pasted mask character counting for nothing, the mask put back when the consumer keeps its value, on a full field and after a refused key, the generated rules with no colour of their own, the ring, edge and digit contrasts in every palette); `pin-field-pad.test.tsx` (no pad unless asked, the twelve positions, real buttons with a Tab stop each, the consumer's names, a press entering a digit and keeping the focus, Enter and Space on a key, Delete and its `aria-disabled` state, the pad mixed with typing, `onComplete` once, disabled, the hint and error under the keys, the same page for two different codes but for the keys' faces, the 64 px keys' rules); gallery "PinField" (a code typed twice with its error, the pad checked at the last digit, a refused code, disabled typed and with the pad; light and dark, 390 px); `apps/gallery/e2e/pin-field.spec.ts` on desktop-en, mobile-es and forced-colors (the input's type and description, typed and inserted text, Backspace, the polite status, no digit of the code in the fields' markup or input values, the 44 px frame and its focus ring, the unseen input at 16 px or more, the 64 px keys in three columns with an edge, the focus kept on a pressed key, Tab and Enter on a key, the pad mixed with typing, one completion, the centred dots, the column centred in a wide parent that centres nothing, a digit typed on a full field undone, the error under the keys, disabled fields with an unseen input, no sideways scroll, axe in light and dark); `tab-order.spec.ts` (every key carries a `tabindex`, WebKit included: its existing `main button` selector already covers the pad's keys on the gallery page, so the spec needed no change).

Not verified: a real screen reader (NVDA, JAWS, VoiceOver, TalkBack) reading the count and the keys, and how each one reads the input's mask value ("bullet…") beside the count, on focus and after each entry; a real phone's virtual keyboard (iOS Safari, Android Chrome with Gboard), where Backspace on the mask is expected to work as an ordinary deletion; real password managers (1Password, LastPass, Bitwarden, the browsers' own) leaving the field alone. These need a device pass in the consumer before it ships.
