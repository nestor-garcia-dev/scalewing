'use client';

import {
  useLayoutEffect,
  useRef,
  type FocusEvent,
  type KeyboardEvent,
  type RefObject,
} from 'react';

import { Button } from '../Button.js';
import { CheckboxControl } from '../checkbox/CheckboxControl.js';
import { useAnchoredPopover } from '../use-anchored-popover.js';
import { type MultiSelectAlign, type MultiSelectOption } from './types.js';

type MultiSelectPanelProps = {
  id: string;
  label: string;
  align: MultiSelectAlign;
  options: readonly MultiSelectOption[];
  checked: ReadonlySet<string>;
  allLabel: string;
  clearLabel: string;
  triggerRef: RefObject<HTMLButtonElement | null>;
  onToggle: (value: string, checked: boolean) => void;
  onAll: () => void;
  onClear: () => void;
  /** Closes the panel, returning focus to the trigger when asked. */
  onClose: (restoreFocus: boolean) => void;
};

/**
 * The open panel: a group named by the label on the popover layer beside
 * the trigger, with All and Clear over one checkbox per option. The first
 * checkbox takes focus as it opens; Escape closes it and returns focus to
 * the trigger; focus or a press moving outside it closes it.
 */
export function MultiSelectPanel({
  align,
  allLabel,
  checked,
  clearLabel,
  id,
  label,
  onAll,
  onClear,
  onClose,
  onToggle,
  options,
  triggerRef,
}: MultiSelectPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  useAnchoredPopover(panelRef, triggerRef, triggerRef, () => onClose(false), {
    align,
    flipInline: true,
  });

  useLayoutEffect(() => {
    panelRef.current
      ?.querySelector<HTMLInputElement>('.sw-multi-select-option input')
      ?.focus();
  }, []);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    onClose(true);
  }

  function onBlur(event: FocusEvent<HTMLDivElement>) {
    const next = event.relatedTarget;
    if (!(next instanceof Node)) return;
    if (panelRef.current?.contains(next) || triggerRef.current?.contains(next))
      return;
    onClose(false);
  }

  return (
    <div
      aria-label={label}
      className="sw-multi-select-panel"
      id={id}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      ref={panelRef}
      role="group"
    >
      <div className="sw-multi-select-commands">
        <Button onPress={onAll} size="sm" variant="ghost">
          {allLabel}
        </Button>
        <Button onPress={onClear} size="sm" variant="ghost">
          {clearLabel}
        </Button>
      </div>
      {options.map((option) => (
        <div
          className={
            option.separatorBefore
              ? 'sw-multi-select-row sw-multi-select-row-separated'
              : 'sw-multi-select-row'
          }
          key={option.value}
        >
          <label className="sw-checkbox-label sw-multi-select-option">
            <CheckboxControl
              checked={checked.has(option.value)}
              onChange={(event) =>
                onToggle(option.value, event.currentTarget.checked)
              }
            />
            {option.icon ? (
              <span aria-hidden="true" className="sw-multi-select-icon">
                {option.icon}
              </span>
            ) : null}
            <span className="sw-multi-select-text">{option.label}</span>
          </label>
        </div>
      ))}
    </div>
  );
}
