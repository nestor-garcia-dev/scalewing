import { type BadgeTone, badgeTones } from './css-data.js';

/**
 * The tones a single count can take. `neutral` is the cell's own look, so it
 * adds no class: a cell is toned only by a tone that says something.
 */
const cellTones = badgeTones.filter((tone) => tone !== 'neutral');

/**
 * The classes that tone one count: a marker that applies the shared rules and
 * the tone that sets their color. A strip cell (`td`) and a tile (`li`) take
 * the same pair; null or `neutral` leaves the cell untoned.
 */
export function denominationCellToneClassNames(
  tone: BadgeTone | null | undefined,
): string[] {
  if (!tone || tone === 'neutral') return [];
  return ['sw-denomination-cell-toned', `sw-denomination-cell-tone-${tone}`];
}

/*
 * A toned count is set in its tone, over a row's signed coloring and a
 * zero's quiet opacity, and a toned tile draws its border in the tone, one
 * hairline thicker with an inset shadow so no tile moves. The tone never
 * carries meaning alone: the consumer's words say why a count is toned.
 * Forced colors replace the tone with the system text color, and a toned
 * zero keeps the zero's GrayText there, so it does not read as a count.
 */
export function cssDenominationCellToneClasses(): string {
  const toneRules = cellTones
    .map(
      (tone) =>
        `.sw-denomination-cell-tone-${tone} { --sw-denomination-cell-tone: var(--sw-color-${tone}); }`,
    )
    .join('\n');

  return `${toneRules}

.sw-denomination-grid .sw-denomination-cell.sw-denomination-cell-toned,
.sw-denomination-grid .sw-denomination-cell-toned .sw-denomination-cell {
  color: var(--sw-denomination-cell-tone);
  opacity: 1;
}

.sw-denomination-tile.sw-denomination-cell-toned {
  border-color: var(--sw-denomination-cell-tone);
  box-shadow: inset 0 0 0 1px var(--sw-denomination-cell-tone);
}

@media (forced-colors: active) {
  .sw-denomination-grid .sw-denomination-cell-zero.sw-denomination-cell-toned,
  .sw-denomination-grid .sw-denomination-cell-toned .sw-denomination-cell-zero { color: GrayText; }
}`;
}

export function denominationCellToneClassCatalog(): string[] {
  return [
    'sw-denomination-cell-toned',
    ...cellTones.map((tone) => `sw-denomination-cell-tone-${tone}`),
  ];
}
