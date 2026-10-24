'use client';

import { type KeyboardEvent, useId, useRef, useState } from 'react';

import { cx } from '../class-names.js';
import {
  contextSwitcherTriggerAppearances,
  contextSwitcherTriggerClass,
  type ContextSwitcherTriggerAppearance,
  contextSwitcherWidths,
  type ContextSwitcherWidth,
} from '../css/css-context-switcher-trigger.js';
import { tabStop } from '../tab-stop.js';
import { optionCount } from './context-switcher/options.js';
import { SwitcherPopup } from './context-switcher/SwitcherPopup.js';
import {
  type ContextSwitcherAction,
  type ContextSwitcherProps,
} from './context-switcher/types.js';
import { assertContextSwitcher } from './context-switcher/validate.js';

export type {
  ContextSwitcherAction,
  ContextSwitcherBadge,
  ContextSwitcherFilter,
  ContextSwitcherGroup,
  ContextSwitcherOption,
  ContextSwitcherProps,
} from './context-switcher/types.js';
export {
  contextSwitcherTriggerAppearances,
  contextSwitcherWidths,
  type ContextSwitcherTriggerAppearance,
  type ContextSwitcherWidth,
};

/**
 * A button showing the context in use (a workspace, a competition, a
 * season) that opens a popup to switch it: an optional filter field, the
 * options in groups as a listbox (the current one checked), and commands
 * in a footer. Invalid groups, options, words or props throw a
 * `RangeError`.
 */
export function ContextSwitcher(props: ContextSwitcherProps) {
  assertContextSwitcher(props);
  const {
    actions = [],
    align = 'start',
    currentId,
    filter,
    groups,
    label,
    onSelect,
    trigger,
    triggerAppearance = 'framed',
    width = 'content',
  } = props;
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const pressedRef = useRef(false);
  const labelId = useId();
  const contentId = useId();
  const current = groups
    .flatMap((group) => group.options)
    .find((option) => option.id === currentId);
  const showFilter =
    filter !== undefined && optionCount(groups) >= (filter.minOptions ?? 0);

  function close(refocus: boolean) {
    setOpen(false);
    if (refocus) triggerRef.current?.focus();
  }

  function onTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (!open && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      event.preventDefault();
      setOpen(true);
    }
  }

  function runAction(action: ContextSwitcherAction) {
    // Focus is back on the trigger first, so a dialog the command opens
    // returns focus there when it closes.
    close(true);
    action.onSelect();
  }

  const icon = triggerAppearance === 'icon';
  // The name is what is switched, then what the trigger shows (for a glyph
  // alone, the current option's label).
  const labelledBy = icon && !current ? labelId : `${labelId} ${contentId}`;
  return (
    <div
      className={cx(
        'sw-context-switcher',
        width === 'full' && 'sw-context-switcher-full',
      )}
    >
      <button
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-labelledby={labelledBy}
        className={cx(
          'sw-context-switcher-trigger',
          contextSwitcherTriggerClass(triggerAppearance),
        )}
        onClick={() => (open ? close(true) : setOpen(true))}
        onKeyDown={onTriggerKeyDown}
        onPointerDown={() => {
          pressedRef.current = true;
        }}
        onPointerUp={() => {
          pressedRef.current = false;
        }}
        onPointerLeave={() => {
          pressedRef.current = false;
        }}
        ref={triggerRef}
        tabIndex={tabStop}
        type="button"
      >
        <span className="sw-sr-only" id={labelId}>
          {label}
        </span>
        <span
          aria-hidden={icon ? true : undefined}
          className="sw-context-switcher-trigger-content"
          id={icon ? undefined : contentId}
        >
          {trigger}
        </span>
        {icon && current ? (
          <span className="sw-sr-only" id={contentId}>
            {current.label}
          </span>
        ) : null}
      </button>
      {open ? (
        <SwitcherPopup
          actions={actions}
          align={align}
          currentId={currentId}
          filter={showFilter ? filter : undefined}
          groups={groups}
          label={label}
          onAction={runAction}
          onChoose={(entry) => {
            close(true);
            if (entry.option.id !== currentId) onSelect(entry.option);
          }}
          onClose={close}
          triggerPressed={() => pressedRef.current}
          triggerRef={triggerRef}
        />
      ) : null}
    </div>
  );
}
