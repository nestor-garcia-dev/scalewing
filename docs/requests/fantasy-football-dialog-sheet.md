Scalewing request from fantasy-football.

Status: implemented on branch `claude/trade-desk-surfaces` for the next `@scalewing/react` minor; pending review, release, and the companion's pin bump (it is on `@scalewing/react` 1.17.0).
Source: the fantasy-football companion redesign (`apps/companion`, ADR 0014 in that repository): before a trade is sent, a review dialog lists both sides and the verdict, read mostly at 390 px inside an iframe.
Renderer: react
Missing surface: two `Dialog` props for a phone-friendly review, one surface (the dialog's phone presentation and its own way out): `sheetBelow?: Breakpoint`, a bottom sheet below that breakpoint, and `closeLabel?: string`, an icon-only close button ending the title row.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: the dialog's box, position and title row are `Dialog`'s own markup and generated CSS. Below `md` the centered dialog keeps a `space-4` gutter on every side and floats mid-screen, so a long review puts its actions far from the thumb; the companion owns no CSS or media queries to dock it. The title is `Dialog`'s own heading (it names the dialog), so a consumer cannot put a button beside it; a close `Button` in the children sits under the title, and an X glyph would need an icon dependency the companion does not have for this.
Existing surface this might already be: `Dialog` `size` (width only, both sizes keep the gutter on a phone); `ActionBar` `stickyBelow` (the breakpoint pattern this follows); `CalendarButton` (the icon-only Button pattern the close button follows). No sheet or dialog close control exists.
Workaround I almost used: a full-width `Card` fixed to the bottom with an inline style and a fake backdrop, or a text "Close" button in the children under the title.
fantasy-football use: the trade review and player detail dialogs are `sheetBelow="md"` with `closeLabel="Close"`; their send and cancel buttons stay in the children.
Proposed API: `sheetBelow?: Breakpoint` (the exported `Breakpoint` type, `'md'`, the one `ActionBar` `stickyBelow` takes) and `closeLabel?: string` on `Dialog`. Generated classes `sw-dialog-sheet-below-md`, `sw-dialog-header`, `sw-dialog-close`, `sw-dialog-close-glyph`. No new exported types.

```tsx
<Dialog
  closeLabel="Close"
  onClose={close}
  open={open}
  sheetBelow="md"
  title="Review the night count"
>
  {records}
  <Inline gap={2} justify="end">
    <Button onPress={close} variant="secondary">
      Keep editing
    </Button>
    <Button onPress={send}>Send count</Button>
  </Inline>
</Dialog>
```

Behavior and failure boundary:

- `sheetBelow`: presentation only. Only the `below` query of the breakpoint token (`not all and (min-width: 48rem)`) applies `sw-dialog-sheet-below-md`: `margin: auto 0 0` docks the native modal to the bottom edge at `width: 100%`, `max-width: none` (so it wins over `size="lg"`, emitted after it); `border-radius: var(--sw-radius-lg) var(--sw-radius-lg) 0 0`; only the top hairline; the existing dvh-aware cap `min(100vh - space-8, 100dvh - space-8)`, which now leaves the whole `space-8` strip of backdrop above the sheet (it scrolls inside when taller); `padding-bottom: calc(space-5 + env(safe-area-inset-bottom, 0px))` and side padding of at least `space-5` that also clears the side insets. From `md` up it is the centered dialog at its `size`. No grabber is drawn, since there is no drag gesture. On open it slides up from the bottom edge (`translate: 0 100%` to its place, `--sw-motion-default` with `--sw-motion-easing`), and not at all under `prefers-reduced-motion: reduce`; close is instant, as for every dialog. The backdrop, focus trap, close requests and `open` control are unchanged. Safe-area insets apply only with `viewport-fit=cover`.
- `closeLabel`: when it is a non-empty string, the title and an icon-only ghost `Button` at `sm` share a row (`div.sw-dialog-header`); the button's name is `closeLabel` (visually hidden text, as `CalendarButton` names itself), it is `type="button"`, and a press calls `onClose`, like Escape, so `open` still decides. The title stays the `h3` (or `h2` with `titleLevel={2}`) that names the dialog through `aria-labelledby`. The button is the dialog's first control, so the browser focuses it on open unless a control in the content has `autoFocus`; that is the documented trade-off. The glyph is private control chrome (ADR 0008): two 2 px strokes in the button's color crossed in a `space-4` square, drawn with borders so forced colors keep them, `aria-hidden`, no icon dependency and no icon export. The button is square at the sm control height, 44 px on a coarse pointer, and negative margins keep the row as tall as one title line and put the glyph's end on the padding edge. Without `closeLabel` (or with an empty one) the markup is exactly as before: the title alone in the dialog's stack.

Rejected alternatives:

- `variant="sheet"` or always a sheet on a phone. A breakpoint prop matches `stickyBelow`, lets a product keep the centered dialog for a short confirmation, and changes no existing dialog.
- A drag grabber or swipe to dismiss. A grabber without a gesture promises one; a gesture needs pointer tracking the native `<dialog>` does not give and is out of scope.
- `onClose` showing the button by itself, or a `closable` boolean. The button needs a localized name, and the name is the opt-in.
- A Lucide `X` in Scalewing or a `closeIcon` slot. ADR 0008 keeps dismiss chrome private and Scalewing free of glyph vendors; a slot can come later if a product must replace the glyph.
- Two request files. The sheet and its close button are the same phone presentation of the same component and ship together for one consumer screen; each prop is still tested on its own.

Scalewing owns the props, the classes, the glyph, the tests, the gallery and the changeset. fantasy-football owns which dialogs are sheets, the close label's words, and the dialog content.

Evidence: `packages/react/src/dialog-sheet.test.tsx` (the sheet class only with `sheetBelow`, beside `sw-dialog-lg`; the rule only inside the below-md query and after `sw-dialog-lg`, docked, full width, top corners rounded, top hairline, the dvh cap, the safe-area padding, no hex or raw px; the slide with the motion tokens and none under reduced motion; with `closeLabel` the header row holds the `h2` title naming the dialog and a `sw-button sw-button-ghost sw-button-sm sw-dialog-close` `type="button"` named "Close" with an `aria-hidden` empty glyph, and a press calls `onClose`; without it no button and no header, the `H3` straight in the stack; the square, margin and coarse-pointer rules and the border-drawn glyph); the existing `dialog.test.tsx` still passes; `apps/gallery/e2e/dialog.spec.ts` on desktop-en, mobile-es and forced-colors with "Review the night count": at 390 px the sheet spans the width, meets the bottom edge, starts at least 48 px down, has square bottom corners, the lg radius on top and 24 px bottom padding, and no animation under reduced motion; at 1280 it is centered with every corner rounded; the close button is focused on open, centered on the title's line, its 16 px glyph's end on the padding edge, at least 44 px on the phone and 32 px on desktop, its strokes 2 px solid (also in forced colors); Close and Escape close it and focus returns to the trigger; "How we rank" keeps its markup; on the phone with motion allowed the sheet runs `sw-dialog-sheet-in` for 0.18 s and ends docked.
