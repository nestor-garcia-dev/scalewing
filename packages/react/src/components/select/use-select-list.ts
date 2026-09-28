import { useEffect, useState, type KeyboardEvent, type RefObject } from 'react';

import {
  selectIndexForKey,
  selectedSelectIndex,
  type SelectOption,
} from '../../select-list.js';
import type { SelectAction } from '../Select.js';

type SelectListOptions = {
  action?: SelectAction;
  onChange: (value: string) => void;
  options: readonly SelectOption[];
  rootRef: RefObject<HTMLElement | null>;
  value: string;
};

/**
 * The open state, highlighted item and keyboard model of a Select: the
 * trigger keeps focus, arrows move the highlight over the options and the
 * trailing action (index `options.length`), Enter or Space commits, Escape
 * and a press outside the root close.
 */
export function useSelectList({
  action,
  onChange,
  options,
  rootRef,
  value,
}: SelectListOptions) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const selectedIndex = selectedSelectIndex(options, value);
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
  }, [open, rootRef]);

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

  return {
    commit,
    highlight,
    onTriggerKeyDown,
    open,
    openList,
    setHighlight,
    setOpen,
  };
}
