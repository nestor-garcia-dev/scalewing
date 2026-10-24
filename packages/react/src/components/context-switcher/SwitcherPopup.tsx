'use client';

import {
  Fragment,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type RefObject,
  useId,
  useLayoutEffect,
  useRef,
} from 'react';

import { type InlineAlign } from '../../anchored-position.js';
import { Button } from '../Button.js';
import { contextSwitcherTriggerWidthVariable } from '../../css/css-context-switcher.js';
import { useAnchoredPopover } from '../use-anchored-popover.js';
import { type SwitcherEntry } from './options.js';
import { SwitcherOption } from './SwitcherOption.js';
import {
  type ContextSwitcherAction,
  type ContextSwitcherFilter,
  type ContextSwitcherGroup,
} from './types.js';
import { useSwitcherList } from './use-switcher-list.js';

type SwitcherPopupProps = {
  label: string;
  groups: readonly ContextSwitcherGroup[];
  currentId: string | undefined;
  /** The filter, when it is shown (enough options). */
  filter: ContextSwitcherFilter | undefined;
  actions: readonly ContextSwitcherAction[];
  align: InlineAlign;
  triggerRef: RefObject<HTMLButtonElement | null>;
  /** Whether a pointer is pressing the trigger (its click toggles the popup). */
  triggerPressed: () => boolean;
  /** Closes the popup; `refocus` hands focus back to the trigger. */
  onClose: (refocus: boolean) => void;
  onChoose: (entry: SwitcherEntry) => void;
  onAction: (action: ContextSwitcherAction) => void;
};

/**
 * The open popup: a non-modal `dialog` named by the switcher's label on the
 * top layer beside the trigger. Focus moves into it, to the filter field
 * (an ARIA combobox over the listbox) or else to the listbox itself; both
 * point at the active row with `aria-activedescendant`. Escape closes it
 * and returns focus to the trigger; a press outside or focus leaving it
 * (Tab past its end, Shift+Tab back to the trigger) closes it where focus
 * went.
 */
export function SwitcherPopup({
  actions,
  align,
  currentId,
  filter,
  groups,
  label,
  onAction,
  onChoose,
  onClose,
  triggerPressed,
  triggerRef,
}: SwitcherPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const focusRef = useRef<HTMLInputElement & HTMLDivElement>(null);
  const listId = useId();
  const list = useSwitcherList({
    currentId,
    filtering: filter !== undefined,
    groups,
    listId,
    onChoose,
  });
  useAnchoredPopover(popupRef, triggerRef, triggerRef, () => onClose(false), {
    align,
    flipInline: true,
  });

  // At least as wide as the trigger (the stylesheet keeps its own least
  // width and the viewport cap), followed while the trigger resizes.
  useLayoutEffect(() => {
    const popup = popupRef.current;
    const trigger = triggerRef.current;
    if (!popup || !trigger) return;
    const fit = () =>
      popup.style.setProperty(
        contextSwitcherTriggerWidthVariable,
        `${trigger.offsetWidth}px`,
      );
    fit();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(fit);
    observer.observe(trigger);
    return () => observer.disconnect();
  }, [triggerRef]);

  // The last place the pointer moved to: a list scrolled under a still
  // pointer can report a move with no movement, which must not take the
  // active row from the keys.
  const pointerAt = useRef<{ x: number; y: number } | null>(null);
  function pointerMoved(event: PointerEvent): boolean {
    const last = pointerAt.current;
    pointerAt.current = { x: event.clientX, y: event.clientY };
    return !last || last.x !== event.clientX || last.y !== event.clientY;
  }

  // A press anywhere but the field or a command keeps focus where it is
  // (the field or the listbox), so the keys keep working after a press on
  // a caption, the padding or a row.
  function keepFocus(event: MouseEvent<HTMLDivElement>) {
    const target = event.target;
    if (target instanceof Element && target.closest('input, button')) return;
    event.preventDefault();
  }

  useLayoutEffect(() => {
    focusRef.current?.focus({ preventScroll: true });
  }, []);

  const activeDomId = list.active?.domId;
  useLayoutEffect(() => {
    if (activeDomId)
      document
        .getElementById(activeDomId)
        ?.scrollIntoView?.({ block: 'nearest' });
  }, [activeDomId]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      // Stops a dialog round the trigger (a drawer) from closing too.
      event.preventDefault();
      event.stopPropagation();
      onClose(true);
      return;
    }
    if (event.target !== focusRef.current) return;
    if (list.onListKey(event)) event.preventDefault();
  }

  function onBlur(event: FocusEvent<HTMLDivElement>) {
    const next = event.relatedTarget;
    if (!(next instanceof Node) || popupRef.current?.contains(next)) return;
    // Shift+Tab back to the trigger closes it too; a press on the trigger
    // leaves that to the trigger's own toggle.
    if (triggerRef.current?.contains(next) && triggerPressed()) return;
    onClose(false);
  }

  const empty = list.entries.length === 0;
  const activeDescendant = list.active?.domId;

  return (
    <div
      aria-label={label}
      className="sw-context-switcher-popup"
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      onMouseDown={keepFocus}
      ref={popupRef}
      role="dialog"
    >
      {filter ? (
        <input
          aria-activedescendant={activeDescendant}
          aria-autocomplete="list"
          aria-controls={listId}
          aria-expanded="true"
          aria-label={filter.label}
          autoComplete="off"
          className="sw-context-switcher-filter"
          onChange={(event) => list.changeQuery(event.target.value)}
          placeholder={filter.placeholder}
          ref={focusRef}
          role="combobox"
          spellCheck={false}
          type="text"
          value={list.query}
        />
      ) : null}
      <div
        aria-activedescendant={filter ? undefined : activeDescendant}
        aria-label={label}
        className="sw-context-switcher-list"
        hidden={empty}
        id={listId}
        ref={filter ? undefined : focusRef}
        role="listbox"
        tabIndex={filter ? undefined : 0}
      >
        {list.sections.map(({ entries, group }, index) => {
          const rows = entries.map((entry) => (
            <SwitcherOption
              active={entry === list.active}
              current={entry.option.id === currentId}
              entry={entry}
              key={entry.option.id}
              onActivate={(event) => {
                if (pointerMoved(event)) list.setActiveId(entry.option.id);
              }}
              onChoose={() => onChoose(entry)}
            />
          ));
          if (!group.label) return <Fragment key={group.id}>{rows}</Fragment>;
          const headingId = `${listId}-group-${index}`;
          return (
            <div aria-labelledby={headingId} key={group.id} role="group">
              <div
                className="sw-context-switcher-heading"
                id={headingId}
                role="presentation"
              >
                {group.label}
              </div>
              {rows}
            </div>
          );
        })}
      </div>
      {filter ? (
        <>
          {empty ? (
            <p aria-hidden="true" className="sw-context-switcher-empty">
              {filter.emptyText}
            </p>
          ) : null}
          <div className="sw-sr-only" role="status">
            {empty ? filter.emptyText : ''}
          </div>
        </>
      ) : null}
      {actions.length > 0 ? (
        <div className="sw-context-switcher-footer">
          {actions.map((action) => (
            <Button
              key={action.id}
              onPress={() => onAction(action)}
              size="sm"
              variant="ghost"
            >
              {action.icon ? (
                <span
                  aria-hidden="true"
                  className="sw-context-switcher-action-icon"
                >
                  {action.icon}
                </span>
              ) : null}
              {action.label}
            </Button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
