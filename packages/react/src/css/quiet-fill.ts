/**
 * The quiet grey fill: the muted color at 16 % over whatever is beneath
 * (about #E8E8E9 on white). An open menu or list row, a held separator,
 * today's calendar ring fill, a neutral button and a banded dialog's close
 * button all take it, so they read as one grey.
 */
export const quietFill =
  'color-mix(in srgb, var(--sw-color-muted) 16%, transparent)';

/**
 * Muted words keep 4.5:1 on the surface but not on the quiet fill (4.14:1
 * in most light palettes, 3.47:1 in harvest dark), while the text colour
 * keeps it in every palette and scheme. So while a row shows the fill, its
 * parts read the muted token as the text colour: the details, a consumer's
 * `Text color="muted"`, the chevron. `scopes` are selectors for what sits
 * on the fill (`<row>:hover *`), never the element that paints it, whose
 * fill reads the muted token too. Toned words keep their tone. Forced
 * colours replace both colours, so this changes nothing there.
 */
export function mutedReadsAsText(scopes: readonly string[]): string {
  return `${scopes.join(',\n')} {
  --sw-color-muted: var(--sw-color-text);
}`;
}
