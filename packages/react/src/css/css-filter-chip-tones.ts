import { toneTintFill, toneTintInk } from './tone-tint.js';

/*
 * A warning chip, while it is not chosen, is the warning tint with its
 * words and count in the warning ink, as a warning Notice's (4.5:1 on the
 * tint in every palette). It keeps the chips' hairline, so an error's
 * danger edge still shows on it. Chosen, it is the accent like every chip;
 * with nothing to count it is quiet like every chip. Forced colours draw
 * it as every chip, so its words say why it matters. The focus ring sits
 * outside the face (the chips' ring offset), on the page, not on the tint.
 */
export const warningChipUnchosen =
  '.sw-filter-chip-warning:not(.sw-filter-chip-quiet) .sw-filter-chip-input:not(:checked) + .sw-filter-chip-face';

export function cssFilterChipToneClasses(): string {
  return `${warningChipUnchosen} {
  background: ${toneTintFill('warning')};
  color: ${toneTintInk('warning')};
}

${warningChipUnchosen} .sw-filter-chip-count {
  color: inherit;
}

@media (forced-colors: active) {
  ${warningChipUnchosen} { background: Canvas; color: CanvasText; }
}`;
}

export function filterChipToneClassCatalog(): string[] {
  return ['sw-filter-chip-warning'];
}
