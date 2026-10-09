'use client';

import {
  useId,
  useLayoutEffect,
  useRef,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from 'react';

import { type InlineAlign } from '../../anchored-position.js';
import { cx } from '../../class-names.js';
import { useAnchoredPopover } from '../use-anchored-popover.js';
import type { ActionMenuItem } from '../ActionMenu.js';

type ActionMenuListProps = {
  id: string;
  align: InlineAlign;
  header?: ReactNode;
  label: string;
  items: readonly ActionMenuItem[];
  focusIndex: number;
  triggerRef: RefObject<HTMLButtonElement | null>;
  onDismiss: () => void;
  onFocusIndex: (index: number) => void;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
  onSelect: (item: ActionMenuItem) => void;
};

/**
 * The open menu: on the popover layer beside the trigger (a gap below or
 * above it, inset from the viewport edges, lined up with the trigger's start
 * or, with `align="end"`, its end, and with the other edge when that one
 * would not fit), with the focused command holding DOM focus.
 */
export function ActionMenuList({
  id,
  align,
  header,
  label,
  items,
  focusIndex,
  triggerRef,
  onDismiss,
  onFocusIndex,
  onKeyDown,
  onSelect,
}: ActionMenuListProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  useAnchoredPopover(menuRef, triggerRef, triggerRef, onDismiss, {
    align,
    flipInline: true,
  });

  useLayoutEffect(() => {
    const commands =
      menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]');
    commands?.[focusIndex]?.focus();
  }, [focusIndex]);

  const headerId = useId();
  const hasHeader = header !== undefined && header !== null && header !== false;
  const menu = (
    <div
      aria-describedby={hasHeader ? headerId : undefined}
      aria-label={label}
      className={hasHeader ? 'sw-action-menu-items' : 'sw-action-menu-list'}
      id={hasHeader ? undefined : id}
      onKeyDown={onKeyDown}
      ref={hasHeader ? undefined : menuRef}
      role="menu"
    >
      {items.map((item, index) => (
        <button
          className={cx(
            'sw-action-menu-item',
            item.destructive && 'sw-action-menu-item-danger',
          )}
          disabled={item.disabled}
          key={item.id}
          onClick={() => onSelect(item)}
          onFocus={() => onFocusIndex(index)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onSelect(item);
            }
          }}
          role="menuitem"
          tabIndex={index === focusIndex ? 0 : -1}
          type="button"
        >
          {item.icon ? <span aria-hidden="true">{item.icon}</span> : null}
          <span lang={item.lang}>{item.label}</span>
        </button>
      ))}
    </div>
  );

  if (!hasHeader) return menu;

  // The header is not a menu item: it sits above the menu in the same
  // popover, outside the arrow-key order, and describes the menu.
  return (
    <div className="sw-action-menu-list" id={id} ref={menuRef}>
      <div className="sw-action-menu-header" id={headerId}>
        {header}
      </div>
      {menu}
    </div>
  );
}
