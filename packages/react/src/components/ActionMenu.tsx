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
import { cx } from '../class-names.js';
import {
  type ActionMenuTriggerAppearance,
  actionMenuTriggerAppearances,
  actionMenuTriggerTextClass,
} from '../css/css-action-menu-trigger.js';
import { ActionMenuList } from './action-menu/ActionMenuList.js';
import { tabStop } from '../tab-stop.js';

export type ActionMenuAlign = InlineAlign;

export { actionMenuTriggerAppearances, type ActionMenuTriggerAppearance };

export type ActionMenuItem = {
  id: string;
  label: string;
  /**
   * The BCP 47 language of `label` when it is not the page's, such as
   * "English" on a Spanish page, so it is read in its own language.
   */
  lang?: string;
  onSelect: () => void;
  icon?: ReactNode;
  disabled?: boolean;
  destructive?: boolean;
  /**
   * A short current value at the command's end with a chevron, such as
   * "English" on a Language command that opens a choice: muted, read as
   * part of the command's name ("Language English"). The chevron is
   * decorative and points to the inline end. Meant for a short value; a
   * long one wraps between words. The command still runs like any other:
   * it opens no submenu, so a command that opens a dialog or a picker
   * says so in its label or what it opens.
   */
  detail?: string;
  /** The BCP 47 language of `detail` when it is not the page's. */
  detailLang?: string;
  /** Draws a hairline before the command, setting it apart from the ones above. */
  separatorBefore?: boolean;
};

export type ActionMenuProps = {
  label: string;
  items: readonly ActionMenuItem[];
  /**
   * A non-interactive block above the commands, such as who is signed in:
   * muted, set off by a hairline, outside the arrow-key order, and the
   * menu's description (`aria-describedby`), so it is read as the menu
   * opens. Text and other phrasing content, nothing focusable.
   */
  header?: ReactNode;
  trigger?: ReactNode;
  disabled?: boolean;
  /**
   * The trigger edge the menu lines up with: its inline start (default) or
   * its inline end, for a trigger that ends a card or row. Either way the
   * menu takes the other edge when the preferred one would leave the screen.
   */
  align?: ActionMenuAlign;
  /**
   * `text` draws the trigger as its words with a chevron after them, no
   * fill or outline until hovered or open, such as a person's name opening
   * their account menu; `framed` (the default) is the small outlined
   * control.
   */
  triggerAppearance?: ActionMenuTriggerAppearance;
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
  header,
  trigger,
  disabled = false,
  align = 'start',
  triggerAppearance = 'framed',
}: ActionMenuProps) {
  const menuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const openRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [focusIndex, setFocusIndex] = useState(-1);
  if (
    items.some(
      (item) =>
        (item.detail !== undefined && !item.detail.trim()) ||
        (item.detailLang !== undefined &&
          (!item.detailLang.trim() || item.detail === undefined)),
    )
  )
    throw new RangeError(
      'ActionMenu item detail and detailLang must not be blank; detailLang needs a detail',
    );
  if (
    !(actionMenuTriggerAppearances as readonly unknown[]).includes(
      triggerAppearance,
    )
  )
    throw new RangeError(
      `Unknown ActionMenu triggerAppearance: ${String(triggerAppearance)}`,
    );
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
        className={cx(
          'sw-action-menu-trigger',
          triggerAppearance === 'text' && actionMenuTriggerTextClass,
        )}
        disabled={!enabled}
        onClick={() => (open ? close(true) : openMenu())}
        onKeyDown={onTriggerKeyDown}
        ref={triggerRef}
        tabIndex={tabStop}
        type="button"
      >
        {triggerAppearance === 'text' ? (
          // One flex item, so mixed inline words keep their spaces.
          <span>{trigger ?? label}</span>
        ) : (
          (trigger ?? label)
        )}
      </button>
      {open ? (
        <ActionMenuList
          align={align}
          focusIndex={focusIndex}
          header={header}
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
