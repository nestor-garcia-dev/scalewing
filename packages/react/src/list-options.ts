import { type CSSProperties } from 'react';

import { badgeTones, type BadgeTone } from './css/css-data.js';
import {
  listRowValueTones,
  type ListRowValueTone,
} from './css/css-list-row.js';
import { isOneOf } from './is-one-of.js';

/**
 * `panel` (the default) is one bordered panel on the surface; `plain`
 * draws no panel and a hairline above the first row too, for rows inside
 * a surface that already has one, such as a Card.
 */
export const listGroupVariants = ['panel', 'plain'] as const;
export type ListGroupVariant = (typeof listGroupVariants)[number];

/**
 * A list's bounded height, counted in rows: as tall as `rows` rows of a
 * title and one detail line, the rest scrolling inside it. Taller rows
 * show fewer at a time, shorter ones more.
 */
export type ListGroupMaxHeight = { rows: number };

/** `danger` draws the title in the danger colour, for a row that ends something. */
export const listRowTones = ['default', 'danger'] as const;
export type ListRowTone = (typeof listRowTones)[number];

/** `strong` (the default) sets the title at the label weight; `plain` at the body's. */
export const listRowTitleAppearances = ['strong', 'plain'] as const;
export type ListRowTitleAppearance = (typeof listRowTitleAppearances)[number];

export { listRowValueTones, type ListRowValueTone };

/** What ends a row: a chevron (it opens something), a check (chosen), or none. */
export type ListRowAccessory = 'chevron' | 'check' | 'none';

function isBlank(text: unknown): boolean {
  return typeof text !== 'string' || text.trim() === '';
}

export type ListGroupInput = {
  label: string | undefined;
  labelledBy: string | undefined;
  variant: unknown;
  maxHeight: ListGroupMaxHeight | undefined;
};

/**
 * Fails closed on a ListGroup it cannot draw: an unknown variant, a
 * `maxHeight` that is not a whole row count from 1, or a bounded list with
 * no name (its scroll region is a keyboard stop and must say what it holds).
 */
export function assertListGroup({
  label,
  labelledBy,
  variant,
  maxHeight,
}: ListGroupInput): void {
  if (!isOneOf(listGroupVariants, variant))
    throw new RangeError(`Unknown ListGroup variant: ${String(variant)}`);
  if (maxHeight === undefined) return;
  const rows: unknown =
    typeof maxHeight === 'object' && maxHeight !== null
      ? maxHeight.rows
      : undefined;
  if (typeof rows !== 'number' || !Number.isInteger(rows) || rows < 1)
    throw new RangeError(
      'ListGroup maxHeight must be { rows } with a whole number from 1',
    );
  if (isBlank(label) && isBlank(labelledBy))
    throw new RangeError(
      'A ListGroup with maxHeight needs aria-label or aria-labelledby',
    );
}

/** The row count the generated `sw-list-group-scroll` height reads. */
export function listMaxHeightStyle(
  maxHeight: ListGroupMaxHeight,
): CSSProperties {
  return { '--sw-list-max-rows': maxHeight.rows } as CSSProperties;
}

export type ListRowInput = {
  title: string;
  tone: unknown;
  titleAppearance: unknown;
  valueTone: unknown;
  accessory: unknown;
  value: string | undefined;
  valueDetail: string | undefined;
  valueBadge: BadgeTone | undefined;
  selected: boolean | undefined;
  pressable: boolean;
  unread: boolean;
  unreadLabel: string | undefined;
};

/**
 * Fails closed on a ListRow it cannot draw: an empty title or value, an
 * unknown tone, title appearance, value tone, badge tone or accessory, a
 * `valueDetail`, `valueTone` or `valueBadge` with no value, a value both
 * toned and a badge, `selected` on a row that is not a button or link
 * (its check would be a state nothing can read), or an unread row with no
 * words for its dot (a colour alone says nothing).
 */
export function assertListRow(input: ListRowInput): void {
  if (isBlank(input.title))
    throw new RangeError('ListRow title must be non-empty text');
  if (!isOneOf(listRowTones, input.tone))
    throw new RangeError(`Unknown ListRow tone: ${String(input.tone)}`);
  if (!isOneOf(listRowTitleAppearances, input.titleAppearance))
    throw new RangeError(
      `Unknown ListRow titleAppearance: ${String(input.titleAppearance)}`,
    );
  if (
    input.valueTone !== undefined &&
    !isOneOf(listRowValueTones, input.valueTone)
  )
    throw new RangeError(
      `Unknown ListRow valueTone: ${String(input.valueTone)}`,
    );
  if (!isOneOf(['chevron', 'none'] as const, input.accessory))
    throw new RangeError(
      `Unknown ListRow accessory: ${String(input.accessory)}`,
    );
  if (input.valueBadge !== undefined && !isOneOf(badgeTones, input.valueBadge))
    throw new RangeError(
      `Unknown ListRow valueBadge: ${String(input.valueBadge)}`,
    );
  if (input.valueBadge !== undefined && input.valueTone !== undefined)
    throw new RangeError(
      'A ListRow value is a toned figure or a badge, not both',
    );
  if (input.value !== undefined && isBlank(input.value))
    throw new RangeError('ListRow value must be non-empty text');
  if (input.unreadLabel !== undefined && isBlank(input.unreadLabel))
    throw new RangeError('ListRow unreadLabel must be non-empty text');
  if (input.unread && input.unreadLabel === undefined)
    throw new RangeError('An unread ListRow needs an unreadLabel to say so');
  if (input.selected !== undefined && !input.pressable)
    throw new RangeError(
      'A ListRow choice (selected) needs onPress or href to say its state',
    );
  if (
    input.value === undefined &&
    (input.valueDetail !== undefined ||
      input.valueTone !== undefined ||
      input.valueBadge !== undefined)
  )
    throw new RangeError(
      'ListRow valueDetail, valueTone and valueBadge need a value',
    );
}

/**
 * The row's end: a check while `selected`, nothing for an unchosen choice,
 * a chevron on a row that opens something (unless `accessory` is `none`),
 * and nothing on a read-only row.
 */
export function listRowAccessory(options: {
  pressable: boolean;
  selected: boolean | undefined;
  accessory: 'chevron' | 'none';
}): ListRowAccessory {
  if (options.selected !== undefined)
    return options.selected ? 'check' : 'none';
  if (!options.pressable) return 'none';
  return options.accessory;
}
