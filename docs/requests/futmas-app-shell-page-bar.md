Scalewing request from FutMas.

Status: accepted 2026-10-24 (FutMas F-010-S09 "desktop shell and league overview", release W2 "the league frame"; the owner approved the F-010 canvas v15 and the whole feature on 2026-10-24, with standing approval for Scalewing changes, PRs, merges and publishing). To ship in `@scalewing/react` 1.48.0.
Renderer: react
Missing surface: three additions to `AppShell`: a sticky `pageBar` band at the top of `main`, a count on the compact bar's menu button (`menuCount`, `menuCountLabel`, `menuCountTone`), and documented support for an interactive switcher trigger in `header`/`railHeader`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: the league overview's season bar (the competition and season pickers, the search) must stay pinned while the page scrolls (FutMas's fit rule: the page's main job fits 1366×768 and only long lists scroll). FutMas may not write sticky CSS or media queries, and `AppHeader sticky` inside `main` sticks at `top: 0`, where below `lg` it slides under AppShell's own sticky top bar. The menu button takes only `menuIcon` and `labels`, so the portrait layout's "a top bar with a menu (Inbox count)" has nowhere to draw or read the count.
Existing surface this might already be: `AppHeader appearance="bar"` (the right look, the wrong sticky offset below `lg`); `Tabs sticky` (a section strip, not a free band); `NavCount` (a count inside a destination's words, not on an icon-only button); `AppShell` item `count` (a destination's, not the menu's).
Workaround I almost used: an unpinned season bar at the top of the page, and no count on the menu (the Inbox count only inside the drawer).
FutMas use: the season bar over the league overview on every layout (1366×680 laptop, 1180×820 iPad landscape, 820×1180 iPad portrait); the menu button's "6 need you" Inbox count in portrait; the league switcher's trigger in `header` and its compact crest trigger in `railHeader`.

## Proposed API (from the brief)

```ts
type AppShellProps = {
  // …1.47.0's props
  pageBar?: ReactNode;
  menuCount?: number;
  menuCountLabel?: string;
  menuCountTone?: NavCountTone;
};
```

## Accepted API (2026-10-24)

The brief's API, unchanged.

- `pageBar?: ReactNode` is drawn as the first child of `main` in a `div.sw-app-shell-page-bar` on every layout (nothing for `undefined`, `null` or `false`). The band is the solid surface with the border hairline under it, padded space-2 by the page's inline padding (space-4 below `lg`, space-6 from `lg`, FutMas's 16 and 32 px), and lays its children out in a wrapping row with space between them (a gap of space-2 by space-3), so a group of pickers at the start and a search at the end need no wrapper. It is sticky on the `topChrome` layer (the AppHeader's): from `lg` at the window's top (the compact bar is gone), below `lg` right under the compact bar. The bar's height depends on what `barEnd` holds, so the shell measures it (a `ResizeObserver`, only while there is a page bar) and sets `--sw-app-shell-bar-height` on `.sw-app-shell`; before that, and without script, the band falls back to the bar's usual height (the sm menu button, or the 44 px target on a coarse pointer, inside space-2 padding, plus the hairline). It holds no live region or landmark of its own: it is part of the page in `main`.
- `menuCount?: number` draws the shared count pill (`sw-app-shell-count`, with its tone classes, the same class as a destination's count) on the menu button's top end corner, mirrored in right-to-left, a space-1 past the button's edge. The button's name becomes `labels.openMenu`, a comma and the count's words (`menuCountLabel`, or the bare number): "Open menu, 6 need you"; the pill itself is hidden from assistive technology. 0 shows no pill and leaves the plain name. `menuCountTone` takes NavCount's tones (`danger` by default, `warning` amber, `accent`). The comma is the one separator Scalewing adds; the consumer's words stay in `labels.openMenu` and `menuCountLabel`.
- `header` and `railHeader` may hold an interactive trigger such as an `ActionMenu` (or the coming `ContextSwitcher`), including an icon-only trigger in the rail. This already worked in 1.47.0 (popups open on the top layer, so neither the sticky sidebar nor the drawer clips them); it is now documented on the props and in the README, and covered by the gallery frame (the station menu in `header`, its glyph trigger in `railHeader`) and its browser spec in all three layouts.

### Deviations from the brief

- `AppHeader` now accepts `ref` (React 19's ref-as-prop, passed to its `header`), so the shell can measure its compact bar. Additive; no other AppHeader behaviour changes.

### Classes

`sw-app-shell-page-bar` (new). The menu's pill reuses `sw-app-shell-count` and its tone modifiers. The custom property `--sw-app-shell-bar-height` is set by the component, not a public token.

### Refused with a `RangeError`

A `menuCount` that is not a whole number from 0; a blank `menuCountLabel`; an unknown `menuCountTone`; a `menuCountLabel` or `menuCountTone` without a `menuCount`.

No new tokens, public breakpoints or dependencies.
