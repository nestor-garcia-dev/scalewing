import { typographyVariants } from '@scalewing/tokens';

import { breakpointQuery } from './breakpoints.js';

const { caption, label } = typographyVariants;

/*
 * An article is a card at the reading width (--sw-reading-max): its cover
 * photo edge to edge across the top at 3:1 (2:1 on a phone), rounded with
 * the card's top corners, then its words a space-6 below and above and a
 * space-8 in from the sides (space-5 all round on a phone). The eyebrow
 * is caption type at the label's weight, muted, with the actions at its
 * row's end (when the row is too narrow they wrap under it, at its
 * start); the title a space-3 under it; the meta line muted caption type
 * a space-3 under the title; a hairline a space-3 under that, and the
 * body a space-4 under the hairline. The card sits at the start of a
 * wider column, as a page's main column does.
 */
export function cssArticleClasses(): string {
  return `.sw-article {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  max-inline-size: var(--sw-reading-max);
  min-width: 0;
}

.sw-article-cover {
  aspect-ratio: 3 / 1;
  background: var(--sw-color-subtle);
  border-start-end-radius: inherit;
  border-start-start-radius: inherit;
  display: block;
  inline-size: 100%;
  object-fit: cover;
}

.sw-article-body {
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: var(--sw-space-6) var(--sw-space-8);
}

.sw-article-header {
  display: flex;
  flex-direction: column;
  margin-block-end: var(--sw-space-3);
  min-width: 0;
}

.sw-article-top {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: var(--sw-space-3);
  justify-content: space-between;
  margin-block-end: var(--sw-space-3);
}

.sw-article-eyebrow {
  color: var(--sw-color-muted);
  font-size: ${caption.fontSize}px;
  font-weight: ${label.fontWeight};
  letter-spacing: ${caption.letterSpacing}px;
  line-height: ${caption.lineHeight}px;
  min-width: 0;
  overflow-wrap: anywhere;
}

.sw-article-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sw-space-2);
}

.sw-article-actions:only-child { margin-inline-start: auto; }

.sw-article-title { overflow-wrap: anywhere; }

.sw-article-meta {
  color: var(--sw-color-muted);
  font-size: ${caption.fontSize}px;
  letter-spacing: ${caption.letterSpacing}px;
  line-height: ${caption.lineHeight}px;
  margin-block-start: var(--sw-space-3);
  overflow-wrap: anywhere;
}

.sw-article-content {
  margin-block-start: var(--sw-space-4);
  min-width: 0;
}

@media ${breakpointQuery('below', 'md')} {
  .sw-article-cover { aspect-ratio: 2 / 1; }
  .sw-article-body { padding: var(--sw-space-5); }
}`;
}

export function articleClassCatalog(): string[] {
  return [
    'sw-article',
    'sw-article-cover',
    'sw-article-body',
    'sw-article-header',
    'sw-article-top',
    'sw-article-eyebrow',
    'sw-article-actions',
    'sw-article-title',
    'sw-article-meta',
    'sw-article-content',
  ];
}
