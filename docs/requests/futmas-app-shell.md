Scalewing request from FutMas.

Status: released in `@scalewing/react` 1.47.0 (PR #229; accepted 2026-10-24; FutMas F-010 "admin web", the league managers' desktop admin; the owner approved the F-010 canvas v15 and the whole feature on 2026-10-24, with standing approval for Scalewing changes, PRs and merges).
Renderer: react
Missing surface: `AppShell`, a web workspace frame: a pinned side navigation of grouped destinations beside the page, an icon rail on a narrower window, and a top bar with a menu drawer on a tablet or phone.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: the frame changes its whole layout at two widths (a sidebar, a rail, a bar with a modal drawer), keeps the sidebar sticky at the viewport's height with only its own list scrolling, and moves the same destinations into a top-layer drawer. FutMas owns no CSS and may not write media queries (`packages/react/AGENTS.md` rule 8), so it cannot build the sidebar, the rail or the drawer from `Box`, `Grid` and `Dialog`. `Box hideBelow`/`hideFrom` toggle regions but cannot pin a sticky full-height column, make labels visually hidden only in a range, or open a drawer from the inline start.
Existing surface this might already be: `SectionNav` (`verticalFrom` is a side list, but it is an area's quieter sub-navigation: no groups, no rail, no drawer, no frame or `main`); `Nav` (a row of destinations); `AppHeader` (`appearance="bar"`, reused for the compact top bar); `Dialog` (a centred modal or a bottom sheet with a title, not a full-height drawer from the start edge; its close-request mechanics are reused).
Workaround I almost used: a `Grid` with a `SectionNav` side list and `Box hideBelow="lg"`, with a second hand-made bar and a `Dialog` sheet for the menu; it cannot pin the column, has no rail, and the sheet comes from the bottom.
FutMas use: the web admin's frame (F-010): Settings-style groups of destinations (league, teams, schedule, scores, invites), a workspace switcher (`ActionMenu`) at the sidebar top and the account menu at its bottom, a count of waiting work (scores to confirm) on a destination. It must fit a 1366×680 laptop window (full sidebar), an iPad landscape (1180/1194 px: the rail) and an iPad portrait (820/834 px: the bar and drawer).

## Proposed API (from the brief)

```ts
type AppShellNavItem = {
  id: string;
  label: string;
  href: string;
  icon?: ReactNode;
  count?: number;
  countLabel?: string;
  current?: boolean | 'page' | 'location';
};
type AppShellNavGroup = {
  id: string;
  label?: string;
  items: readonly AppShellNavItem[];
};
type AppShellProps = {
  navLabel: string;
  groups: readonly AppShellNavGroup[];
  onNavigate?: (href: string) => void;
  header?: ReactNode;
  footer?: ReactNode;
  railHeader?: ReactNode;
  railFooter?: ReactNode;
  barTitle: ReactNode;
  barEnd?: ReactNode;
  menuIcon: ReactNode;
  labels: { openMenu: string; closeMenu: string };
  children: ReactNode;
};
```

## Accepted API (2026-10-24)

The brief's API, with three changes that follow Scalewing's conventions:

- `onNavigate?: (item: AppShellNavItem) => void`, not `(href: string)`: the same shape as `SectionNav`'s `onNavigate`, which hands the router the whole item (`item.href`, and its `id` for analytics or state). A plain press (main button, no modifier key, not already handled) is prevented and handed over; a press with a modifier key or the middle button keeps the browser's behaviour (a new tab or window); without `onNavigate` the sidebar links carry no handler.
- `icon` is required on every item. In the rail an item is drawn as its glyph alone, so an item without one would be an empty square. A missing icon (`undefined`, `null` or `false`) throws a `RangeError`.
- `navLabel` stays a string rather than `SectionNav`'s `aria-label`/`aria-labelledby` pair: the shell draws the navigation twice (the sidebar's and the drawer's, never both shown) and also names the drawer's `dialog` with it, so an `aria-labelledby` id could not point at words in both.

An item also takes `countTone?: NavCountTone` (added at FutMas's request on 2026-10-24, before the first commit): the pill's colour, NavCount's tones (`danger` by default, `warning` amber for "needs you", `accent` for news; `docs/requests/futmas-nav-count-warning.md`). It needs a `count`.

Items share `SectionNav`'s item rules (`id`, `label`, `href`, `current`, `count`, `countLabel`), and their validation is now one shared module (`components/nav-items.ts`) used by both.

### Layout (generated CSS only)

- From 75rem (1200 px): a full sidebar 15rem wide, on the solid surface with a hairline at its inline end, sticky at the top at the viewport's height (`100dvh`). `header` at its top, the groups, `footer` at its bottom under a hairline; only the nav between them scrolls, and only when it is taller than the window. A group's optional `label` is a small muted caption (sentence case, never uppercase) that names its list. Items show the icon, the label and the count pill; the current one takes a quiet muted fill in the text colour at the label weight, as `SectionNav appearance="filled"` marks it. Items are the sm control (32 px) and the 44 px target on a coarse pointer. The page (`main`) scrolls with the document; it is never its own scroll box.
- From `lg` (64rem) to 75rem: an icon rail, the touch target plus a space-3 gutter each side wide. Labels are visually hidden but stay in each link's accessible name; a `Tooltip` with the label opens on hover and visible focus (its `aria-describedby` reference is dropped, since its words already are the link's name). A count is the same pill at the link's top end corner, read in the name. Group labels are visually hidden (they still name their lists) and every group after the first starts under a hairline. `railHeader`/`railFooter` replace `header`/`footer` (left out, nothing is drawn there in the rail).
- Below `lg`: no sidebar. A sticky top bar drawn as `AppHeader appearance="bar"`: an icon-only ghost menu `Button` named `labels.openMenu` (holding `menuIcon`), `barTitle`, then `barEnd`. The menu opens a modal drawer on the native top layer from the inline start (the end in right-to-left), sliding in unless reduced motion is asked for, holding a close button named `labels.closeMenu` (Dialog's private close glyph) where the menu button was, `header`, the nav and `footer`. It reuses `Dialog`'s close-request mechanics (`useDialogCloseRequests`): Escape, a press on the backdrop or a platform close request close it, and focus returns to the menu button (see the slots note below). A plain press on a destination closes it (a modifier press leaves it open). The drawer also closes if the window widens past `lg`.
- `header`, `footer`, `railHeader` and `railFooter` are drawn in the sidebar, and `header`/`footer` again in the open drawer, so while the drawer is open a slot's content is mounted twice (the sidebar's copy hidden) with separate state. Consumers give slot content no fixed DOM `id` (`useId` instead) and keep state that must be shared, such as a chosen workspace, in their own component. Focus returns to the menu button only after a dismissal (Escape, a press outside, the close button); a chosen destination leaves focus to the page it moves to, and a window widened past `lg` has no menu button to focus.
- The 75rem width is an internal media query of the component (`appShellWideQuery` in `css-app-shell.ts`, not exported). No public breakpoint, utility or token is added. The sidebar's 15rem and the drawer's 20rem are named constants of the generator beside it, as the tooltip's 18rem is; the rail's width is built from the touch target and spacing tokens.
- Forced colours: links are `LinkText`, the current one `CanvasText` with a `Highlight` edge, the hairlines keep their system colour. Reduced motion stops the drawer's slide. Every link and button takes the explicit `tabIndex` (`tabStop`).

### Classes

`sw-app-shell`, `sw-app-shell-bar`, `sw-app-shell-menu`, `sw-app-shell-bar-title`, `sw-app-shell-bar-end`, `sw-app-shell-sidebar`, `sw-app-shell-slot`, `sw-app-shell-rail-slot`, `sw-app-shell-header`, `sw-app-shell-footer`, `sw-app-shell-nav`, `sw-app-shell-group`, `sw-app-shell-group-label`, `sw-app-shell-list`, `sw-app-shell-item`, `sw-app-shell-link`, `sw-app-shell-icon`, `sw-app-shell-label`, `sw-app-shell-count` (one more selector of the shared count pill, `css-count-pill.ts`), `sw-app-shell-main`, `sw-app-shell-drawer`, `sw-app-shell-drawer-top`, `sw-app-shell-close`.

### Refused with a `RangeError`

A blank `navLabel`, `labels.openMenu` or `labels.closeMenu`; no groups; an empty or duplicate group id; a blank group `label`; a group with no items; an empty or duplicate item id (across all groups); an empty item label; a missing icon (or one that draws nothing: a boolean, `''` or `0`); a `count` that is not a whole number from 0; a blank `countLabel` or one without a `count`; an unknown `countTone` or one without a `count`.

No new tokens or dependencies.
