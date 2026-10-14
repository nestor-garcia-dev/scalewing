Scalewing request from Teisoro.

Status: released in `@scalewing/react` 1.40.0 (PR #183; accepted 2026-10-14; Teisoro F-012-S05, release M3 "periods, lists and figures", item 3; the manager views inventory's row 1; plan approval under Teisoro decisions O-1, D-1 and D-9).
Renderer: react
Missing surface: a count after a word in `Nav appearance="words"`, the top bar's "Tasks 8".
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: all 43 boards put Tasks on the top bar as an area with its count ("Tasks 8", a red pill after the word). Teisoro's `AreaBar` composes `AppHeader` and `Nav appearance="words"` with its own router links, and today says "Areas carry no count"; the count moves there from the Vault's area bar. `SectionNav` draws this pill for its items (`count`, `countLabel`), but Nav's destinations are the consumer's own children, not items, so the pill has no way in. Drawing it in Teisoro would copy SectionNav's pill CSS.
Existing surface this might already be: `SectionNav` `count` / `countLabel` (the same pill and naming, for an area's sections); `Badge` (a status word, not part of a link's name, and not the danger pill).
Workaround I almost used: a `Badge` inside the link, with its own colour and no counted name.
Teisoro use: `AreaBar`'s Tasks link on every screen's top bar (S12 and S21).
Proposed API (inventory): a count after a Nav word, part of the link's accessible name, as SectionNav's `countLabel` does.

## Decision: a `NavCount` child, not a `count` prop

`Nav` is a `Box` whose destinations are the consumer's children: `Box as="a"`, a `Button`, or a product's router link (Teisoro's `AppLink`). A `count` prop needs an item to hang on: either a new `NavLink` that wraps every router's link (a second link API beside `Box as="a"`), or turning Nav into an `items` list like SectionNav (a breaking change to how every Nav is written). A `NavCount` child goes inside whatever link or Button the consumer already renders, after its words, so Nav's composition and every existing Nav stay as they are, and the count is in the destination's name because it is the destination's own text.

## Accepted API (2026-10-14)

- `NavCount` (props `NavCountProps`): `count: number` (a whole number; 0 renders nothing) and `countLabel?: string` (what it means, "8 tasks to do"). Placed inside a Nav destination after its words:
  `<Box as="a" href="/tasks" aria-current="page">Tasks<NavCount count={8} countLabel="8 tasks to do" /></Box>`.
- It renders a space as its own text node, then the pill (`sw-nav-count`). The destination's name is its words and the count ("Tasks 8"); with `countLabel`, a visually hidden `countLabel` is read in place of the number ("Tasks 8 tasks to do") and the pill is `aria-hidden`, as SectionNav's.
- The pill is SectionNav's: one shared rule (`css/css-count-pill.ts`, `[data-theme] .sw-section-nav-count, [data-theme] .sw-nav-count`): the danger fill with its on-colour figures (4.5:1 in every palette), caption size at weight 700, 20 px high and at least as wide, an edge in forced colours. A Nav link holding a count lays out as SectionNav's link (`:where(.sw-nav a:has(> .sw-nav-count))`, at zero specificity so `hideBelow` and `hideFrom` still hide it: inline-flex, centred, a space-2 gap, so the space text node that keeps the name collapses), so the pill sits a space-2 after the words, as in a Button and in SectionNav, and the link is as tall as its siblings with its words level. In forced colours the current destination's underline also runs under its count's figure, since the pill is a flex item of the link (cosmetic, the current destination only). The pill module is emitted and catalogued once by the stylesheet's aggregators, beside Nav's and SectionNav's own CSS. SectionNav's output is unchanged apart from the shared selector.
- It works in any Nav appearance and in a Button destination; the words appearance's current mark (weight and colour) never touches the pill.
- A `count` that is not a whole number from 0, or a blank `countLabel`, throws a `RangeError`.
- No new tokens, layers or dependencies. New class `sw-nav-count`.

### Differences from the boards (Teisoro D-2)

- The boards' pill is #e5484d with white figures; Scalewing's is the theme's danger colour with its on-colour, as SectionNav's.

Evidence: `nav-count.test.tsx` (the name "Tasks 8" on a link, in a default-appearance Nav too, the link layout rule, "Tasks 8 tasks to do" on a Button with the pill hidden, nothing for 0, refusals, the catalog); `section-nav-filled.test.tsx` (the shared pill rule and its forced-colours edge); gallery "Nav" (a words Nav with Tasks 8 current, Nests 12, Traps with none and a Button with Alerts 3, and Savanna 4 in the default Nav); `apps/gallery/e2e/nav-count.spec.ts` on desktop-en, mobile-es and forced-colors (the names, also read from Chromium's own accessibility tree, the pill on the words' line in the danger colour, its edge in forced colours, the same space-2 gap in a link, a Button and SectionNav, a counted link as tall as its siblings with its words level, and a counted link still hidden by the hide classes), with `nav-words.spec.ts` and `section-nav.spec.ts` unchanged and passing.
