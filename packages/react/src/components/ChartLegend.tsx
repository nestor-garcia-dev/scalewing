import { forwardRef, type HTMLAttributes } from 'react';

import { cx } from '../class-names.js';
import {
  type ChartFillTone,
  chartFillTones,
  type ChartStrokeTone,
  chartStrokeTones,
  type ChartTone,
  isOneOf,
} from '../css/chart-tones.js';
import {
  type ChartLegendSwatch,
  chartLegendSwatches,
} from '../css/css-chart-legend.js';

export type { ChartFillTone, ChartLegendSwatch, ChartStrokeTone, ChartTone };
export { chartFillTones, chartLegendSwatches, chartStrokeTones };

/**
 * One item of a legend: its words and the mark they name. A `bar` is a
 * filled mark (a column, a range bar) and takes a fill tone: a categorical
 * colour for a chart's series, or a range bar's statement tone. A `line`,
 * a `marker` (a downward triangle) and a `box` (the boxed current period)
 * are drawn strokes and take a stroke tone. Each swatch is the colour of
 * the mark it names in the same tone.
 */
export type ChartLegendItem =
  | { label: string; swatch: 'bar'; tone: ChartFillTone }
  | {
      label: string;
      swatch: 'line' | 'marker' | 'box';
      tone: ChartStrokeTone;
    };

export type ChartLegendProps = Omit<
  HTMLAttributes<HTMLUListElement>,
  'children'
> & {
  items: readonly ChartLegendItem[];
};

/** Refuses empty words, and a swatch or a tone the item cannot draw. */
function assertLegendItem(item: ChartLegendItem): void {
  if (typeof item.label !== 'string' || item.label.trim() === '')
    throw new RangeError('ChartLegend item label must not be empty');
  if (!isOneOf(chartLegendSwatches, item.swatch))
    throw new RangeError(
      `ChartLegend swatch must be one of ${chartLegendSwatches.join(', ')}; received ${String(item.swatch)}`,
    );
  const tones: readonly ChartTone[] =
    item.swatch === 'bar' ? chartFillTones : chartStrokeTones;
  if (!isOneOf(tones, item.tone))
    throw new RangeError(
      `ChartLegend ${item.swatch} tone must be one of ${tones.join(', ')}; received ${String(item.tone)}`,
    );
}

/**
 * A chart's key: a list of its marks, each a swatch and its words, in a
 * wrapping row in the caption type. Put it above the chart it names, or
 * above a statement's range bars. The swatches are decorative
 * (`aria-hidden`), so each item reads as its words; the list keeps its
 * list role where a style would drop it. Empty words, or a swatch or tone the
 * item cannot draw, throw a `RangeError`.
 */
export const ChartLegend = forwardRef<HTMLUListElement, ChartLegendProps>(
  function ChartLegend({ className, items, ...rest }, ref) {
    for (const item of items) assertLegendItem(item);
    return (
      <ul
        ref={ref}
        className={cx('sw-chart-legend', className)}
        // A list styled without markers loses its role in Safari.
        role="list"
        {...rest}
      >
        {items.map((item, index) => (
          <li
            className={cx('sw-chart-legend-item', `sw-chart-tone-${item.tone}`)}
            key={`${item.label}-${index}`}
          >
            <span
              aria-hidden="true"
              className={cx(
                'sw-chart-legend-swatch',
                `sw-chart-legend-${item.swatch}`,
              )}
            />
            {item.label}
          </li>
        ))}
      </ul>
    );
  },
);
