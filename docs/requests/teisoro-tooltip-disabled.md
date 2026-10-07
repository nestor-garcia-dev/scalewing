Scalewing request from Teisoro.

Status: implemented on branch `claude/tooltip-disabled` for the next `@scalewing/react` minor; pending review, release, and Teisoro's pin bump (it is on `@scalewing/react` 1.17.0).
Source: Teisoro's workspace navigation (`apps/teisoro-web/src/app/WorkspaceShell.tsx`), found in the review of Teisoro PR #39.
Renderer: react
Missing surface: `disabled?: boolean` on `Tooltip`, which turns the tooltip off, not its trigger: the trigger stays mounted, enabled and focusable.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: Teisoro's navigation destinations are a glyph below `md` (the label is `Box hideBelow="md"`) and a labelled button from `md` up. Below `md` the glyph needs a `Tooltip` with its name (focus and hover); from `md` up the tooltip and its description repeat the visible name. The only way to drop it today is to render the button with a `Tooltip` below `md` and without one from `md` up. The two trees differ (`Tooltip` wraps the trigger in its anchor `span`), so React unmounts the button and mounts a new one when the media query flips, and a keyboard user focused on a destination loses focus when the viewport crosses `48rem` (browser zoom, a tablet rotating). A consumer cannot keep the `Tooltip` and remove its description: `Tooltip` always adds its id to the trigger's `aria-describedby`, and a hidden element referenced by `aria-describedby` still describes it, so no stylesheet can hide it from assistive technology (and Teisoro owns no CSS).
Existing surface this might already be: `Tooltip` itself (no way to turn it off); `Box hideBelow` (hides the label, not the tooltip's description).
Workaround I almost used: moving the focus back to the new button after the breakpoint flips, which still replaces the element under a screen reader and announces it again.
Teisoro use: every navigation destination is `<Tooltip content={label} disabled={!belowMd} trigger={button} />`, so the same button stays mounted at both widths.
Proposed API: `disabled?: boolean` on `Tooltip`, default `false`. No new classes or exported types.

```tsx
<Tooltip
  content="Where each species lives"
  disabled={helpShown}
  trigger={
    <Button aria-label="Habitat map" onPress={openMap}>
      {icon}
    </Button>
  }
/>;
{
  helpShown ? <Text variant="caption">Where each species lives</Text> : null;
}
```

Behavior and failure boundary:

- With `disabled`, the anchor `span` and the trigger stay exactly where they were, so toggling `disabled` never remounts the trigger and its focus stays put. The tooltip element is not rendered, the trigger keeps only its own `aria-describedby` (none when it has none), and Escape is left to the page.
- Focus, hover and touch are still followed while disabled, so a trigger that still has focus, the pointer or an open touch toggle shows the tooltip as soon as `disabled` turns off, without another focus; one the pointer left or an outside tap dismissed stays hidden. Escape pressed while disabled reaches the page and does not stop that.
- `disabled` must match between the server render and the first client render; a breakpoint is read through a hydration-safe store (Teisoro's `useBelowMd` is `useSyncExternalStore` with a server snapshot).
- Without `disabled`, the markup and behavior are unchanged. Empty `content` still throws.

Rejected alternatives:

- `below?: Breakpoint`, the tooltip only below a breakpoint. The description cannot be dropped by CSS, so it would need a `matchMedia` subscription inside `Tooltip`; the product already knows its breakpoint state, and a boolean serves other reasons to turn a tooltip off.
- Hiding the tooltip with a class from `md` up. It would still describe the trigger and still take Escape.
- Restoring focus in the product after the remount. The element is still replaced, and a screen reader announces it again.

Scalewing owns the prop, its tests, the gallery and the changeset. Teisoro owns when its tooltips are off and their words.

Evidence: `packages/react/src/tooltip.test.tsx` (disabled: no `role="tooltip"` element even hidden, the trigger keeps only its own `aria-describedby` or none, hover, touch and focus open nothing, Escape is not prevented; toggling `disabled` on a focused trigger keeps the same element and its focus, removes the description, and on enabling shows the tooltip again with its description; a tooltip opened by hover or touch while disabled, then closed by pointer leave or an outside tap, stays hidden when enabled; the existing cases pass unchanged); `apps/gallery/e2e/tooltip.spec.ts` "Tooltip disabled keeps the trigger mounted without a tooltip or description" on desktop-en, mobile-es and forced-colors (the map button's "Where each species lives" tooltip and description on focus, then with "Show the map's help" that help as visible text, no `aria-describedby`, no tooltip on focus or hover, and the same element still connected).
