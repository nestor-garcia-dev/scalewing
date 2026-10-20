'use client';

import { type ReactNode, useId } from 'react';

import { cx } from '../class-names.js';
import { type BadgeTone } from '../css/css-data.js';
import {
  assertListRow,
  listRowAccessory,
  type ListRowTitleAppearance,
  type ListRowTone,
  type ListRowValueTone,
} from '../list-options.js';
import { tabStop } from '../tab-stop.js';
import { plainPress } from './link-press.js';
import { ListRowContent } from './list/ListRowContent.js';
import { ListRowItem } from './list/ListRowItem.js';
import { rowNaming } from './list/row-naming.js';

export type ListRowProps = {
  title: string;
  /** A muted line under the title. */
  detail?: string;
  /** A figure or word at the row's end, such as "+$1.48". */
  value?: string;
  /** A muted line under the value, such as "checks $3,427". */
  valueDetail?: string;
  /**
   * Colours the value only, as a table cell's tone, or `warning` for a
   * figure that needs a look; the words say why.
   */
  valueTone?: ListRowValueTone;
  /**
   * Draws the value as a `Badge` in this tone, such as a status ("Open",
   * "Blocked") at the row's end. Not with `valueTone`.
   */
  valueBadge?: BadgeTone;
  /**
   * A consumer mark at the row's start, such as a status dot or a Lucide
   * glyph (ADR 0008). It is hidden from assistive technology, so the words
   * must say what it means.
   */
  leading?: ReactNode;
  /**
   * Makes the whole row a button (or, with `href`, a link's plain press
   * for a client router) and adds the chevron.
   */
  onPress?: () => void;
  /** Makes the whole row a link to `href`, with the chevron. */
  href?: string;
  /**
   * Makes the row a choice: a check while true, nothing while false, and
   * the state (`aria-pressed` on a button, `aria-current` on a link). Only
   * on a row with `onPress` or `href`.
   */
  selected?: boolean;
  /** Dims the row and blocks presses; a link row drops its `href`. */
  disabled?: boolean;
  /** `danger` draws the title in the danger colour, for a row that ends something. */
  tone?: ListRowTone;
  /** `plain` sets the title at the body weight, for a list of plain statements. */
  titleAppearance?: ListRowTitleAppearance;
  /**
   * Marks the row as new for the person, such as a document they have not
   * opened: an accent dot after the title, read as `unreadLabel`.
   */
  unread?: boolean;
  /**
   * What the dot means in the consumer's words ("New"), read after the
   * title (in a pressable row's name). Required while `unread`.
   */
  unreadLabel?: string;
  /**
   * A short status before the accessory, such as a `Badge` ("Only in
   * English"); a pressable row is described by it.
   */
  tag?: ReactNode;
  /**
   * A control after the row and outside its press area, such as an
   * `ActionMenu` of the row's own actions. It needs its own name.
   */
  action?: ReactNode;
  /**
   * Keeps the title and the detail on one line each, cut with "…" where
   * they do not fit, for a long list read at a glance; the full words stay
   * in the row's name and description, and in a `title` tooltip. The
   * value, its detail and the tag keep their words whole.
   */
  truncate?: boolean;
  /** `none` hides the chevron of a pressable row that acts in place. */
  accessory?: 'chevron' | 'none';
  /**
   * Replaces a pressable row's name, which is its title and value; its
   * detail lines are its description.
   */
  'aria-label'?: string;
};

/**
 * One row of a `ListGroup`: it opens something (`onPress` or `href`, with
 * a chevron, the whole row pressing), picks one option in place
 * (`selected`), or only states something (neither). `unread` marks it new,
 * `tag` adds a status before its end, `action` a control beside it, and
 * `truncate` keeps its title and detail to one line each.
 */
export function ListRow({
  title,
  detail,
  value,
  valueDetail,
  valueTone,
  valueBadge,
  leading,
  onPress,
  href,
  selected,
  disabled = false,
  tone = 'default',
  titleAppearance = 'strong',
  accessory = 'chevron',
  unread = false,
  unreadLabel,
  tag,
  action,
  truncate = false,
  'aria-label': ariaLabel,
}: ListRowProps) {
  const pressable = onPress !== undefined || href !== undefined;
  assertListRow({
    title,
    tone,
    titleAppearance,
    valueTone,
    accessory,
    value,
    valueDetail,
    valueBadge,
    selected,
    pressable,
    unread,
    unreadLabel,
  });
  const id = useId();
  const kind = listRowAccessory({ pressable, selected, accessory });
  const content = (
    <ListRowContent
      accessory={kind}
      detail={detail}
      id={id}
      leading={leading}
      tag={tag}
      title={title}
      titleAppearance={titleAppearance}
      tone={tone}
      truncate={truncate}
      unreadLabel={unread ? unreadLabel : undefined}
      value={value}
      valueBadge={valueBadge}
      valueDetail={valueDetail}
      valueTone={valueTone}
    />
  );
  const className = cx(
    'sw-list-row',
    pressable && 'sw-list-row-pressable',
    disabled && 'sw-list-row-disabled',
    truncate && 'sw-list-row-truncate',
  );
  const naming = rowNaming(id, {
    'aria-label': ariaLabel,
    value,
    detail,
    valueDetail,
    unread,
    tag,
  });

  let row: ReactNode;
  if (href !== undefined)
    row = (
      <a
        {...naming}
        aria-current={selected ? 'true' : undefined}
        aria-disabled={disabled || undefined}
        className={className}
        href={disabled ? undefined : href}
        onClick={
          onPress && !disabled
            ? (event) => {
                if (!plainPress(event)) return;
                event.preventDefault();
                onPress();
              }
            : undefined
        }
        role={disabled ? 'link' : undefined}
        tabIndex={disabled ? undefined : tabStop}
      >
        {content}
      </a>
    );
  else if (onPress !== undefined)
    row = (
      <button
        {...naming}
        aria-pressed={selected}
        className={className}
        disabled={disabled}
        onClick={onPress}
        tabIndex={tabStop}
        type="button"
      >
        {content}
      </button>
    );
  else
    row = (
      <div
        aria-label={ariaLabel}
        className={className}
        role={ariaLabel ? 'group' : undefined}
      >
        {content}
      </div>
    );
  return <ListRowItem action={action}>{row}</ListRowItem>;
}
