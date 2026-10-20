import { type ReactNode, useContext } from 'react';

import { cx } from '../../class-names.js';
import { ListRowContainer } from './list-row-container.js';
import { hasSlot } from '../slot.js';

/**
 * A row's list item: an `li` in a ListGroup's list, a `div` elsewhere. A
 * row with an `action` holds that control after the row, a sibling of the
 * row's button or link, so it is never inside the row's press area.
 */
export function ListRowItem({
  action,
  children,
}: {
  action: ReactNode;
  children: ReactNode;
}) {
  const container = useContext(ListRowContainer);
  const hasAction = hasSlot(action);
  const content = (
    <>
      {children}
      {hasAction ? <div className="sw-list-row-action">{action}</div> : null}
    </>
  );
  const className = cx('sw-list-item', hasAction && 'sw-list-item-action');
  return container === 'li' ? (
    <li className={className}>{content}</li>
  ) : (
    <div className={className}>{content}</div>
  );
}
