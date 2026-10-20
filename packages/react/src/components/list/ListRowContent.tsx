import { type ReactNode } from 'react';

import { cx } from '../../class-names.js';
import { type BadgeTone } from '../../css/css-data.js';
import { Badge } from '../Badge.js';
import {
  type ListRowAccessory,
  type ListRowTitleAppearance,
  type ListRowTone,
  type ListRowValueTone,
} from '../../list-options.js';
import { ListRowAccessoryMark } from './ListRowAccessoryMark.js';
import { hasSlot } from '../slot.js';

export type ListRowContentProps = {
  /** Prefixes the ids that name and describe a pressable row. */
  id: string;
  title: string;
  /** The title's language when it is not the page's; on its words only. */
  titleLang?: string;
  detail?: string;
  value?: string;
  valueDetail?: string;
  valueTone?: ListRowValueTone;
  valueBadge?: BadgeTone;
  leading?: ReactNode;
  tone: ListRowTone;
  titleAppearance: ListRowTitleAppearance;
  accessory: ListRowAccessory;
  /** The unread words; the dot shows while they are given. */
  unreadLabel?: string;
  tag?: ReactNode;
  /** One line each for the title and detail, cut with "…", the words in a tooltip. */
  truncate: boolean;
};

/**
 * A list row's parts in reading order: the hidden leading mark, the title
 * (with the unread dot and its hidden words) over its detail, the value
 * over its detail, the tag, then the chevron or check. A truncated row
 * sets its title's words in their own box, so the "…" never hides the dot.
 * `titleLang` goes on the title's box, which holds its words and the
 * wordless dot only; the unread words after it stay in the page's language.
 */
export function ListRowContent({
  id,
  title,
  titleLang,
  detail,
  value,
  valueDetail,
  valueTone,
  valueBadge,
  leading,
  tone,
  titleAppearance,
  accessory,
  unreadLabel,
  tag,
  truncate,
}: ListRowContentProps) {
  return (
    <>
      {!hasSlot(leading) ? null : (
        <span aria-hidden="true" className="sw-list-row-leading">
          {leading}
        </span>
      )}
      <span className="sw-list-row-label">
        <span
          className={cx(
            'sw-list-row-title',
            titleAppearance === 'plain' && 'sw-list-row-title-plain',
            tone === 'danger' && 'sw-list-row-title-danger',
          )}
          id={`${id}-title`}
          lang={titleLang}
        >
          {truncate ? (
            <span className="sw-list-row-title-text" title={title}>
              {title}
            </span>
          ) : (
            title
          )}
          {unreadLabel === undefined ? null : (
            <span aria-hidden="true" className="sw-list-row-unread" />
          )}
        </span>
        {unreadLabel === undefined ? null : (
          <span className="sw-sr-only" id={`${id}-unread`}>
            {unreadLabel}
          </span>
        )}
        {detail ? (
          <span
            className="sw-list-row-detail"
            id={`${id}-detail`}
            title={truncate ? detail : undefined}
          >
            {detail}
          </span>
        ) : null}
      </span>
      {value === undefined ? null : (
        <span className="sw-list-row-end">
          <span
            className={cx(
              'sw-list-row-value',
              valueTone && `sw-list-row-value-${valueTone}`,
            )}
            id={`${id}-value`}
          >
            {valueBadge ? <Badge tone={valueBadge}>{value}</Badge> : value}
          </span>
          {valueDetail ? (
            <span
              className="sw-list-row-value-detail"
              id={`${id}-value-detail`}
            >
              {valueDetail}
            </span>
          ) : null}
        </span>
      )}
      {!hasSlot(tag) ? null : (
        <span className="sw-list-row-tag" id={`${id}-tag`}>
          {tag}
        </span>
      )}
      <ListRowAccessoryMark kind={accessory} />
    </>
  );
}
