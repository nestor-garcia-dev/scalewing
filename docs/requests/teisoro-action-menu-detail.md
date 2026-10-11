Scalewing request from Teisoro.

Status: released in `@scalewing/react` 1.30.0 (PR #135; Teisoro F-011-S05, release R4 "ledger and navigation", item 17; the redesign inventory's row 4).
Renderer: react
Missing surface: an `ActionMenu` command's trailing value with a chevron (`detail`), and a hairline before a command (`separatorBefore`).
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: the AccountMenu board is a menu with a header (who, role, store), "Language" and "Appearance" commands that end with their current value and a chevron ("English ›", "Light ›"), then a hairline and a red "Sign out". `ActionMenu` has the `header` slot and `destructive`, but a command is only an icon and a label, and nothing separates commands. Teisoro owns no CSS.
Existing surface this might already be: `ActionMenu` (`header`, `destructive`, `lang`), `Select` (a value chooser, not a command).
Workaround I almost used: the value folded into the label ("Language: English").
Teisoro use: `AccountMenu` in the `AreaBar` (splitting `WorkspaceShell.tsx`), on every page.
Proposed API (inventory): `ActionMenuItem.detail?: string`: a trailing grey value ("English") with a chevron.

## Accepted API (2026-10-11)

- `ActionMenuItem.detail?: string`: the command's current value at its inline end, in the muted colour, then a chevron (Select's stroke, pointing to the inline end, mirrored right to left, `aria-hidden`). It is part of the command's accessible name ("Language English"). Meant for a short value: a long one wraps between words, never inside one, with the chevron last; `CanvasText` chevron in forced colours. The command runs like any other: no submenu, no `aria-haspopup`, so a command that opens a dialog or a picker says so in its label. Known limit: a detail always comes with its chevron (a status value without one is not built). A blank `detail` throws a `RangeError`.
- `ActionMenuItem.detailLang?: string` (added): the BCP 47 language of `detail` when it is not the page's, as `lang` is for the label ("Español" on an English page); blank, or without a `detail`, it throws.
- `ActionMenuItem.separatorBefore?: boolean` (added, for the board's hairline before Sign out): a `role="separator"` hairline in the border colour before the command, a `space-1` margin above and below; the arrow keys move between commands only, and it is never drawn before the first command.
- Generated classes `sw-action-menu-detail`, `sw-action-menu-chevron`, `sw-action-menu-separator`.
- Sizes and looks on Scalewing's scale (Teisoro D-2): commands keep ActionMenu's heights (28 on a fine pointer, 44 on a coarse one; board 44) and label type 15; the detail sits `space-3` (12) at least from the label and `space-2` (8) from its chevron (the board's "English ›" is text with a character chevron); the menu is as wide as its longest command, not a fixed 300; the header and the danger "Sign out" use the existing `header` and `destructive` (the board's Sign out is weight 600; every command here keeps the menu's regular weight).

Evidence: `action-menu-detail.test.tsx` (the detail and its `lang`, the hidden chevron, the name, no detail when unset, one separator never first, ArrowDown, ArrowUp, Home and End across separators, the failures, the generated rules including word wrapping and the forced-colours chevron); gallery "ActionMenu" (a "Ranger" menu with a header, Language Español, Appearance Light, a long command with a long detail, and a separated "Leave the reserve"); `apps/gallery/e2e/action-menu.spec.ts` on desktop-en, mobile-es and forced-colors (the name "Language Español", the detail after the label in the muted colour, the chevron last and hidden, a 1 px separator, ArrowDown skipping it, the long detail wrapping between whole words with its chevron last and inside the menu, the chevron drawn in forced colours).
