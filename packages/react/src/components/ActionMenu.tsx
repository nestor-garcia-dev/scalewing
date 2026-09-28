'use client';

import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

import { type InlineAlign } from '../anchored-position.js';
import { ActionMenuList } from './action-menu/ActionMenuList.js';

export type ActionMenuAlign = InlineAlign;

export type ActionMenuItem = {
  id: string;
  label: string;
  onSelect: () => void;
  icon?: ReactNode;
  disabled?: boolean;
  destructive?: boolean;
};

export type ActionMenuProps = {
  label: string;
  items: readonly ActionMenuItem[];
  trigger?: ReactNode;
  disabled?: boolean;
  /**
   * The trigger edge the menu lines up with: its inline start (default) or
   * its inline end, for a trigger that ends a card or row. Either way the
   * menu takes the other edge when the preferred one would leave the screen.
   */
  align?: ActionMenuAlign;
};

function nextEnabled(
  items: readonly ActionMenuItem[],
  current: number,
  direction: 1 | -1,
): number {
  if (items.length === 0) return -1;
  for (let step = 1; step <= items.length; step += 1) {
    const index = (current + direction * step + items.length) % items.length;
    if (!items[index]?.disabled) return index;
  }
  return -1;
}

export function ActionMenu({
  label,
  items,
  trigger,
  disabled = false,
  align = 'start',
}: ActionMenuProps) {
  const menuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const openRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [focusIndex, setFocusIndex] = useState(-1);
  const enabled = !disabled && items.some((item) => !item.disabled);

  useLayoutEffect(() => {
    if (!enabled && open) close();
  }, [enabled, open]);

  function close(restoreFocus = false) {
    openRef.current = false;
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }

  function openMenu(last = false) {
    if (!enabled) return;
    const index = last
      ? nextEnabled(items, 0, -1)
      : nextEnabled(items, items.length - 1, 1);
    openRef.current = true;
    setFocusIndex(index);
    setOpen(true);
  }

  function onTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      openMenu(event.key === 'ArrowUp');
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (open) close(true);
      else openMenu();
    }
  }

  function onMenuKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      close(true);
      return;
    }
    let next = -1;
    if (event.key === 'ArrowDown') next = nextEnabled(items, focusIndex, 1);
    else if (event.key === 'ArrowUp') next = nextEnabled(items, focusIndex, -1);
    else if (event.key === 'Home')
      next = nextEnabled(items, items.length - 1, 1);
    else if (event.key === 'End') next = nextEnabled(items, 0, -1);
    else if (event.key === 'Tab') {
      close();
      return;
    }
    if (next >= 0) {
      event.preventDefault();
      setFocusIndex(next);
    }
  }

  function select(item: ActionMenuItem) {
    if (!openRef.current || !enabled || item.disabled) return;
    // Focus leaves the hidden item first, so a dialog the command opens
    // records the trigger as its opener and returns focus there on close.
    close(true);
    item.onSelect();
  }

  return (
    <div className="sw-action-menu">
      <button
        aria-controls={open ? menuId : undefined}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={label}
        className="sw-action-menu-trigger"
        disabled={!enabled}
        onClick={() => (open ? close(true) : openMenu())}
        onKeyDown={onTriggerKeyDown}
        ref={triggerRef}
        type="button"
      >
        {trigger ?? label}
      </button>
      {open ? (
        <ActionMenuList
          align={align}
          focusIndex={focusIndex}
          id={menuId}
          items={items}
          label={label}
          onDismiss={() => close()}
          onFocusIndex={setFocusIndex}
          onKeyDown={onMenuKeyDown}
          onSelect={select}
          triggerRef={triggerRef}
        />
      ) : null}
    </div>
  );
}
