Scalewing request from Teisoro.

Status: in implementation on branch `teisoro/button-natural-width` (requested 2026-11-28; Teisoro F-010 "counter PIN switching", S10 acceptance review, Q-5 "Switch person" wrapping in the top bar; an extension of S11 "Scalewing pieces"). Not released yet.
Renderer: react
Missing surface: a `Button` (and an `ActionMenu`) that is not squeezed in a crowded row, and `shrink={false}` on a Box-based layout that must keep its natural width.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: in Teisoro's top bar a small neutral `Button` ("Switch person", "Cambiar de persona") sits with the account `ActionMenu` in an `Inline wrap={false}`. On a crowded row (a tablet at 768–1000 px in Spanish, a desktop bar with seven areas and a long name) flex shrinking squeezes the button until its words wrap onto two or three lines and spill out of the pill; the menu trigger's name wraps too. Nothing in Scalewing says "this item keeps its natural width", and Teisoro owns no CSS.
Existing surface this might already be: `Inline wrap` (moves the button to a line of its own instead of keeping the row); `Button width="full"` (fills, the opposite).
Workaround I almost used: on a phone the button already takes a row of its own (Teisoro, fixed in its review); from `md` up there is no workaround without local CSS.
Teisoro use: the top bar's actions (`AreaBar`: Switch person and the account menu in `Inline wrap={false} shrink={false}`).

## The fault is shrinking, not wrapping

The words wrapped because the button was squeezed narrower than they are: a flex item shrinks, and an `Inline` shrinks below its content (`min-width: 0`). So the fix keeps the button at its natural width, and leaves wrapping alone as the fallback for a container truly narrower than the words.

