import {
  barChartFillRatio,
  barChartScaleMax,
  formatBarChartValue,
} from '@scalewing/tokens';
import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';

import { cx } from '../class-names.js';

export type BarChartItem = {
  label: string;
  value: number;
  valueLabel?: string;
};

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
                    className={cx(
                      'sw-bar-chart-fill',
                      item.value < 0 && 'sw-bar-chart-fill-negative',
                    )}
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
