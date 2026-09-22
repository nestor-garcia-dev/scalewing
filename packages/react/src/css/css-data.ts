import { trackInset, typographyVariants } from '@scalewing/tokens';

export const badgeTones = ['neutral', 'accent', 'success', 'danger'] as const;

export type BadgeTone = (typeof badgeTones)[number];

export const badgeSizes = ['sm', 'md'] as const;

export type BadgeSize = (typeof badgeSizes)[number];

const caption = typographyVariants.caption;
const data = typographyVariants.data;
const body = typographyVariants.body;

export function badgeClassNames(
  tone: BadgeTone,
  size: BadgeSize = 'md',
): string[] {
  return ['sw-badge', `sw-badge-${tone}`, `sw-badge-${size}`];
}

export function cssDataClasses(): string {
  return `.sw-badge {
  align-items: center;
  border: 1px solid transparent;
  border-radius: var(--sw-radius-pill);
  box-sizing: border-box;
  display: inline-flex;
  font-family: var(--sw-font-sans);
  font-size: ${caption.fontSize}px;
  font-weight: 600;
  letter-spacing: ${caption.letterSpacing}px;
  line-height: ${caption.lineHeight}px;
}

.sw-badge-md {
  min-height: var(--sw-control-xs-min-height);
  padding-inline: var(--sw-control-xs-padding-inline);
}

.sw-badge-sm {
  padding-inline: var(--sw-space-2);
}

.sw-badge-neutral {
  background: var(--sw-glass-fill);
  border-color: var(--sw-color-border);
  color: var(--sw-color-text);
}

.sw-badge-accent {
  background: transparent;
  border-color: var(--sw-color-accent);
  color: var(--sw-color-accent);
}

.sw-badge-success {
  background: transparent;
  border-color: var(--sw-color-success);
  color: var(--sw-color-success);
}

.sw-badge-danger {
  background: transparent;
  border-color: var(--sw-color-danger);
  color: var(--sw-color-danger);
}

.sw-segmented {
  background: var(--sw-glass-fill);
  border: 1px solid var(--sw-glass-border);
  border-radius: var(--sw-radius-pill);
  box-sizing: border-box;
  display: inline-flex;
  gap: ${trackInset}px;
  padding: ${trackInset}px;
}

.sw-segmented-item {
  appearance: none;
  background: transparent;
  border: 0;
  border-radius: var(--sw-radius-pill);
  color: var(--sw-color-muted);
  cursor: pointer;
  font-family: var(--sw-font-sans);
  font-size: ${data.fontSize}px;
  font-weight: 600;
  letter-spacing: ${data.letterSpacing}px;
  line-height: ${data.lineHeight}px;
  min-height: var(--sw-control-xs-min-height);
  padding-inline: var(--sw-control-xs-padding-inline);
}

.sw-segmented-item:focus-visible {
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);
  outline-offset: var(--sw-focus-ring-offset);
}

.sw-segmented-item-selected {
  background: var(--sw-color-surface);
  color: var(--sw-color-text);
}

.sw-segmented-filled {
  display: flex;
  width: 100%;
}

.sw-segmented-filled .sw-segmented-item {
  align-items: center;
  color: var(--sw-color-text);
  display: inline-flex;
  flex: 1 1 0;
  font-size: ${body.fontSize}px;
  justify-content: center;
  letter-spacing: ${body.letterSpacing}px;
  line-height: ${body.lineHeight}px;
  min-height: var(--sw-control-md-min-height);
  min-width: 0;
  padding-inline: var(--sw-control-md-padding-inline);
}

.sw-segmented-filled .sw-segmented-item-selected {
  background: var(--sw-color-accent);
  color: var(--sw-color-onAccent);
}

.sw-table-wrap {
  overflow: auto;
  width: 100%;
}

.sw-table {
  border-collapse: collapse;
  width: 100%;
}

.sw-table th,
.sw-table td {
  border-bottom: 1px solid var(--sw-color-border);
  padding: var(--sw-space-2) var(--sw-space-3);
  text-align: start;
  vertical-align: middle;
}

.sw-table th {
  color: var(--sw-color-muted);
  font-family: var(--sw-font-sans);
  font-size: ${caption.fontSize}px;
  font-weight: 600;
  letter-spacing: ${caption.letterSpacing}px;
  line-height: ${caption.lineHeight}px;
}

.sw-table-end {
  text-align: end;
}

.sw-table-numeric {
  font-variant-numeric: tabular-nums;
  text-align: end;
}

.sw-table-clip {
  max-width: 0;
  overflow: hidden;
}

.sw-table-sticky thead th {
  background: var(--sw-glass-fill);
  backdrop-filter: blur(var(--sw-glass-blur)) saturate(var(--sw-glass-saturate));
  -webkit-backdrop-filter: blur(var(--sw-glass-blur)) saturate(var(--sw-glass-saturate));
  position: sticky;
  top: 0;
  z-index: 1;
}

.sw-table-compact th,
.sw-table-compact td {
  padding: var(--sw-space-1) var(--sw-space-2);
}

.sw-table-row-selected > :first-child {
  padding-inline-start: var(--sw-space-5);
  position: relative;
}

.sw-table-compact .sw-table-row-selected > :first-child {
  padding-inline-start: var(--sw-space-4);
}

.sw-table-row-selected > :first-child::before {
  background: var(--sw-color-accent);
  border-radius: var(--sw-radius-pill);
  content: '';
  height: var(--sw-space-2);
  inset-block-start: 50%;
  inset-inline-start: var(--sw-space-2);
  position: absolute;
  transform: translateY(-50%);
  width: var(--sw-space-2);
}

.sw-table-compact .sw-table-row-selected > :first-child::before {
  inset-inline-start: var(--sw-space-1);
}`;
}

export function dataClassCatalog(): string[] {
  return [
    'sw-badge',
    ...badgeTones.map((tone) => `sw-badge-${tone}`),
    ...badgeSizes.map((size) => `sw-badge-${size}`),
    'sw-segmented',
    'sw-segmented-item',
    'sw-segmented-item-selected',
    'sw-segmented-filled',
    'sw-table-wrap',
    'sw-table',
    'sw-table-end',
    'sw-table-numeric',
    'sw-table-clip',
    'sw-table-sticky',
    'sw-table-compact',
    'sw-table-row-selected',
  ];
}
