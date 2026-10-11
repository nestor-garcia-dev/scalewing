import { type BadgeTone, badgeTones } from './css-data.js';
import { toneTintFill, toneTintInk } from './tone-tint.js';

export const denominationCellToneAppearances = ['text', 'pill'] as const;

/**
 * How a toned count shows its tone: `text` sets the count in the tone;
 * `pill` sets it on a rounded tint of the tone in the tone's ink, the
 * Notice's fill and words, in a strip's read-only counts.
 */
export type DenominationCellToneAppearance =
  (typeof denominationCellToneAppearances)[number];

export const denominationCellTonesPillClass = 'sw-denomination-cell-tones-pill';

/**
 * The tones a single count can take. `neutral` is the cell's own look, so it
 * adds no class: a cell is toned only by a tone that says something.
 */
const cellTones = badgeTones.filter(
  (tone): tone is Exclude<BadgeTone, 'neutral'> => tone !== 'neutral',
);

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
 * Under the `pill` appearance a strip's read-only count sits on a rounded
 * tint of its tone in the tone's ink (the Notice's fill and words); forced
 * colors outline the pill instead, so the mark survives without its fill.
 */
export function cssDenominationCellToneClasses(): string {
  const toneRules = cellTones
    .map(
      (tone) =>
        `.sw-denomination-cell-tone-${tone} { --sw-denomination-cell-tone: var(--sw-color-${tone}); --sw-denomination-cell-fill: ${toneTintFill(tone)}; --sw-denomination-cell-ink: ${toneTintInk(tone)}; }`,
    )
    .join('\n');
  const pill = `.${denominationCellTonesPillClass} .sw-denomination-cell-toned .sw-denomination-cell-value:not(:empty)`;

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

/* A pill: the count on its tone's tint, in the tone's ink (a Notice's words: 4.5:1 on the tint unless the palette's own tone is under it). */
${pill} {
  background: var(--sw-denomination-cell-fill);
  border-radius: var(--sw-radius-sm);
  color: var(--sw-denomination-cell-ink);
  display: inline-block;
  padding: calc(var(--sw-space-1) / 2) var(--sw-space-2);
}

@media (forced-colors: active) {
  .sw-denomination-grid .sw-denomination-cell-zero.sw-denomination-cell-toned,
  .sw-denomination-grid .sw-denomination-cell-toned .sw-denomination-cell-zero { color: GrayText; }
  ${pill} { color: inherit; outline: 1px solid CanvasText; }
}`;
}

export function denominationCellToneClassCatalog(): string[] {
  return [
    'sw-denomination-cell-value',
    denominationCellTonesPillClass,
    'sw-denomination-cell-toned',
    ...cellTones.map((tone) => `sw-denomination-cell-tone-${tone}`),
  ];
}
