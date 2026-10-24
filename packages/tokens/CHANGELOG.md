# @scalewing/tokens

## 1.6.0

### Minor Changes

- 42e696d: Additive. Semantic colours `inverse` and `onInverse`: a dark band and the words on it, such as a site footer or one closing section. Light `#1D1D1F` with `#FFFFFF`, dark `#2C2C2E` with `#F5F5F7`, so the band stays dark in either scheme (16.8:1 and 12.8:1). No palette moves them; a brand sets its band with an overlay (`colors: { inverse: '#0B2038' }`), which `createTheme` accepts as it does every semantic key. Renderers pick the colours up through their caret dependency (ADR 0009): web as `--sw-color-inverse` and `--sw-color-onInverse` (the generated canvas and `ThemeProvider` write every semantic key), native as `theme.colors.inverse`. Request: `docs/requests/teisoro-inverse-colors.md`.

  Renderer sign-off: Claude for both renderer agents, under the owner's Teisoro F-017 approval (2026-10-24); additive, so no renderer change is needed.

## 1.5.0

### Minor Changes

- 3b67cc6: Additive. A generic categorical colour scale (`docs/requests/categorical-colors.md`, Teisoro F-011 release R3): `categoricalHues` (`green`, `blue`, `orange`, `purple`, `teal`, `rose`), `CategoricalHue`, `CategoricalColor` (a hue or `neutral`), `categoricalColorKeys`, `categoricalColors` (`{ light, dark }`, the same fills in both schemes), `categoricalColorFor(color, scheme)` (throws a `RangeError` on an unknown colour), `isCategoricalColor`, `onCategorical` (`#FFFFFF`, the glyph drawn on a fill), `categoricalGlyphContrast` and `categoricalGlyphMinContrast` (3, WCAG 1.4.11 for a glyph). Every fill keeps a white glyph at 3:1 or more (a glyph, WCAG 1.4.11; not a text background) and stands 3:1 apart from the default light and dark surface (palettes with a strong surface may sit closer); orange is darkened from `#E08600` (2.77:1) in 1% steps toward black to `#D57F00` (3.06:1), the others are unchanged. `categoricalColors` is frozen. Hues tell a small set of kinds apart; they carry no meaning and palettes do not overlay them. The semantic colours, `Theme` and `createTheme` are unchanged. Renderers pick it up through their caret dependency (ADR 0009): `@scalewing/react` generates `--sw-categorical-<colour>` for `GlyphTile` in its next minor; native may import it directly.

  Renderer sign-off: the owner delegated plan approval to Claude for Teisoro F-011 (Teisoro decisions O-1 to O-3 and D-1), and Claude, acting for the owner, signed off for both the `@scalewing/react` and the `@scalewing/react-native` agents. The change is additive, so neither renderer needs a change to keep working.

## 1.4.0

### Minor Changes

- 6bc2412: Additive. Semantic colour `accentSubtle`: a quiet fill tinted with the
  accent, and `accentSubtleFor(accent, surface)`. It is a solid mix of 10%
  accent into `surface`, stepped down per palette and scheme until accent on
  it keeps 4.5:1 (WCAG AA for a 13-point semibold label), and `createTheme`
  recomputes it whenever a palette or overlay moves `accent` or `surface`
  unless the overlay sets it. Indigo and signal keep 10% (signal 4.83:1
  light, 7.42:1 dark); the lowest ratio on a tint is 4.51:1. Harvest's dark
  accent is 4.24:1 on its own surface already, so its tint is that surface.
  No fixed mix above 0% passes every palette; see ADR 0011. Renderers pick
  the colour up through their caret dependency (ADR 0009): native as
  `theme.colors.accentSubtle`, web as `--sw-color-accentSubtle`. Consumer
  request: `docs/requests/futmas-accent-subtle.md`.

## 1.3.0

### Minor Changes

- b5a56b7: Additive. Semantic colours `secondary`, `onSecondary`, `tertiary`,
  `onTertiary`, and `subtle`, and a `signal` named palette (cerulean primary,
  near-black secondary, violet tertiary). An unset `secondary` follows
  `surface`, so existing secondary actions keep their outlined look.
  Renderers pick these up through their caret dependency (ADR 0009); the web
  stylesheet emits the new custom properties with its next release, which
  the Button `tertiary` change brings. Consumer request:
  `docs/requests/futmas-action-tiers.md`.
- 2444ec5: Additive. `buttonVariants` gains `tertiary`, and `secondaryActionBorder`
  returns the secondary action's outline: the hairline while `secondary`
  follows `surface`, otherwise the fill itself so no ring shows. Consumer
  request: `docs/requests/futmas-action-tiers.md`.
- 622ab77: Additive. `cardVariants` gains `filled`. Consumer request:
  `docs/requests/futmas-filled-card.md`.

## 1.2.0

### Minor Changes

- 98ffed7: Add the `warning` semantic colour (light `#B54708`, dark `#FDB022`): the caution between `success` and `danger`, readable on the canvas at 4.5:1 in both schemes. `--sw-color-warning` is generated with the other keys and `Text color="warning"` accepts it.

## 1.1.0

### Minor Changes

- f45ef5d: Add `compactTypographyVariants`: the sizes that `display` and `heading` step down to on a compact (phone-width) canvas. Additive; no existing value changes.

## 1.0.0

### Major Changes

