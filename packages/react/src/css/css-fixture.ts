import { typographyVariants } from '@scalewing/tokens';

import { breakpointQuery } from './breakpoints.js';
import { chevronStrokeIn } from './chevron.js';
import { quietFill } from './quiet-fill.js';
import { touchTarget } from './touch-target.js';

const caption = typographyVariants.caption;
const label = typographyVariants.label;

export const fixtureCenterKinds = ['time', 'score'] as const;

/** `time` is a kickoff time in a grey chip; `score` is bold figures. */
export type FixtureCenterKind = (typeof fixtureCenterKinds)[number];

const belowMd = breakpointQuery('below', 'md');

/*
 * The run: one grid whose columns are the home side, the centre, the away
 * side, the end (details and status) and the chevron. Each item and its
 * row are subgrids of it, so every row's centre and end line up down the
 * run. The space between the columns is the centre's, the end's and the
 * chevron's own margin, so a run with no end or chevron keeps no gap for
 * them.
 */
function listRules(): string {
  return `.sw-fixture-group {
  display: flex;
  flex-direction: column;
}

.sw-fixture-group-title {
  color: var(--sw-color-muted);
  font-family: var(--sw-font-sans);
  font-size: ${caption.fontSize}px;
  font-weight: 600;
  letter-spacing: ${caption.letterSpacing}px;
  line-height: ${caption.lineHeight}px;
  padding-block: var(--sw-space-2) var(--sw-space-1);
}

.sw-fixture-list {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) auto auto;
  list-style: none;
  margin: 0;
  padding: 0;
}

.sw-fixture-item,
.sw-fixture-row {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: subgrid;
}

.sw-fixture-item {
  border-top: 1px solid var(--sw-color-border);
}`;
}

/*
 * A row: the md control height (44 px), its parts centred on one line a
 * space-3 apart; a link or button row is the whole target, the text
 * colour, the quiet fill on hover and an inset accent ring, with the
 * shared chevron at the end. The sides' names are label type at weight 500
 * and wrap; the home side ends at the centre (its mark nearest it), the
 * away side starts from it, mirrored in right-to-left.
 */
function rowRules(): string {
  return `.sw-fixture-row {
  align-items: center;
  appearance: none;
  background: transparent;
  border: 0;
  box-sizing: border-box;
  color: var(--sw-color-text);
  font-family: var(--sw-font-sans);
  font-size: ${label.fontSize}px;
  letter-spacing: ${label.letterSpacing}px;
  line-height: ${label.lineHeight}px;
  margin: 0;
  min-height: ${touchTarget};
  padding: var(--sw-space-2);
  row-gap: var(--sw-space-1);
  text-align: start;
  text-decoration: none;
  width: 100%;
}

.sw-fixture-row-pressable { cursor: pointer; }

@media (hover: hover) {
  .sw-fixture-row-pressable:hover { background: ${quietFill}; }
}

.sw-fixture-row-pressable:focus { outline: none; }

.sw-fixture-row-pressable:focus-visible {
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);
  outline-offset: calc(-1 * var(--sw-focus-ring-width));
}

[data-theme] a.sw-fixture-row,
[data-theme] a.sw-fixture-row:hover {
  color: var(--sw-color-text);
}

[data-theme] a.sw-fixture-row:focus-visible {
  outline-offset: calc(-1 * var(--sw-focus-ring-width));
}

.sw-fixture-team {
  align-items: center;
  display: flex;
  gap: var(--sw-space-2);
  min-width: 0;
}

.sw-fixture-team-home {
  grid-column: 1;
  justify-content: flex-end;
  text-align: end;
}

.sw-fixture-team-away {
  grid-column: 3;
}

.sw-fixture-name {
  font-weight: 500;
  min-width: 0;
  overflow-wrap: anywhere;
}

.sw-fixture-mark {
  display: inline-flex;
  flex: none;
}

.sw-fixture-center {
  font-variant-numeric: tabular-nums;
  grid-column: 2;
  margin-inline: var(--sw-space-3);
  justify-self: center;
  white-space: nowrap;
}

.sw-fixture-center-time {
  background: var(--sw-color-subtle);
  border-radius: var(--sw-radius-sm);
  font-size: ${caption.fontSize}px;
  font-weight: 600;
  letter-spacing: ${caption.letterSpacing}px;
  line-height: ${caption.lineHeight}px;
  padding: calc(var(--sw-space-1) / 2) var(--sw-space-2);
}

.sw-fixture-center-score {
  font-weight: 700;
}

.sw-fixture-end {
  align-items: center;
  color: var(--sw-color-muted);
  display: flex;
  flex-wrap: wrap;
  font-size: ${caption.fontSize}px;
  gap: var(--sw-space-2);
  grid-column: 4;
  justify-content: flex-end;
  letter-spacing: ${caption.letterSpacing}px;
  margin-inline-start: var(--sw-space-3);
  line-height: ${caption.lineHeight}px;
}

.sw-fixture-chevron {
  ${chevronStrokeIn('var(--sw-color-muted)')}
  grid-column: 5;
  justify-self: end;
  margin-inline: var(--sw-space-3) var(--sw-space-1);
  transform: rotate(-45deg);
}

.sw-fixture-chevron:dir(rtl) { transform: rotate(135deg); }

@media (forced-colors: active) {
  .sw-fixture-row-pressable:hover {
    outline: var(--sw-focus-ring-width) solid Highlight;
    outline-offset: calc(-1 * var(--sw-focus-ring-width));
  }
  .sw-fixture-center-time { border: 1px solid CanvasText; }
  .sw-fixture-chevron { border-color: CanvasText; }
}`;
}

/*
 * Below `md`: three columns and the chevron, the end on a second line
 * from the start. After the row rules, so it wins over their placement.
 */
function narrowRules(): string {
  return `@media ${belowMd} {
  .sw-fixture-list {
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) auto;
  }

  .sw-fixture-end {
    grid-column: 1 / 4;
    grid-row: 2;
    justify-content: flex-start;
    margin-inline-start: 0;
  }

  .sw-fixture-chevron {
    grid-column: 4;
    grid-row: 1 / span 2;
  }
}`;
}

/*
 * Without subgrid (Chrome before 117, Safari before 16): each row is its
 * own grid of the same columns, so a row still reads in order and the
 * centres sit near the middle, but they do not line up down the run.
 */
function fallbackRules(): string {
  return `@supports not (grid-template-columns: subgrid) {
  .sw-fixture-item {
    display: block;
  }

  .sw-fixture-row {
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) auto auto;
  }

  @media ${belowMd} {
    .sw-fixture-row {
      grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) auto;
    }
  }
}`;
}

/* FixtureGroup and FixtureRow (see components/FixtureRow.tsx). */
export function cssFixtureClasses(): string {
  return `${listRules()}

${rowRules()}

${narrowRules()}

${fallbackRules()}`;
}

export function fixtureClassCatalog(): string[] {
  return [
    'sw-fixture-group',
    'sw-fixture-group-title',
    'sw-fixture-list',
    'sw-fixture-item',
    'sw-fixture-row',
    'sw-fixture-row-pressable',
    'sw-fixture-team',
    'sw-fixture-team-home',
    'sw-fixture-team-away',
    'sw-fixture-name',
    'sw-fixture-mark',
    'sw-fixture-center',
    ...fixtureCenterKinds.map((kind) => `sw-fixture-center-${kind}`),
    'sw-fixture-end',
    'sw-fixture-chevron',
  ];
}
