'use client';

import { useId, useRef, useState, type KeyboardEvent } from 'react';

import { MultiSelectPanel } from './multi-select/MultiSelectPanel.js';
import { type MultiSelectProps } from './multi-select/types.js';
import { assertMultiSelect } from './multi-select/validate.js';
import { tabStop } from '../tab-stop.js';

export type {
  MultiSelectAlign,
  MultiSelectOption,
  MultiSelectProps,
} from './multi-select/types.js';

/**
 * Several choices from a short list behind one trigger: "Show All entries ▾"
 * opens a panel with All, Clear and a checkbox per option. A disclosure (a
 * button that shows a group of native checkboxes), not a listbox, so each
 * option is an ordinary checkbox to every user. The consumer owns the
 * checked values and the trigger's summary words.
 */
export function MultiSelect({
  align = 'start',
  allLabel,
  clearLabel,
  disabled = false,
  label,
  onChange,
  options,
  summary,
  value,
}: MultiSelectProps) {
  assertMultiSelect({
    allLabel,
    align,
    clearLabel,
    label,
    options,
    summary,
    value,
  });
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const checked = new Set(value);
  const shown = open && !disabled;

  // Disabling while open closes the panel for good (state adjusted during
  // render), so enabling it again never reopens it, or pulls focus into it,
  // on its own.
  if (disabled && open) setOpen(false);

  function close(restoreFocus: boolean) {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }

  function report(next: ReadonlySet<string>) {
    onChange(
      options
        .filter((option) => next.has(option.value))
        .map((option) => option.value),
    );
  }

  function onToggle(changed: string, isChecked: boolean) {
    const next = new Set(checked);
    if (isChecked) next.add(changed);
    else next.delete(changed);
    report(next);
  }

  function onTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'ArrowDown' && !shown) {
      event.preventDefault();
      setOpen(true);
    } else if (event.key === 'Escape' && shown) {
      event.preventDefault();
      close(true);
    }
  }

  return (
    <div className="sw-multi-select">
      <button
        aria-controls={shown ? panelId : undefined}
        aria-expanded={shown}
        className="sw-multi-select-trigger"
        disabled={disabled}
        onClick={() => (shown ? close(true) : setOpen(true))}
        onKeyDown={onTriggerKeyDown}
        ref={triggerRef}
        tabIndex={tabStop}
        type="button"
      >
        <span className="sw-multi-select-label">{label}</span>{' '}
        <span className="sw-multi-select-summary">{summary}</span>
      </button>
      {shown ? (
        <MultiSelectPanel
          align={align}
          allLabel={allLabel}
          checked={checked}
          clearLabel={clearLabel}
          id={panelId}
          label={label}
          onAll={() => report(new Set(options.map((option) => option.value)))}
          onClear={() => report(new Set())}
          onClose={close}
          onToggle={onToggle}
          options={options}
          triggerRef={triggerRef}
        />
      ) : null}
    </div>
  );
}
