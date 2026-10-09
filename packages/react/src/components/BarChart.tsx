import {
  barChartFillRatio,
  barChartScaleMax,
  formatBarChartValue,
} from '@scalewing/tokens';
import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';

import { cx } from '../class-names.js';
import { type BarChartTone, barChartTones } from '../css/css-chart.js';

export type { BarChartTone };
export { barChartTones };

export type BarChartItem = {
  label: string;
  value: number;
  valueLabel?: string;
  /**
   * Colors the bar by what it means, in place of its sign's default (the
   * accent, or danger for a negative value): such as `'warning'` for an
   * overage and `'danger'` for a shortage. The color is a cue beside the
   * value and its label, never the only sign of the meaning. An unknown tone
   * throws a `RangeError`.
   */
  tone?: BarChartTone;
};

/** The fill's classes: the sign's (which also shapes a diverging bar) and the tone's. */
function barChartFillClassName(item: BarChartItem): string {
  if (item.tone !== undefined && !barChartTones.includes(item.tone))
    throw new RangeError(
      `BarChart item tone must be one of ${barChartTones.join(', ')}; received ${String(item.tone)}`,
    );
  return cx(
    'sw-bar-chart-fill',
    item.value < 0 && 'sw-bar-chart-fill-negative',
    item.tone && `sw-bar-chart-fill-${item.tone}`,
  );
}

export type BarChartProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  'aria-label': string;
  items: readonly BarChartItem[];
  max?: number;
  /**
   * Writes the axis's values and each item's value that has no `valueLabel`,
   * such as a currency: `(value) => formatMoney(value)`. Defaults to a plain
   * number with at most one decimal.
   */
  formatValue?: (value: number) => string;
  /**
   * Puts zero in the middle of each track: a positive value's bar grows
   * toward the inline end and a negative value's toward the start, both on
   * the same scale, and the axis reads from minus `max` through 0 to `max`.
   * Off by default, where every bar grows from the start and its color
   * alone tells a negative value.
   */
  diverging?: boolean;
};

export const BarChart = forwardRef<HTMLDivElement, BarChartProps>(
  function BarChart(
    {
      'aria-label': ariaLabel,
      className,
      diverging = false,
      formatValue = formatBarChartValue,
      items,
      max,
      style,
      ...rest
    },
    ref,
  ) {
    const scaleMax = barChartScaleMax(
      items.map((item) => item.value),
      max,
    );
    const axis = diverging ? [-scaleMax, 0, scaleMax] : [0, scaleMax];

    return (
      <div
        ref={ref}
        className={cx(
          'sw-bar-chart',
          diverging && 'sw-bar-chart-diverging',
          className,
        )}
        style={style}
        {...rest}
      >
        <ul aria-label={ariaLabel} className="sw-bar-chart-plot">
          {items.map((item, index) => {
            const ratio = barChartFillRatio(item.value, scaleMax);
            return (
              <li className="sw-bar-chart-row" key={`${item.label}-${index}`}>
                <span className="sw-bar-chart-label">{item.label}</span>
                <span className="sw-bar-chart-track">
                  <span
                    className={barChartFillClassName(item)}
                    style={
                      {
                        '--sw-bar-fill': ratio,
                      } as CSSProperties
                    }
                  />
                </span>
                <span className="sw-bar-chart-value">
                  {item.valueLabel ?? formatValue(item.value)}
                </span>
              </li>
            );
          })}
        </ul>
        <div aria-hidden="true" className="sw-bar-chart-axis">
          <span />
          <span className="sw-bar-chart-axis-track">
            {axis.map((value) => (
              <span key={value}>{formatValue(value)}</span>
            ))}
          </span>
          <span />
        </div>
      </div>
    );
  },
);
