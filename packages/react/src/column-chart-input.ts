import { type CategoricalColor, isCategoricalColor } from '@scalewing/tokens';

import { type ColumnChartMode, columnChartModes } from './column-chart-bars.js';
import { isOneOf } from './is-one-of.js';

/** One series of a column chart: a value per category, in one hue. */
export type ColumnChartSeries = {
  /** Stable and unique within the chart. */
  id: string;
  label: string;
  values: readonly number[];
  tone: CategoricalColor;
};

/** A line over the columns, on its own scale: a value per category. */
export type ColumnChartLine = {
  label: string;
  values: readonly number[];
  /** Writes the line's last value beside its axis (default `true`). */
  endLabel?: boolean;
};

/** Words pinned above one category's column, such as why it stands out. */
export type ColumnChartCallout = {
  index: number;
  text: string;
  /** The hue of its words and dot; the text colour when left out. */
  tone?: CategoricalColor;
};

export type ColumnChartInput = {
  label: string;
  categories: readonly string[];
  series: readonly ColumnChartSeries[];
  mode: ColumnChartMode;
  line?: ColumnChartLine;
  highlight?: number;
  callouts: readonly ColumnChartCallout[];
};

function refuse(message: string): never {
  throw new RangeError(`ColumnChart ${message}`);
}

function assertWords(what: string, value: unknown): void {
  if (typeof value !== 'string' || value.trim() === '')
    refuse(`${what} must not be empty`);
}

function assertValues(
  what: string,
  values: readonly number[],
  count: number,
): void {
  if (values.length !== count)
    refuse(
      `${what} must have one value per category (${count}); received ${values.length}`,
    );
  for (const value of values)
    if (typeof value !== 'number' || !Number.isFinite(value))
      refuse(`${what} values must be finite numbers: ${String(value)}`);
}

function assertIndex(what: string, index: unknown, count: number): void {
  if (
    !Number.isInteger(index) ||
    (index as number) < 0 ||
    (index as number) >= count
  )
    refuse(
      `${what} must be a category's index, 0 to ${count - 1}: ${String(index)}`,
    );
}

/**
 * Refuses what a column chart cannot draw, with a `RangeError`: empty
 * words, a series or line without one finite value per category, a
 * repeated series id, a tone off the categorical scale, an unknown mode,
 * and a highlight or callout that is not a category's index.
 */
export function assertColumnChartInput(input: ColumnChartInput): void {
  const count = input.categories.length;
  assertWords('label', input.label);
  for (const category of input.categories) assertWords('category', category);
  if (!isOneOf(columnChartModes, input.mode))
    refuse(
      `mode must be one of ${columnChartModes.join(', ')}; received ${String(input.mode)}`,
    );
  const ids = new Set<string>();
  for (const series of input.series) {
    assertWords('series id', series.id);
    if (ids.has(series.id)) refuse(`series id must be unique: ${series.id}`);
    ids.add(series.id);
    assertWords('series label', series.label);
    assertValues(`series ${series.id}`, series.values, count);
    if (!isCategoricalColor(series.tone))
      refuse(
        `series tone must be a categorical colour: ${String(series.tone)}`,
      );
  }
  if (input.line) {
    assertWords('line label', input.line.label);
    assertValues('line', input.line.values, count);
  }
  if (input.highlight !== undefined)
    assertIndex('highlight', input.highlight, count);
  for (const callout of input.callouts) {
    assertIndex('callout index', callout.index, count);
    assertWords('callout text', callout.text);
    if (callout.tone !== undefined && !isCategoricalColor(callout.tone))
      refuse(
        `callout tone must be a categorical colour: ${String(callout.tone)}`,
      );
  }
}
