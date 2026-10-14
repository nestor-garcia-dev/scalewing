import { type CategoricalColor } from '@scalewing/tokens';

import { cx } from '../../class-names.js';

export type ChartCalloutListProps = {
  callouts: readonly { text: string; tone?: CategoricalColor }[];
  /** Shows the list under the plot; otherwise it is kept for assistive technology only. */
  visible: boolean;
};

/**
 * A chart's callouts as a list of their words, each after a dot in its
 * hue: shown under the plot on a compact chart, where they no longer fit
 * above it, and otherwise kept for assistive technology (`sw-sr-only`)
 * while the drawing pins them above their columns.
 */
export function ChartCalloutList({ callouts, visible }: ChartCalloutListProps) {
  if (callouts.length === 0) return null;
  return (
    <ul
      className={cx('sw-chart-callouts', !visible && 'sw-sr-only')}
      role="list"
    >
      {callouts.map((callout, index) => (
        <li
          className={cx(
            'sw-chart-callout',
            callout.tone && `sw-chart-tone-${callout.tone}`,
          )}
          key={`${callout.text}-${index}`}
        >
          <span aria-hidden="true" className="sw-chart-callout-dot" />
          {callout.text}
        </li>
      ))}
    </ul>
  );
}
