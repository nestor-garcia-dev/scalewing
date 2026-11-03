import { typographyVariants } from '@scalewing/tokens';

const body = typographyVariants.body;
const caption = typographyVariants.caption;

/*
 * FixtureCard draws no edge, fill or radius: it sits inside a Card. The two
 * side rows share one shape, a name column and an `auto` box column, so
 * their boxes (FixtureRow's `sw-fixture-score-box`, 32 px on a fine pointer
 * and 44 px on a coarse one, and FixtureRow's forced-colours rules with it)
 * line up at the end. Names wrap and never truncate.
 */
function cardRules(): string {
  return `.sw-fixture-card {
  color: var(--sw-color-text);
  font-family: var(--sw-font-sans);
  min-width: 0;
}

.sw-fixture-card-top {
  align-items: center;
  display: flex;
  gap: var(--sw-space-2);
  margin-block-end: var(--sw-space-2);
}

.sw-fixture-card-meta {
  color: var(--sw-color-muted);
  font-size: ${caption.fontSize}px;
  letter-spacing: ${caption.letterSpacing}px;
  line-height: ${caption.lineHeight}px;
  min-width: 0;
}

.sw-fixture-card-menu {
  flex: none;
  margin-inline-start: auto;
}

.sw-fixture-card-side {
  align-items: center;
  column-gap: var(--sw-space-3);
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
}

.sw-fixture-card-side + .sw-fixture-card-side {
  margin-block-start: var(--sw-space-2);
}

.sw-fixture-card-team {
  min-width: 0;
}

.sw-fixture-card-name {
  font-size: ${body.fontSize}px;
  font-weight: 500;
  letter-spacing: ${body.letterSpacing}px;
  line-height: ${body.lineHeight}px;
  overflow-wrap: anywhere;
}

.sw-fixture-card-note {
  color: var(--sw-color-muted);
  font-size: ${caption.fontSize}px;
  letter-spacing: ${caption.letterSpacing}px;
  line-height: ${caption.lineHeight}px;
  overflow-wrap: anywhere;
}`;
}

/*
 * The score's message is a live region, so it stays in place while empty; a
 * block with no words has no height, and its margin comes only with words.
 */
function belowRules(): string {
  return `.sw-fixture-card-error {
  color: var(--sw-color-danger);
  display: block;
  font-size: ${caption.fontSize}px;
  letter-spacing: ${caption.letterSpacing}px;
  line-height: ${caption.lineHeight}px;
}

.sw-fixture-card-error:not(:empty) {
  margin-block-start: var(--sw-space-2);
}

.sw-fixture-card-actions {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: var(--sw-space-2);
  margin-block-start: var(--sw-space-3);
}

.sw-fixture-card-detail {
  margin-block-start: var(--sw-space-2);
  min-width: 0;
}`;
}

/* FixtureCard (see components/FixtureCard.tsx); after the score's rules. */
export function cssFixtureCardClasses(): string {
  return `${cardRules()}

${belowRules()}`;
}

export function fixtureCardClassCatalog(): string[] {
  return [
    'sw-fixture-card',
    'sw-fixture-card-top',
    'sw-fixture-card-meta',
    'sw-fixture-card-menu',
    'sw-fixture-card-side',
    'sw-fixture-card-team',
    'sw-fixture-card-name',
    'sw-fixture-card-note',
    'sw-fixture-card-error',
    'sw-fixture-card-actions',
    'sw-fixture-card-detail',
  ];
}
