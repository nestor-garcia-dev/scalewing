import { typographyVariants } from '@scalewing/tokens';

import { chevronStrokeIn } from './chevron.js';
import { iconButtonRules } from './css-icon-button.js';

const caption = typographyVariants.caption;

/*
 * A pager: the consumer's range words at the inline start in the muted
 * caption, the previous and next steps at the end, wrapping under the
 * words on a narrow column. The steps are icon-only neutral Buttons,
 * square at their size and the touch target on a coarse pointer
 * (`iconButtonRules`).
 *
 * Their glyph is private control chrome: the shared stroked chevron
 * (`chevron.ts`) in the button's colour, pointing toward the inline start
 * for the previous page and the end for the next; right to left one flip
 * of the turned chevron mirrors both. It is the chevron Accordion, Select
 * and the menus draw, not DateField's month steps (an SVG at a larger
 * size inside the calendar).
 */
export function cssPaginationClasses(): string {
  return `.sw-pagination {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: var(--sw-space-2) var(--sw-space-3);
}

.sw-pagination-range {
  color: var(--sw-color-muted);
  font-family: var(--sw-font-sans);
  font-size: ${caption.fontSize}px;
  font-variant-numeric: tabular-nums;
  letter-spacing: ${caption.letterSpacing}px;
  line-height: ${caption.lineHeight}px;
}

.sw-pagination-steps {
  display: flex;
  gap: var(--sw-space-2);
  margin-inline-start: auto;
}

${iconButtonRules('sw-pagination-step')}

.sw-pagination-glyph {
  ${chevronStrokeIn('currentColor')}
  display: block;
}

.sw-pagination-glyph-previous { transform: translateX(25%) rotate(135deg); }
.sw-pagination-glyph-next { transform: translateX(-25%) rotate(-45deg); }
.sw-pagination-glyph:dir(rtl) { scale: -1 1; }`;
}

export function paginationClassCatalog(): string[] {
  return [
    'sw-pagination',
    'sw-pagination-range',
    'sw-pagination-steps',
    'sw-pagination-step',
    'sw-pagination-glyph',
    'sw-pagination-glyph-previous',
    'sw-pagination-glyph-next',
  ];
}
