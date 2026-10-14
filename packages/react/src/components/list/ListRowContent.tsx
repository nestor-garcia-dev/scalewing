import { type ReactNode } from 'react';

import { cx } from '../../class-names.js';
import {
  type ListRowAccessory,
  type ListRowTitleAppearance,
  type ListRowTone,
  type ListRowValueTone,
} from '../../list-options.js';
import { ListRowAccessoryMark } from './ListRowAccessoryMark.js';

export type ListRowContentProps = {
  /** Prefixes the ids that name and describe a pressable row. */
  id: string;
  title: string;
  detail?: string;
  value?: string;
  valueDetail?: string;
  valueTone?: ListRowValueTone;
  leading?: ReactNode;
  tone: ListRowTone;
  titleAppearance: ListRowTitleAppearance;
  accessory: ListRowAccessory;
};

/**
 * A list row's parts in reading order: the hidden leading mark, the title
 * over its detail, the value over its detail, then the chevron or check.
 */
export function ListRowContent({
  id,
  title,
  detail,
  value,
  valueDetail,
  valueTone,
  leading,
  tone,
  titleAppearance,
  accessory,
}: ListRowContentProps) {
  return (
    <>
      {leading === undefined ? null : (
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
        >
          {title}
        </span>
        {detail ? (
          <span className="sw-list-row-detail" id={`${id}-detail`}>
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
            {value}
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
      <ListRowAccessoryMark kind={accessory} />
    </>
  );
}
