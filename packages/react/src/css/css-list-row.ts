import { typographyVariants } from '@scalewing/tokens';

import { checkStrokeIn, chevronStrokeIn } from './chevron.js';
import { chartColorMix, chartInkMixes } from './chart-tones.js';
import { tableCellTones } from './css-table-ledger.js';
import { mutedReadsAsText, quietFill } from './quiet-fill.js';
import { coarsePointerQuery, touchTarget } from './touch-target.js';

const label = typographyVariants.label;
const body = typographyVariants.body;
const caption = typographyVariants.caption;

/* Centres a mark of `size` on the title's first line. */
function onTitleLine(size: string): string {
  return `calc((${label.lineHeight}px - ${size}) / 2)`;
}

/*
 * A row: the leading mark, the title over its detail, the value over its
 * detail at the end, then the chevron or check, each lined up with the
 * title's first line. A pressable row is the whole button or link: a
 * quiet fill under the pointer, the focus ring inside its edge, 44 px on a
 * coarse pointer. Plain rows (inside a Card) have no inline padding. On
 * the fill its muted parts take the text colour (`mutedReadsAsText`).
 */
function rowRules(): string {
  return `.sw-list-row {
  align-items: flex-start;
  appearance: none;
  background: transparent;
  border: 0;
  box-sizing: border-box;
  color: var(--sw-color-text);
  display: flex;
  font-family: var(--sw-font-sans);
  font-size: ${label.fontSize}px;
  gap: var(--sw-space-3);
  line-height: ${label.lineHeight}px;
  margin: 0;
  padding: var(--sw-space-3) var(--sw-space-4);
  text-align: start;
  text-decoration: none;
  width: 100%;
}

.sw-list-group-plain .sw-list-row { padding-inline: 0; }

.sw-list-row-pressable { cursor: pointer; }

@media (hover: hover) {
  .sw-list-row-pressable:hover:not(.sw-list-row-disabled) { background: ${quietFill}; }

  ${mutedReadsAsText(['.sw-list-row-pressable:hover:not(.sw-list-row-disabled) *'])}
}

.sw-list-row-pressable:active:not(.sw-list-row-disabled) { background: ${quietFill}; }

${mutedReadsAsText(['.sw-list-row-pressable:active:not(.sw-list-row-disabled) *'])}

.sw-list-row-pressable:focus { outline: none; }

.sw-list-row-pressable:focus-visible {
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);
  outline-offset: calc(-1 * var(--sw-focus-ring-width));
}

/* A link row keeps the text colour and the inset ring over the canvas link rules. */
[data-theme] a.sw-list-row,
[data-theme] a.sw-list-row:hover {
  color: var(--sw-color-text);
}

[data-theme] a.sw-list-row:focus-visible {
  outline-offset: calc(-1 * var(--sw-focus-ring-width));
}

.sw-list-row-disabled {
  cursor: not-allowed;
  opacity: var(--sw-disabled-opacity);
}

@media ${coarsePointerQuery} {
  .sw-list-row-pressable { min-height: ${touchTarget}; }
}

/* Forced colours drop the fill, so a hovered row is outlined instead, as a pressable table row is. */
@media (forced-colors: active) {
  .sw-list-row-pressable:hover:not(.sw-list-row-disabled) {
    outline: var(--sw-focus-ring-width) solid Highlight;
    outline-offset: calc(-1 * var(--sw-focus-ring-width));
  }
}`;
}

/**
 * The colours a row's value can take: a table cell's, and `warning`, for a
 * figure that needs a look but is not wrong yet.
 */
export const listRowValueTones = [...tableCellTones, 'warning'] as const;
export type ListRowValueTone = (typeof listRowValueTones)[number];

/*
 * A warning value is the warning colour's ink, moved halfway to the text
 * colour as a chart's warning words are: the warning colour alone falls
 * under 4.5:1 on the surface in some palettes. Forced colours draw it as
 * text, as every tone.
 */
function warningValueRule(): string {
  return `.sw-list-row-value-warning { color: ${chartColorMix(chartInkMixes.warning)}; }`;
}

function partRules(): string {
  const tones = tableCellTones
    .map(
      (tone) =>
        `.sw-list-row-value-${tone} { color: var(--sw-color-${tone}); }`,
    )
    .join('\n');
  return `.sw-list-row-leading {
  align-items: center;
  display: flex;
  flex: none;
  height: ${label.lineHeight}px;
}

.sw-list-row-label,
.sw-list-row-end {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.sw-list-row-label { flex: 1 1 auto; }

.sw-list-row-end {
  align-items: flex-end;
  flex: none;
  max-width: 50%;
  text-align: end;
}

.sw-list-row-title {
  font-weight: ${label.fontWeight};
  overflow-wrap: anywhere;
}

.sw-list-row-title-plain { font-weight: ${body.fontWeight}; }

.sw-list-row-title-danger { color: var(--sw-color-danger); }

.sw-list-row-detail,
.sw-list-row-value-detail {
  color: var(--sw-color-muted);
  font-size: ${caption.fontSize}px;
  line-height: ${caption.lineHeight}px;
}

/* The label takes the wrap; the end keeps its words whole up to half the row. */
.sw-list-row-detail { overflow-wrap: anywhere; }

.sw-list-row-value,
.sw-list-row-value-detail { font-variant-numeric: tabular-nums; }

.sw-list-row-value { font-weight: ${label.fontWeight}; }

${tones}
${warningValueRule()}`;
}

/*
 * The chevron is the stroke Accordion and the menus share, pointing to the
 * inline end; the check is the same stroke in the accent, a short side and
 * a long one. Both are borders, so forced colours keep them.
 */
function accessoryRules(): string {
  return `.sw-list-row-chevron {
  ${chevronStrokeIn('var(--sw-color-muted)')}
  flex: none;
  margin-block-start: ${onTitleLine('var(--sw-space-2)')};
  margin-inline-end: var(--sw-space-1);
  transform: rotate(-45deg);
}

.sw-list-row-chevron:dir(rtl) { transform: rotate(135deg); }

.sw-list-row-check {
  ${checkStrokeIn('var(--sw-color-accent)')}
  box-sizing: border-box;
  flex: none;
  height: var(--sw-space-3);
  margin-block-start: ${onTitleLine('var(--sw-space-3)')};
  margin-inline-end: var(--sw-space-1);
  transform: rotate(45deg);
  width: var(--sw-space-2);
}

@media (forced-colors: active) {
  .sw-list-row-check { border-color: CanvasText; }
}`;
}

export function cssListRowClasses(): string {
  return `${rowRules()}

${partRules()}

${accessoryRules()}`;
}

export function listRowClassCatalog(): string[] {
  return [
    'sw-list-row',
    'sw-list-row-pressable',
    'sw-list-row-disabled',
    'sw-list-row-leading',
    'sw-list-row-label',
    'sw-list-row-title',
    'sw-list-row-title-plain',
    'sw-list-row-title-danger',
    'sw-list-row-detail',
    'sw-list-row-end',
    'sw-list-row-value',
    ...listRowValueTones.map((tone) => `sw-list-row-value-${tone}`),
    'sw-list-row-value-detail',
    'sw-list-row-chevron',
    'sw-list-row-check',
  ];
}
