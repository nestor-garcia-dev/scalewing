Scalewing request from Teisoro.

Status: implemented on branch `claude/tooltip-labels` for the next `@scalewing/react` minor; pending review and release. Teisoro adopts it after its `Tooltip` `disabled` pin (`teisoro-tooltip-disabled.md`, `@scalewing/react` 1.19.0) has merged.
Source: Teisoro's workspace navigation (`apps/teisoro-web/src/app/WorkspaceShell.tsx`), as Teisoro PR #43 (the `disabled` adoption) renders it.
Renderer: react
Missing surface: `relationship?: 'description' | 'label'` on `Tooltip`. `'label'` makes the tooltip its trigger's accessible name (`aria-labelledby`) instead of its description (`aria-describedby`), the naming tooltip of an icon-only control.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: below `md` each navigation destination is an icon-only `Button` named by `aria-label`, inside a `Tooltip` whose `content` is the same name. `Tooltip` always adds its id to the trigger's `aria-describedby`, so a screen reader reads "Vault, button, Vault". The consumer cannot fix it from outside: a hidden element referenced by `aria-describedby` still describes the trigger, so no class can take the tooltip out of the accessibility tree (and Teisoro owns no CSS); dropping the button's `aria-label` leaves it nameless, because `Tooltip` never names its trigger.
Existing surface this might already be: `Tooltip` itself (only describes); `Tooltip` `disabled` (turns the tooltip off, so the glyph would have no visible name on hover or focus, which SET-9 requires); `ActionMenu`'s icon-only trigger (a menu, not a press).
Workaround I almost used: keeping `aria-label` and accepting the doubled announcement; or giving the tooltip content a different wording ("Go to Vault") so the repeat at least says something, which is still read twice.
Teisoro use: every navigation destination is `<Tooltip content={label} disabled={!belowMd} relationship="label" trigger={button} />`, and the button has no `aria-label`. Below `md` the button is its glyph and the tooltip is its name, read once ("Vault, button"); hover, focus and touch still show it. From `md` up the tooltip is off and the button's visible label (`Box hideBelow="md"`) names it. The same button stays mounted at both widths, so the focus survives the breakpoint as with `disabled` alone.
Proposed API: `relationship?: TooltipRelationship`, `TooltipRelationship = 'description' | 'label'`, default `'description'`. `TooltipRelationship` is exported. No new classes or tokens.

```tsx
<Tooltip
  content="Range map"
  disabled={namesShown}
  relationship="label"
  trigger={
    <Button onPress={openMap}>
      {icon}
      {namesShown ? 'Range map' : null}
    </Button>
  }
/>
```

Name: `relationship` follows Fluent UI's `Tooltip` `relationship: 'label' | 'description' | 'inaccessible'`, which models the same choice; MUI's boolean `describeChild` is the same choice the other way round. React Aria's `TooltipTrigger` and Radix's `Tooltip` only describe their trigger and have no equivalent. A union leaves room for a third relationship without a second boolean. Rejected names: `labels` (Scalewing already uses `labels` for a component's own words, as in `DateField`), `role` (it would shadow the ARIA attribute the tooltip itself renders, `role="tooltip"`), and `asLabel`/`describeChild` booleans (a boolean reads one way and says nothing about the default).

Behavior and failure boundary:

- `'label'`: the trigger gets `aria-labelledby` with the tooltip's id after its own `aria-labelledby`, if any, and keeps only its own `aria-describedby` (none when it has none), so the text is read once, as the name. `aria-labelledby` wins over an `aria-label` on the trigger.
- The tooltip element stays in the DOM, `hidden`, while it is not shown, so the name resolves at all times: a hidden element referenced directly by `aria-labelledby` still contributes its text to the name (accname 1.2, step 2A; Chromium's own accessibility tree is checked in the gallery test).
- The trigger's own references are passed through as they were: with the default `'description'` its `aria-labelledby` is untouched (the markup is byte-identical to before), and with `'label'` its `aria-describedby` is untouched.
- A trigger that shows visible text different from `content` must not use `'label'`: the tooltip would replace the visible label as the name (WCAG 2.5.3, label in name). Teisoro's visible label and `content` are the same string, and the tooltip is off while the label shows.
- Hover, focus, touch, outside tap and Escape behave exactly as for a description; Escape hides a visible labelling tooltip and the name stays.
- With `disabled` there is no tooltip element, so the trigger gets no `aria-labelledby` from it and never points at a missing element. The trigger then needs its own name: visible text (Teisoro's label from `md` up) or an `aria-label`, which the tooltip overrides while enabled. Scalewing cannot tell whether a trigger has visible text, so it does not invent a fallback name (an automatic `aria-label` would also override a visible label that differs from `content`).
- `relationship` and `disabled` must match between the server render and the first client render. Toggling `disabled` keeps the same trigger element and its focus.
- Forced colors: unchanged; the tooltip keeps its `CanvasText` border.
- Without `relationship` (or with `'description'`), the markup and behavior are unchanged. Empty `content` still throws.

Rejected alternatives:

- A `Tooltip` that hides itself from assistive technology (Fluent's `'inaccessible'`). Teisoro would then still need the button's `aria-label`, and two strings would have to stay equal.
- A naming tooltip that keeps rendering while `disabled`. `disabled` means no tooltip; a hidden element naming a trigger whose visible label already names it would override that label.
- An `aria-label` copied from `content` on the trigger. It would be read in place of a visible label that differs from `content`, and it hides the relationship from the markup.

Scalewing owns the prop, its tests, the gallery and the changeset. Teisoro owns when its tooltips are off, their words, and giving each trigger its own name while its tooltip is off.

Evidence: `packages/react/src/tooltip-trigger-aria.test.ts` (the mapping of both relationships with and without the trigger's own references and with no tooltip); `packages/react/src/tooltip.test.tsx` "relationship=\"label\"" (an icon-only trigger named by its hidden tooltip and described only by its own hint; the tooltip wins over `aria-label` and joins the trigger's own `aria-labelledby`; hover, focus, touch and Escape as a description, still named while hidden; disabled leaves no reference and the trigger's `aria-label`, text or own `aria-labelledby` names it; toggling `disabled` on a focused trigger keeps the element and its focus, named by its visible text while disabled and by the tooltip while enabled); `apps/gallery/e2e/tooltip.spec.ts` "Tooltip relationship label names an icon-only trigger once, and its own name stands while disabled" on desktop-en, mobile-es and forced-colors (the range map button named "Range map" with no description in Playwright and in Chromium's own accessibility tree while the tooltip is hidden; hover or tap shows it; focus, Escape; with "Show the destinations' names" the same button is named by its visible text with no `aria-labelledby`; and back).
