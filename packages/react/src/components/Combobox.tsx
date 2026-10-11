'use client';

import { useId, useRef, useState, type KeyboardEvent } from 'react';

import { ComboboxPopup } from './combobox/ComboboxPopup.js';
import { type ComboboxEntry, comboboxEntries } from './combobox/entries.js';
import { type ComboboxProps } from './combobox/types.js';
import { assertCombobox } from './combobox/validate.js';
import { Field } from './Field.js';

export {
  comboboxSizes,
  type ComboboxAction,
  type ComboboxBadge,
  type ComboboxGroup,
  type ComboboxOption,
  type ComboboxProps,
  type ComboboxSize,
} from './combobox/types.js';

/** A key typed into an input method (Safari reports it as keyCode 229). */
function isComposing(event: KeyboardEvent<HTMLInputElement>): boolean {
  return event.nativeEvent.isComposing || event.keyCode === 229;
}

/**
 * A text input with a list of suggestions (ARIA 1.2 combobox, list
 * autocomplete): typing, a press on the input or ArrowDown opens the list
 * and the consumer filters `groups` from `inputValue`; the arrow keys move
 * the active option (`aria-activedescendant`) while focus stays in the
 * input; Enter or a press chooses it (`onSelect`) or runs the `action`;
 * Escape closes the list, and a second Escape empties the input. A
 * disabled option is shown and read as unavailable but never chosen. The
 * active option is held by its value, so it stays the same option (or
 * none) when the results change under it.
 */
export function Combobox(props: ComboboxProps) {
  assertCombobox(props);
  const {
    action,
    countText,
    description,
    disabled = false,
    emptyText,
    error,
    groups,
    inputValue,
    label,
    labelVisuallyHidden = false,
    listLabel,
    note,
    onInputChange,
    onSelect,
    placeholder,
    required = false,
    requiredMark = 'visible',
    size = 'md',
  } = props;
  const listId = useId();
  const noteId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  // Disabling closes the list for good, so enabling never reopens it.
  if (disabled && open) {
    setOpen(false);
    setActiveKey(null);
  }
  const entries = comboboxEntries(listId, groups, action);
  const shown = open && !disabled;
  const active = shown
    ? entries.find((entry) => entry.key === activeKey)
    : undefined;
  // An active option that leaves the results is dropped, so it never comes
  // back active on its own.
  if (shown && activeKey !== null && !active) setActiveKey(null);
  const hasList = entries.length > 0;
  const optionCount = entries.filter((entry) => entry.kind === 'option').length;
  const announcement = !shown
    ? ''
    : optionCount === 0
      ? emptyText
      : (countText?.(optionCount) ?? '');

  function close() {
    setOpen(false);
    setActiveKey(null);
  }

  function choose(entry: ComboboxEntry) {
    if (entry.kind === 'option') {
      if (entry.option.disabled) return;
      close();
      onSelect(entry.option.value);
    } else {
      close();
      entry.action.onPress();
    }
  }

  function move(step: 1 | -1) {
    if (entries.length === 0) return;
    const last = entries.length - 1;
    if (!shown || !active) {
      setOpen(true);
      setActiveKey(entries[step === 1 ? 0 : last]!.key);
      return;
    }
    const next = (active.index + step + entries.length) % entries.length;
    setActiveKey(entries[next]!.key);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (isComposing(event)) return;
    if (event.altKey && event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
    } else if (event.altKey && event.key === 'ArrowUp') {
      event.preventDefault();
      close();
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      move(event.key === 'ArrowDown' ? 1 : -1);
    } else if (event.key === 'Enter') {
      if (active) {
        event.preventDefault();
        choose(active);
      }
    } else if (event.key === 'Escape') {
      if (shown) {
        event.preventDefault();
        close();
      } else if (inputValue !== '') {
        event.preventDefault();
        onInputChange('');
      }
    }
    // Tab moves focus out, and the blur closes the list.
  }

  return (
    <div className="sw-combobox">
      <Field
        description={description}
        error={error}
        label={label}
        labelVisuallyHidden={labelVisuallyHidden}
        required={required}
        requiredMark={requiredMark}
        size={size}
      >
        <input
          aria-activedescendant={active?.id}
          aria-autocomplete="list"
          aria-controls={shown && hasList ? listId : undefined}
          aria-describedby={shown && note ? noteId : undefined}
          aria-expanded={shown && hasList}
          autoComplete="off"
          disabled={disabled}
          onBlur={close}
          onChange={(event) => {
            onInputChange(event.currentTarget.value);
            setOpen(true);
            setActiveKey(null);
          }}
          // A press on the input opens the list, as the boards show it
          // under an empty field.
          onClick={() => {
            if (!shown) setOpen(true);
          }}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          ref={inputRef}
          role="combobox"
          spellCheck={false}
          type="text"
          value={inputValue}
        />
      </Field>
      {/* Always in the page, so a changed count or the empty text is
          announced while the person types. */}
      <span aria-live="polite" className="sw-sr-only" role="status">
        {announcement}
      </span>
      {shown ? (
        <ComboboxPopup
          activeId={active?.id}
          emptyText={emptyText}
          entries={entries}
          groups={groups}
          inputRef={inputRef}
          listId={listId}
          listLabel={listLabel ?? label}
          note={note}
          noteId={noteId}
          onActivate={(entry) => setActiveKey(entry.key)}
          onChoose={choose}
          onDismiss={close}
        />
      ) : null}
    </div>
  );
}
