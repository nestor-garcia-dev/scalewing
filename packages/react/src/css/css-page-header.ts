import { typographyVariants } from '@scalewing/tokens';

import { chevronStrokeIn } from './chevron.js';
import { coarsePointerQuery, touchTarget } from './touch-target.js';

const label = typographyVariants.label;

/*
 * The title's least width beside the actions: narrower than this, the
 * actions wrap under the words instead of squeezing the title.
 */
const wordsMinWidth = '20rem';

/*
 * A page's header: the back link, then the title's row, then the part below.
 * The row wraps as a whole: the words take the free space and keep at least
 * their least width (or all of a narrower row), and the actions, which wrap
 * among themselves, sit at the end, or under the words at the start when
 * they do not fit beside them.
 */
function layoutRules(): string {
  return `.sw-page-header {
  display: flex;
  flex-direction: column;
  gap: var(--sw-space-3);
  min-width: 0;
}

.sw-page-header-row {
  align-items: flex-start;
  display: flex;
  flex-wrap: wrap;
  gap: var(--sw-space-3) var(--sw-space-4);
  min-width: 0;
}

.sw-page-header-words {
  display: flex;
  flex: 1 1 min(100%, ${wordsMinWidth});
  flex-direction: column;
  gap: var(--sw-space-1);
  min-width: 0;
  overflow-wrap: anywhere;
}

.sw-page-header-actions {
  align-items: center;
  display: flex;
  flex: 0 1 auto;
  flex-wrap: wrap;
  gap: var(--sw-space-2);
  max-width: 100%;
  min-width: 0;
}

.sw-page-header-below {
  min-width: 0;
}`;
}

/*
 * The back link: the canvas's accent link in label type at weight 500, a
 * shared chevron pointing back before its words, mirrored in right-to-left,
 * at the xs control's height and the 44 px target on a coarse pointer. The
 * chevron is a border, so forced colours keep it in the link's colour.
 */
function backRules(): string {
  return `.sw-page-header-back {
  align-items: center;
  align-self: flex-start;
  display: inline-flex;
  font-family: var(--sw-font-sans);
  font-size: ${label.fontSize}px;
  font-weight: 500;
  gap: var(--sw-space-2);
  letter-spacing: ${label.letterSpacing}px;
  line-height: ${label.lineHeight}px;
  max-width: 100%;
  min-height: var(--sw-control-xs-min-height);
  overflow-wrap: anywhere;
}

.sw-page-header-back::before {
  ${chevronStrokeIn('currentColor')}
  content: '';
  flex: none;
  transform: rotate(135deg);
}

.sw-page-header-back:dir(rtl)::before { transform: rotate(-45deg); }

@media ${coarsePointerQuery} {
  .sw-page-header-back { min-height: ${touchTarget}; }
}`;
}

/* PageHeader (see components/PageHeader.tsx). */
export function cssPageHeaderClasses(): string {
  return `${layoutRules()}

${backRules()}`;
}

export function pageHeaderClassCatalog(): string[] {
  return [
    'sw-page-header',
    'sw-page-header-back',
    'sw-page-header-row',
    'sw-page-header-words',
    'sw-page-header-actions',
    'sw-page-header-below',
  ];
}
