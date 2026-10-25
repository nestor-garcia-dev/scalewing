import { typographyVariants } from '@scalewing/tokens';

import { breakpointQuery } from './breakpoints.js';
import { toneTintFill, toneTintInk } from './tone-tint.js';

const caption = typographyVariants.caption;
const belowMd = breakpointQuery('below', 'md');

export const fixtureFlagTones = ['warning', 'danger'] as const;

/** A flag's colour: `warning` (amber) needs the person; `danger` is red. */
export type FixtureFlagTone = (typeof fixtureFlagTones)[number];

/*
 * The flag: a round mark a space-4 across, its own item at the row's start
 * (first in the row's words). From md it sits on the first line, the home
 * side kept clear of it; below md it leads the second line, before the
 * details, so it never squeezes the home name. The tone's tint with a "!"
 * and an edge in the tone's ink keep 3:1 against the surface in every
 * palette, and its shape, not its colour alone, says it is there. Forced
 * colours draw it in the text colour.
 */
function flagRules(): string {
  return `.sw-fixture-flag {
  align-self: center;
  display: inline-flex;
  grid-column: 1;
  grid-row: 1;
  justify-self: start;
}

.sw-fixture-row-flagged .sw-fixture-team-home {
  padding-inline-start: calc(var(--sw-space-4) + var(--sw-space-2));
}

.sw-fixture-flag-mark {
  align-items: center;
  border: 1px solid currentColor;
  border-radius: var(--sw-radius-pill);
  box-sizing: border-box;
  display: inline-flex;
  font-size: ${caption.fontSize}px;
  font-weight: 700;
  height: var(--sw-space-4);
  justify-content: center;
  line-height: 1;
  width: var(--sw-space-4);
}

.sw-fixture-flag-mark::after { content: '!'; }

${fixtureFlagTones
  .map(
    (tone) => `.sw-fixture-flag-${tone} .sw-fixture-flag-mark {
  background: ${toneTintFill(tone)};
  color: ${toneTintInk(tone)};
}`,
  )
  .join('\n\n')}

@media (forced-colors: active) {
  .sw-fixture-flag .sw-fixture-flag-mark { color: CanvasText; }
}`;
}

/* Below `md` the flag leads the details' line; after the row's narrow rules. */
function flagNarrowRules(): string {
  return `@media ${belowMd} {
  .sw-fixture-flag { grid-row: 2; }

  .sw-fixture-row-flagged .sw-fixture-team-home { padding-inline-start: 0; }

  .sw-fixture-row-flagged .sw-fixture-end {
    padding-inline-start: calc(var(--sw-space-4) + var(--sw-space-2));
  }
}`;
}

/* FixtureRow's flag (see components/FixtureRow.tsx); after the row rules. */
export function cssFixtureFlagClasses(): string {
  return `${flagRules()}

${flagNarrowRules()}`;
}

export function fixtureFlagClassCatalog(): string[] {
  return [
    'sw-fixture-row-flagged',
    'sw-fixture-flag',
    'sw-fixture-flag-mark',
    ...fixtureFlagTones.map((tone) => `sw-fixture-flag-${tone}`),
  ];
}