- 52b45c0: Start stable versioning at 1.0.0. Packages now release independently with semantic versioning.

  `@scalewing/tokens` no longer contains web CSS. It removes `generateStylesheet`, `utilityClassCatalog`, `buttonClassNames`, `badgeClassNames`, `badgeSizes`, `badgeTones`, `BadgeSize`, `BadgeTone`, `spacingClass`, `PaddingAxis`, `GapAxis`, `paddingAxes`, `gapAxes`, `breakpointScale`, `Breakpoint`, `HideDirection`, `hideClass` (never published), and the `./styles.css` and `./palette/*.css` exports. Web apps keep importing `@scalewing/react/styles.css` and `@scalewing/react/palette/<id>.css`, which are unchanged. `@scalewing/react` now generates that CSS and exports `utilityClassCatalog`, `badgeSizes`, and `badgeTones`.

### Minor Changes

- 3a3240e: Add `Box` `hideBelow` and `hideFrom` responsive visibility props backed by a `md` breakpoint token and generated `sw-hide-*` classes.

## 0.7.0

### Minor Changes

- 630bed9: Add wrapping, accessible FilterChips for long single-choice filter sets.
- fad8f45: Add an accessible React ActionMenu with generated token styling for independent commands.
- 1d69e34: Add a controlled date-only DateField with native calendar behavior and generated styling.
- 05e23f5: Add stable hint, error, and required semantics to Field with generated invalid styling.
- b718519: Add supplementary Tooltip help for labelled triggers with keyboard, pointer, and touch access.
- 9e47362: Add a controlled native Checkbox with generated token styling, validation copy, and accessible form semantics.
- 6dac120: Add a controlled React Switch with native checkbox semantics and generated token styling.
- 39a85a4: Add an accessible indeterminate Spinner with generated animation, size variants, and reduced-motion styling.
- de943eb: Add measured Progress with native progressbar semantics and generated tone styling.
- b0ce196: Add a controlled native RadioGroup with token-generated styling and long-label form choices.
- 944f7ef: Add semantic and decorative horizontal or vertical separators with generated token styling.

## 0.6.1

### Patch Changes

- Keep public package versions aligned with the native TabBar accessibility
  correction. No token API changed.

## 0.6.0

### Minor Changes

- Align the public packages with the 0.6.0 native Accordion release, as required
  by the lockstep release workflow. No new token or DOM component API is added.

## 0.5.0

### Minor Changes

- Keep public package versions matched for the GitHub `v0.5.0` release tag.
  Native Field ships in this version.

## 0.4.0

### Minor Changes

- Keep public package versions matched for the GitHub `v0.4.0` release tag.
  Native TabBar, Table, and SegmentedControl ship in this version.

### Patch Changes

- 01b138f: Point package metadata to the GitHub source repository and document explicit GitHub Actions releases. Package names and runtime APIs are unchanged.

## 0.3.0

### Minor Changes

- 247f158: Adds Accordion, a web disclosure on native details/summary, so in-flow panels can expand without a modal or an always-open Card.
- 247f158: Adds web page chrome: `AppHeader` (sticky glass), `Nav` (label-size link cluster, current page via `aria-current`), compact `Field` (`size="xs"`, `labelVisuallyHidden`), native `select` chevrons, and accent `:focus-visible` on text controls so selects do not keep the user-agent blue ring.
- 247f158: Adds Dialog, a web modal on the native `<dialog>` top layer, so info surfaces can leave nested page flow.
- 247f158: Adds a horizontal BarChart for labeled factor contributions, compact table density (`density="compact"`) with a selected-row marker, and compact Badge chicklets.
- 247f158: Default accent is electric indigo, and glass fill is derived from the merged accent so ThemeProvider overlays retint frost.

  Adds opt-in density (`xs` controls, `data` type, `sw-tabular`) and web `Badge`, `SegmentedControl`, and `Table`. Pin the previous teal with `colors={{ accent: '#0B615E', onAccent: '#FFFFFF' }}` (dark: `#7EDAD6` / `#101214`).

- 247f158: Adds a named palette catalog so products pick a reviewed light/dark overlay instead of copying hex. Apply with ThemeProvider `palette`, `data-palette` on the generated canvas, or `import '@scalewing/react/palette/<id>.css'` after styles.css. Default remains indigo. `colors` still wins over a named palette and may be `{ light, dark }` so end users can switch scheme without the product swapping hex.
- 247f158: Adds Select, a web labeled listbox menu, so a compact choice can open with canvas glass instead of the operating system picker.
- 247f158: Adds Split, a web start pane with a labeled separator, so a column can be resized up to a max width and hidden when dragged too small.
- 247f158: Adds Toast, a web auto-dismiss confirmation on the popover layer that does not trap focus. Optional `anchor` and `target` send it from a press to a destination, then it vanishes. Ghost buttons with `aria-pressed="false"` use quiet opacity so a selected press stays full color.

### Patch Changes

- 247f158: Nested ThemeProvider nodes no longer stretch to the full viewport. Document `min-height: 100vh` stays on the root canvas only.
- 247f158: Adds Select action, a last listbox command that does not become the displayed value.
- 247f158: Stops grouping native select into `:is(input[type=text], select)`, which made the input attribute selector win and wipe chevron padding. Shrink-wrapped Field selects keep a token gutter so the caret is not painted over the last characters.

## 0.2.0

### Minor Changes

- f35314a: Add Button (primary, secondary, ghost, danger; sm and md) for DOM and React Native after FutMas and coach-platform requested the same control. Includes onAccent/onDanger, 44px md hit target, focus ring, and disabled opacity tokens.
- f35314a: Shift the default visual language to a quiet glass canvas: Apple-like neutrals and type, frosted Card, pill buttons, and generated document styles so links and native text controls are not user-agent chrome.

## 0.1.0

### Minor Changes

- Initial foundation: semantic themes, generated `sw-*` layout classes, and CSS custom properties.
