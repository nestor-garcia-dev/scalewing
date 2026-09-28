'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';

import { cx } from '../class-names.js';
import {
  selectIndexForKey,
  selectedSelectIndex,
  type SelectOption,
} from '../select-list.js';
import { type FieldSize } from './Field.js';
import { SelectListbox } from './select/SelectListbox.js';
import { SelectValue } from './select/SelectValue.js';
import { Stack } from './Stack.js';
import { Text } from './Text.js';

export type { SelectOption };

export type SelectAction = {
  label: string;
  onPress: () => void;
};

export type SelectProps = {
  action?: SelectAction;
  label: string;
  labelVisuallyHidden?: boolean;
  onChange: (value: string) => void;
  options: readonly SelectOption[];
  size?: FieldSize;
  value: string;
};

export function Select({
  action,
  label,
  labelVisuallyHidden = false,
  onChange,
  options,
  size = 'md',
  value,
}: SelectProps) {
  const labelId = useId();
  const triggerId = useId();
  const listId = useId();
  const optionIdPrefix = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const selectedIndex = selectedSelectIndex(options, value);
  const selected = options[selectedIndex];
  const actionIndex = options.length;
  const itemCount = action ? actionIndex + 1 : actionIndex;

  useEffect(() => {
    if (!open) {
      return;
    }

    function onPointerDown(event: globalThis.PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open]);

  function openList() {
    if (itemCount === 0) {
      return;
    }
    setHighlight(selectedIndex);
    setOpen(true);
  }

  function commit(index: number) {
    if (action && index === actionIndex) {
      action.onPress();
      setOpen(false);
      return;
    }

    const option = options[index];
    if (option && option.value !== value) {
      onChange(option.value);
    }
    setOpen(false);
  }

  function onTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'Escape' && open) {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
      return;
    }

    if (!open) {
      if (
        event.key === 'ArrowDown' ||
        event.key === 'ArrowUp' ||
        event.key === 'Enter' ||
        event.key === ' '
      ) {
        event.preventDefault();
        openList();
      }
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      commit(highlight);
      return;
    }

    const next = selectIndexForKey(event.key, highlight, itemCount);
    if (next !== null) {
      event.preventDefault();
      setHighlight(next);
    }
  }

  return (
    <div
      ref={rootRef}
      className={cx('sw-select', size === 'xs' && 'sw-select-xs')}
    >
      <Stack gap={labelVisuallyHidden ? 0 : 1}>
        <Text
          as="label"
          className={labelVisuallyHidden ? 'sw-sr-only' : undefined}
          htmlFor={triggerId}
          id={labelId}
          variant={size === 'xs' ? 'caption' : 'label'}
        >
          {label}
        </Text>
        <div className="sw-select-control">
          <button
            aria-activedescendant={
              open ? `${optionIdPrefix}-${highlight}` : undefined
            }
            aria-controls={open ? listId : undefined}
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-labelledby={labelId}
            className="sw-select-trigger"
            id={triggerId}
            onBlur={(event) => {
              const next = event.relatedTarget;
              if (next instanceof Node && rootRef.current?.contains(next)) {
                return;
              }
              setOpen(false);
            }}
            onClick={() => {
              if (open) {
                setOpen(false);
                return;
              }
              openList();
            }}
            onKeyDown={onTriggerKeyDown}
            role="combobox"
            type="button"
          >
            <SelectValue options={options} text={selected?.label ?? ''} />
          </button>
          {open ? (
            <SelectListbox
              actionLabel={action?.label}
              highlight={highlight}
              id={listId}
              labelId={labelId}
              onCommit={commit}
              onHighlight={setHighlight}
              optionIdPrefix={optionIdPrefix}
              options={options}
              value={value}
            />
          ) : null}
        </div>
      </Stack>
    </div>
  );
}
