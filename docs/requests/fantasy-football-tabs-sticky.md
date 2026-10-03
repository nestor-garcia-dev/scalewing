Scalewing request from fantasy-football.

Status: implemented on branch `claude/trade-desk-surfaces` for the next `@scalewing/react` minor; pending review, release, and the companion's pin bump (it is on `@scalewing/react` 1.17.0).
Source: the fantasy-football companion redesign (`apps/companion`, ADR 0014 in that repository): a single-page React app bundled into an HTML page shown in an iframe, read mostly at phone width (about 390 px). Four section tabs sit under the page title, and the first section is a long trade builder.
Renderer: react
Missing surface: `Tabs` `sticky` prop (`boolean`, default `false`).
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: the tab strip is `Tabs`' own markup and class. Nothing published sticks to the top except `AppHeader`, and the companion owns no CSS, media queries or inline styles, so it cannot give the strip `position: sticky`, a layer in the generated stacking order, or a canvas background behind the labels.
Existing surface this might already be: `AppHeader` `sticky` (top chrome, a glass card with its own radius and border; wrapping the strip in it would put a card round the tabs and a second header on a page that only has a title); `ActionBar` (sticks to the bottom, for actions); `SegmentedControl` (radio semantics, not a tab strip). None keeps a page's section tabs reachable while a long panel scrolls.
Workaround I almost used: wrapping `Tabs` in `<AppHeader sticky>`, or an inline `style={{ position: 'sticky', top: 0, background: … }}` on a wrapper `div`, which needs an invented background and z-index.
fantasy-football use: the companion's four section tabs (Trade, My team, League, Waivers) under its title, so a manager deep in the trade builder can switch sections without scrolling back up. The strip is a direct child of the page's long container; the title and each panel carry the `space-4` side gutter.
Proposed API: `sticky?: boolean` on `Tabs`, default `false`; generated class `sw-tabs-sticky`.

```tsx
<Stack gap={3}>
  <Box paddingX={4}>
    <Text variant="title">Wetland reserve</Text>
  </Box>
  <Tabs
    aria-label="Reserve log"
    id="reserve"
    items={groups}
    onChange={setGroup}
    sticky
    value={group}
  />
  <Box paddingX={4}>
    <TabPanel id="birds" tabsId="reserve" value={group}>
      …
    </TabPanel>
  </Box>
</Stack>
```

Behavior and failure boundary: presentation only; the tablist, keyboard and panel semantics are unchanged. With `sticky` the strip (`sw-tabs sw-tabs-sticky`) is `position: sticky` at `top: env(safe-area-inset-top, 0px)`, on the `topChrome` layer of `packages/react/src/css/stacking.ts`, the sticky `AppHeader`'s, so it paints over a glass surface holding an open popup that scrolls up under it and under a popup outside one. It is a full-bleed band of the page canvas, not a glass card: `color-mix(in srgb, var(--sw-color-background) 90%, transparent)` over the glass blur and saturate tokens, no radius and no border but the strip's existing hairline underneath. Under `prefers-reduced-transparency: reduce` it is solid `--sw-color-background` with no backdrop filter (emitted after the sticky rule, as Checkbox and RadioGroup emit theirs), and in forced colors it is `Canvas` with no backdrop filter. The strip adds no padding: each `sw-tab` already has `padding-inline: var(--sw-control-md-padding-inline)`, which is 16 px, spacing step 4, so when the strip runs edge to edge the first label lines up with a `space-4` page gutter. A sticky element only sticks within its parent and its nearest scrolling ancestor, so the strip must be a direct child of the long container that also holds the panels (not of a padded `Box` round the strip alone), with `overflow` visible on its ancestors; inside an iframe the iframe's document is the viewport. A page with a sticky `AppHeader` should not also stick the strip, since both take the top edge on the same layer. Safe-area insets apply only with `viewport-fit=cover`. Not in scope: a strip that sticks under a sticky header (an offset prop), hiding on scroll, and left and right safe-area padding (the companion page has none in its iframe; a landscape inset would also need the page gutter to move).

Design notes:

- Nine parts canvas, not eight. At 80 % a solid block of the text color passing under the strip dropped the muted labels to 3.2:1 in the worst palette; at 90 % the muted labels keep at least 4.1:1 and the accent label 3.6:1 in every palette even over a solid block of the text, accent or danger color (computed with the dark glass saturate), and over the canvas and ordinary type, which the 24 px blur spreads, they keep their canvas contrast. Reduce Transparency gives the solid canvas.
- The glass fill was rejected: it is the card surface (the dark scheme's is a lighter, accent-tinted grey over a black canvas, and several palettes tint their canvas away from the surface), so the strip would read as a card or a second header; the request is a band of the page canvas.
- No new token: the share is a generated mix like the dialog backdrop's and the scroll shade's, the blur and saturate are the glass tokens, and the layer is an existing one.

Scalewing owns the prop, the class, the tests, the gallery evidence and the changeset. fantasy-football owns the tab labels, the page container the strip sits in, and the gutters.

Evidence: `packages/react/src/tabs.test.tsx` (the class only with `sticky`, the same tablist node; the generated rule: sticky, safe-area top, `z-index` from `topChrome`, the canvas mix and glass blur, no glass fill, border, radius or hex, the strip's hairline and zero padding, the tab's md inline padding of 16 px; the muted labels at 4.1:1 or more and the accent label at 3.6:1 or more over a solid block of the text, accent or danger color under the strip, with the glass saturate, in every palette and scheme; the solid rule under Reduce Transparency after it and `Canvas` in forced colors); `packages/react/src/css/stacking.test.ts` (the strip on the AppHeader's layer, over a lifted surface, under a popup); `apps/gallery/e2e/tabs.spec.ts` on desktop-en, mobile-es and forced-colors: in the gallery's phone-tall "Wetland reserve" page the strip is flush with the frame's start, the "Birds" label starts 16 px in and on the same edge as the title and the cards; computed `position: sticky`, `z-index: 4`, a 1 px solid hairline, no padding, a 0.9-alpha canvas and a blur (solid with no backdrop filter in forced colors); after scrolling the page the strip stays at the frame's top with the title above it and the cards under it, a press on it reaches the tab, and after scrolling to the end Mammals can be picked from the stuck strip; with `prefers-reduced-transparency: reduce` emulated the strip's background equals the canvas and its backdrop filter is none. The non-sticky Habitats strip stays `position: static`.
