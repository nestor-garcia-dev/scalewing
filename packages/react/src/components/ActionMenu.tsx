'use client';

import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

import { cx } from '../class-names.js';

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
}: ActionMenuProps) {
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
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

  function positionMenu() {
    const triggerNode = triggerRef.current;
    const menuNode = menuRef.current;
    if (!triggerNode || !menuNode) return;
    const rect = triggerNode.getBoundingClientRect();
    const width = menuNode.offsetWidth;
    const height = menuNode.offsetHeight;
    menuNode.style.left = `${Math.max(0, Math.min(rect.left, window.innerWidth - width))}px`;
    menuNode.style.top = `${Math.max(0, rect.bottom + height <= window.innerHeight ? rect.bottom : rect.top - height)}px`;
  }

  useLayoutEffect(() => {
    const menuNode = menuRef.current;
    if (!menuNode) return;
    const supportsPopover = typeof menuNode.showPopover === 'function';
    if (supportsPopover) menuNode.setAttribute('popover', 'manual');
    if (!open) {
      if (supportsPopover && menuNode.matches(':popover-open'))
        menuNode.hidePopover();
      return;
    }
    if (supportsPopover && !menuNode.matches(':popover-open'))
      menuNode.showPopover();
    positionMenu();
    const commands =
      menuNode.querySelectorAll<HTMLButtonElement>('[role="menuitem"]');
    commands[focusIndex]?.focus();
  }, [focusIndex, open]);

  useLayoutEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      const target = event.target;
      if (target instanceof Node && !rootRef.current?.contains(target)) close();
    }
    function onMove() {
      positionMenu();
    }
    document.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('resize', onMove);
    window.addEventListener('scroll', onMove, true);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('resize', onMove);
      window.removeEventListener('scroll', onMove, true);
    };
  }, [open]);

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
    close();
    item.onSelect();
  }

  return (
    <div className="sw-action-menu" ref={rootRef}>
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
      <div
        aria-label={label}
        className="sw-action-menu-list"
        hidden={!open}
        id={menuId}
        onKeyDown={onMenuKeyDown}
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
            onClick={() => select(item)}
            onFocus={() => setFocusIndex(index)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                select(item);
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
    </div>
  );
}
