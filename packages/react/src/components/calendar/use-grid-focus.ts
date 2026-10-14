import {
  useLayoutEffect,
  useRef,
  type FocusEvent,
  type RefObject,
} from 'react';

export type GridFocus = {
  /** The next focus date takes DOM focus, as after a grid key. */
  requestFocus: () => void;
  /** Spread on the element holding the grids, to follow where focus is. */
  focusHandlers: {
    onBlur: () => void;
    onFocus: (event: FocusEvent<HTMLElement>) => void;
  };
};

/**
 * Moves DOM focus to a calendar's focus date when asked (on mount when
 * `focusOnMount`, and after a grid key) and while a day already holds
 * focus, so a new value or new bounds never strand focus on a removed day.
 * Header controls and presses change the date without taking focus from
 * where it is. Shared by DateField's calendar and DateRangeButton.
 */
export function useGridFocus(
  containerRef: RefObject<HTMLElement | null>,
  focusDate: string,
  focusOnMount: boolean,
): GridFocus {
  const focusGrid = useRef(focusOnMount);
  // Whether a day holds DOM focus. Removing that day fires no blur, so this
  // stays true when a new value or bounds move the grid out from under it.
  const gridFocused = useRef(false);

  useLayoutEffect(() => {
    if (!focusGrid.current && !gridFocused.current) return;
    focusGrid.current = false;
    containerRef.current
      ?.querySelector<HTMLElement>(`[role="grid"] [data-date="${focusDate}"]`)
      ?.focus({ preventScroll: true });
  }, [containerRef, focusDate]);

  return {
    requestFocus: () => {
      focusGrid.current = true;
    },
    focusHandlers: {
      onBlur: () => {
        gridFocused.current = false;
      },
      onFocus: (event) => {
        gridFocused.current = event.target.closest('[role="grid"]') !== null;
      },
    },
  };
}
