Scalewing request from Teisoro.

Status: implemented on `claude/teisoro-f006-s11-parts` for Teisoro F-006-S11 task 1875; pull request pending review.
Renderer: react
Missing surface: `SectionNav`, a section (secondary) navigation: links between the pages of one area with `aria-current`, quieter than the workspace's navigation, that can become a side list on wide screens.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: `Nav` is a label-size cluster of `Box as="a"` links in the canvas's accent link color, with no current-item mark beyond the text color and no side-list form; `Tabs` is a `tablist` for panels on one page and `SegmentedControl` a `radiogroup` for an exclusive choice, both the wrong semantics for links to other pages.
Existing surface this might already be: `Nav` (a workspace's destinations), `Tabs`, `SegmentedControl`.
Workaround I almost used: what Teisoro ships today, `Nav` with small `Button`s (`secondary` for the current section, `ghost` for the others) and `aria-current` on the button (F-006-S01, `apps/teisoro-web/src/app/admin/AdminSections.tsx`), which announces buttons, not links, and cannot be opened in a new tab.
Source: Teisoro F-006-S01 task 1710, the Admin portal's design pass, review finding m11 ("ADM-1"). The portal has two sections, Review and Employees (F-006-S09), and will gain Store settings (F-005).
Teisoro use: the Admin portal's sections at `/admin/review` and `/admin/employees`, a row above the page at every width now; a side list is possible once the portal has more sections.

Proposed API: `SectionNav` with `aria-label` or `aria-labelledby`, `items: readonly { id: string; label: string; href: string; current?: 'page' | 'location' | boolean; icon?: ReactNode }[]`, `onNavigate?: (item) => void`, `verticalFrom?: Breakpoint`.

Behavior and failure boundary:

- Markup: `nav.sw-section-nav` named by the consumer, `ul.sw-section-nav-list`, one `li` and `a.sw-section-nav-link` per item with the item's `href`; `aria-current` is `page`, `location`, or `true` for `true`, and absent otherwise. An icon is a decorative `aria-hidden` span before the label.
- Look: a row that wraps over a hairline, each link label-size and muted with the xs control's inline padding and the sm control's height, no underline and no fill; hover a soft fill and the text color; the current link (any `aria-current`) the text color over a two-pixel accent underline that sits on the hairline, as `Tabs` marks its tab. The link rules start at `[data-theme]` so they outrank the canvas's accent link color. Focus shows the accent ring inside the link. A coarse pointer gets the 44 px height. Forced colors: `LinkText`, the current one `CanvasText` with a `Highlight` mark.
- `verticalFrom="md"`: from 48rem up the list is a column with no hairline, each link the column's width with a two-pixel bar at its inline start (radius mirrored right to left), the current one's bar in the accent. The consumer puts the nav beside its content (a `Grid` column, a `Split` pane).
- `onNavigate`: a plain primary press (no Meta, Control, Shift or Alt, not already prevented) is prevented and handed to `onNavigate`, so a client router moves; a modified or middle press keeps the browser's behavior (a new tab or window). Without `onNavigate` the links navigate.
- Empty or duplicate ids and empty labels throw a `RangeError`.

Rejected alternatives:

- A `Nav variant="section"`. `Nav` is a `Box` the consumer fills with its own links; the section navigation needs its own markup (the list, the current mark, the vertical form), which a variant of a layout box would hide.
- `Tabs` with links. A tablist's arrow keys and `aria-selected` say "panels on this page".
- Buttons that call a router (today's workaround). Links are the semantics of navigation and keep a new tab one press away.

Evidence: `section-nav.test.tsx` (a labelled nav of links in a list, `aria-current` mapped from `page`, `location`, `true` and `false`; a plain press prevented and handed to `onNavigate`, modified and middle presses left to the browser; links navigate without it; an icon and the vertical class; the refusals; the generated rules); `apps/gallery/e2e/section-nav.spec.ts` on desktop-en, mobile-es and forced-colors: the gallery's "Reserve office" marks Counts as the page, the others muted with no underline; at 390 px a row marked by the underline, 44 px targets on the coarse pointer; at 1280 px a side list marked by the bar; a press makes Rangers the page and a page inside it keeps it as `location`; Tab moves between the links with a visible ring.
