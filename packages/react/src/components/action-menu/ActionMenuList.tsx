'use client';

import {
  useLayoutEffect,
  useRef,
  type KeyboardEvent,
  type RefObject,
} from 'react';

import { cx } from '../../class-names.js';
import { useAnchoredPopover } from '../use-anchored-popover.js';
import type { ActionMenuItem } from '../ActionMenu.js';

type ActionMenuListProps = {
  id: string;
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
 * above it, inset from the viewport edges, and lined up with the trigger's
 * end when it would not fit from its start), with the focused command
 * holding DOM focus.
 */
export function ActionMenuList({
  id,
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
    flipInline: true,
  });

  useLayoutEffect(() => {
    const commands =
      menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]');
    commands?.[focusIndex]?.focus();
  }, [focusIndex]);

  return (
    <div
      aria-label={label}
      className="sw-action-menu-list"
      id={id}
      onKeyDown={onKeyDown}
      ref={menuRef}
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
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}
