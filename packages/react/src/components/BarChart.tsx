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
};

export const BarChart = forwardRef<HTMLDivElement, BarChartProps>(
  function BarChart(
    { 'aria-label': ariaLabel, className, items, max, style, ...rest },
    ref,
  ) {
    const scaleMax = barChartScaleMax(
      items.map((item) => item.value),
      max,
    );

    return (
      <div
        ref={ref}
        className={cx('sw-bar-chart', className)}
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
                  {item.valueLabel ?? formatBarChartValue(item.value)}
                </span>
              </li>
            );
          })}
        </ul>
        <div aria-hidden="true" className="sw-bar-chart-axis">
          <span />
          <span className="sw-bar-chart-axis-track">
            <span>0</span>
            <span>{formatBarChartValue(scaleMax)}</span>
          </span>
          <span />
        </div>
      </div>
    );
  },
);
