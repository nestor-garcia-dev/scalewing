Scalewing request from Teisoro.

Status: released in `@scalewing/react` 1.32.0 (PR #147; accepted 2026-10-11; Teisoro F-011 release R6 "canvas fidelity", S17 shell; plan approval under Teisoro decisions O-1 to O-4, D-1, D-2).
Renderer: react
Missing surface: `Nav` `appearance="words"`: a workspace's destinations drawn as plain words. An extension of `Nav` (`teisoro-nav.md`), not a new component.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: the F-011 shell (ShellProposed and every page board) draws the top navigation as words: "Services" in the text color at 600, "POS registers", "Vault", "Admin" muted at 500, no fill, no outline, no underline. Teisoro's shell renders each destination as a `Button` in `Nav` (primary for the current one, ghost for the others) so it can guard navigation, which paints the current one as an accent pill. A link cluster would lose the guard; Teisoro owns no CSS.
Existing surface this might already be: `SectionNav` (an area's sections, underline or filled marker, links only); `Nav` with ghost Buttons for every item (no current mark at all).
Workaround I almost used: every destination a ghost Button and the current one bold through a `Text` child (the ghost's accent color stays).
Teisoro use: the shell's top navigation (S17).
Proposed API: `appearance?: 'default' | 'words'` on `Nav`.

## Accepted API (2026-10-11)

- `NavProps.appearance?: NavAppearance` (`'default' | 'words'`, default `default`, unchanged; `navAppearances` exported).
- `words`: `.sw-nav.sw-nav-words :is(a, .sw-button)` (0,3,0, after the Button variants) takes a transparent background, a transparent 1 px border (links too), `--sw-color-muted`, label type at weight 500 and no text decoration; hover turns it the text color where the pointer can hover (`(hover: hover)`), never a disabled one; `[aria-current]:not([aria-current='false'])` takes `--sw-color-text` at the label weight (600). A Button keeps its size, padding, 44 px coarse-pointer target and focus ring. Forced colors draw the current destination's border in Highlight and underline its words.
- The current mark is color plus weight (500 against 600), the board's look; the weight is the non-color cue (WCAG 1.4.1), subtle by the board's choice. So the words must be visible: a glyph-only destination has no weight to change and would be marked by color alone. A glyph rail keeps `default`. **Teisoro follow-up (S17):** the shell's below-lg rail of glyph-only destinations (WorkspaceShell) must keep `appearance="default"` there, or show the labels at every width, before it adopts `words`.
- Muted words are 4.5:1 on the canvas (checked in e2e). On the glass AppHeader they keep the muted color's own contract on that fill.
- Sizes (D-2): label type 15/20 (board 15); the board's 56 px tall links follow the header's height, not this option.
- An unknown value throws a `RangeError`. Generated class `sw-nav-words`, rules in `css-nav-words.ts`, emitted from `css-chrome.ts`.

Evidence: `nav-words.test.tsx` (default unchanged, the class with link and Button children unchanged in markup, unknown throws, the generated rules and their order after the Button variants); gallery "Nav" ("Field stations"); `apps/gallery/e2e/nav-words.spec.ts` on desktop-en, mobile-es and forced-colors (no fill, the current one 600 in the text color and the others, a link and a destination in a Tooltip included, 500 muted at 4.5:1, a disabled one, the mark moving with a press, the Highlight border and underline in forced colors).