- **A Button straight in a crowded row** keeps its natural width (`flex-shrink: 0`): the row's other items (a title, navigation that wraps) give way first, and its words stay on the one line they take at that width. This is the control's own behaviour, not a layout choice, so it belongs to Button, not to every row a consumer composes.
- **It is never wider than its container** (`max-width: 100%`). Where its words are longer than the whole row or column it is in (a narrow column, a `ButtonGroup` stacked on a phone, a sheet's footer in Spanish), they wrap inside the pill, every word shown. They are never cut: a cut label on a cash-handling screen hides what the button does, and Spanish labels are long.
- **A row of controls nested in a crowded row** (Teisoro's Switch person and account menu in their own `Inline`) is squeezed as a whole, since an `Inline` shrinks below its content by design, and its controls would spill out of it over their neighbours. That is a layout decision about one box, so it is a layout prop: `shrink={false}` on any Box-based component (`Box`, `Inline`, `Stack`, `Card`…, as `columnSpan` is), the generated `sw-no-shrink` (`flex-shrink: 0`). It is opt-in: keeping a box's width means the box can outgrow its row, so the consumer says where that is safe.
- **The menu trigger.** Teisoro's account menu is an `ActionMenu` with `triggerAppearance="text"`, a native button that is not a `Button`. Every ActionMenu gets the same rules: the menu `flex-shrink: 0`, the menu and its trigger `max-width: 100%`, its words wrapping inside it only past the whole container.

Not chosen: `white-space: nowrap` with an ellipsis on every Button (built first, then dropped: it cut words in full-width and stacked buttons, and it needed a label span around a button's text, which changed every button's DOM); a `wrap` prop on Button (no second state worth naming once the button is not squeezed); a `noShrink` prop on `Inline` children through `Children.map` (a layout component reaching into its children's props; the Box prop does the same for any box, and Button needs no prop at all).

## Accepted API (2026-11-28)

New export: `FlexItemProps`. New class: `sw-no-shrink`. No new tokens, layers or dependencies; no change to any component's DOM.

```ts
type FlexItemProps = {
  /** `false`: keeps the box at its natural width in a flex row that is short of room. */
  shrink?: boolean;
};
// BoxProps (and so Inline, Stack, Card, Grid…) gain FlexItemProps.
```

- **Button and ButtonLink**: `.sw-button { flex-shrink: 0; max-width: 100%; }` (`css-button-natural-width.ts`). A full button keeps its own Inline rule (`flex: 1 1 0; min-width: 0`), which outranks.
- **ActionMenu**: in its base rules (`css-action-menu.ts`), `.sw-action-menu` gains `flex-shrink: 0; max-width: 100%` and `.sw-action-menu-trigger` gains `max-width: 100%`.
- **Attached ButtonGroup**: its buttons keep `flex-shrink: 1`, so they share its one row as before.
- **`shrink={false}`** on any Box-based component adds `sw-no-shrink`; `true` or left out adds nothing.

```tsx
<Inline justify="between" align="center" gap={3} wrap={false}>
  <Inline align="center" gap={6} wrap>
    {brand}
    {areas}
  </Inline>
  <Inline align="center" gap={2} wrap={false} shrink={false}>
    <Button size="sm" variant="neutral" onPress={switchPerson}>
      {copy.switchPerson}
    </Button>
    <ActionMenu
      triggerAppearance="text"
      align="end"
      label={label}
      trigger={name}
      items={items}
    />
  </Inline>
</Inline>
```

## Behaviour change to existing components

- Every `Button`, `ButtonLink` and `ActionMenu` keeps its natural width as an item of a flex row. In a crowded row its siblings give way where they used to share the squeeze. Any `Inline` without `wrap` (not wrapping is its default, so this is every `Inline` that does not ask for `wrap`) whose Buttons or menus together are wider than it now overflows where their words used to wrap as they were squeezed: give it `wrap`, or a row of its own on a narrow screen.
- **An attached `ButtonGroup`** is the one place a row of Buttons was meant to share a fixed row: it "keeps its row on a phone" and does not wrap. Without `fullWidthBelow`, the natural-width rule alone would have made a wide joined control spill past a phone's column instead of wrapping its words. That is a common phone layout (Previous, Today, Next), so it is fixed in code, not documented: its buttons shrink again (`flex-shrink: 1` in `css-button-group-attached.ts`, which outranks the Button's rule), and a joined control narrower than its words wraps them inside its segments, as before. With `fullWidthBelow` it was already sharing the width equally and is unchanged.
- Nothing is cut and no DOM changes: a button wider than its container still wraps its words inside the pill, as before.
- Gallery check: no gallery sample or browser spec relied on a Button shrinking; the full suite fails only the 12 failures known before this change (ButtonGroup, CommandPalette on mobile-es, DateToggleCalendar). The scan covered the gallery's open layouts only (rows at the widths its projects use), not every container a consumer might compose. `button-group.spec.ts:40`, the attached group's "keeps its row on a phone" test, is one of the 12: it stops at line 78 for an unrelated reason (its `getByRole('group', { name: 'Survey day' })` also matches the DateToggleCalendar's "Survey days off" group, a strict-mode violation), so its later width check never runs, and the "Survey day" sample could not test this fix anyway: two icon buttons and "Today" are 174 px at their narrowest, so nothing in it can wrap. `button-one-line.spec.ts` checks a joined group of several-word labels instead (gallery "Button", Sighting window).

Evidence: `button-natural-width.test.tsx` (the Button's and ActionMenu's rules, a full button's Inline rule still outranking, no `nowrap`, ellipsis or label class, a Button's words still its own text node and its name "Forest 2 nests", a text trigger's words whole, as its own text); `button-group-attached.test.tsx` (the attached group's buttons shrink again); `flex-item.test.tsx` (`sw-no-shrink` only for `false`, on Inline, the rule after the Inline's); gallery "Button" (from `md`: a title beside a Button and a text ActionMenu in a `shrink={false}` Inline, a Button straight in a crowded Inline, a row of Buttons with and without wrap, and the attached Sighting window group) and "Layout" (`shrink={false}` beside a box that shrinks); `apps/gallery/e2e/button-one-line.spec.ts` at 768 px on desktop-en, mobile-es and forced-colors (the title wraps while "Switch to the night roost" and "Great crested grebe colony" stay one line and inside their pills, within their kept-width Inline, no sideways scroll; a Button straight in a crowded Inline stays one line while the text beside it wraps; in a 160 px container both wrap inside their pills, nothing drawn outside them, no wider than the container, every word shown and the accessible names whole; a default `Inline` of Buttons narrower than them overflows, and with `wrap` moves them to the next line without overflow; an attached ButtonGroup of three several-word labels, Sighting window, in a 360 px column, narrower than its one-line words and wider than its longest words, keeps every segment inside the column at both edges on one joined row, each segment's words on more than one line and none drawn outside it; forcing `flex-shrink: 0` on its buttons makes that test fail).

Not verified: Safari and Firefox (the browser specs are Chromium); Teisoro's own screens at every width with the new Button rule, which its journeys check when it pins the release.
