import { typographyVariants } from './typography.js';

const caption = typographyVariants.caption;
const data = typographyVariants.data;

export function cssChartClasses(): string {
  return `.sw-bar-chart {
  display: grid;
  gap: var(--sw-space-2);
}

.sw-bar-chart-plot {
  display: grid;
  gap: var(--sw-space-2);
  list-style: none;
  margin: 0;
  padding: 0;
}

.sw-bar-chart-row,
.sw-bar-chart-axis {
  align-items: center;
  display: grid;
  gap: var(--sw-space-3);
  grid-template-columns: minmax(0, 2fr) minmax(0, 5fr) minmax(var(--sw-space-8), max-content);
}

.sw-bar-chart-label {
  color: var(--sw-color-muted);
  font-family: var(--sw-font-sans);
  font-size: ${caption.fontSize}px;
  font-weight: 400;
  letter-spacing: ${caption.letterSpacing}px;
  line-height: ${caption.lineHeight}px;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sw-bar-chart-track {
  background: var(--sw-glass-fill);
  border: 1px solid var(--sw-color-border);
  border-radius: var(--sw-radius-pill);
  height: var(--sw-space-3);
  min-width: 0;
  overflow: hidden;
}

.sw-bar-chart-fill {
  background: var(--sw-color-accent);
  border-radius: inherit;
  display: block;
  height: 100%;
  width: calc(var(--sw-bar-fill, 0) * 100%);
}

.sw-bar-chart-fill-negative {
  background: var(--sw-color-danger);
}

.sw-bar-chart-value {
  color: var(--sw-color-text);
  font-family: var(--sw-font-sans);
  font-size: ${data.fontSize}px;
  font-variant-numeric: tabular-nums;
  font-weight: ${data.fontWeight};
  letter-spacing: ${data.letterSpacing}px;
  line-height: ${data.lineHeight}px;
  text-align: end;
}

.sw-bar-chart-axis {
  color: var(--sw-color-muted);
  font-family: var(--sw-font-sans);
  font-size: ${caption.fontSize}px;
  font-weight: 400;
  letter-spacing: ${caption.letterSpacing}px;
  line-height: ${caption.lineHeight}px;
}

.sw-bar-chart-axis-track {
  display: flex;
  justify-content: space-between;
}`;
}

export function chartClassCatalog(): string[] {
  return [
    'sw-bar-chart',
    'sw-bar-chart-plot',
    'sw-bar-chart-row',
    'sw-bar-chart-axis',
    'sw-bar-chart-label',
    'sw-bar-chart-track',
    'sw-bar-chart-fill',
    'sw-bar-chart-fill-negative',
    'sw-bar-chart-value',
    'sw-bar-chart-axis-track',
  ];
}
