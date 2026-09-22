import { forwardRef, type KeyboardEvent, type ReactNode } from 'react';

import { cx } from '../class-names.js';

export type SegmentedItem = {
  id: string;
  label: ReactNode;
};

type SegmentedLabel =
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-label'?: never; 'aria-labelledby': string };

/**
 * `compact` is the quiet chip track for a section switch; `filled` gives every
 * segment the same width and paints the selected one in the accent, for a
 * choice that decides what a form does. It sizes to its container: the full
 * width in a Stack, the width of its widest label in an Inline.
 */
export type SegmentedControlVariant = 'compact' | 'filled';

/**
 * A disabled control can never report a change, so it needs no `onChange`;
 * a live one must have it.
 */
type SegmentedChange =
  | { disabled?: false; onChange: (id: string) => void }
  | {
      /** Keeps the current choice visible but inert, for an identity that can no longer change. */
      disabled: true;
      onChange?: (id: string) => void;
    };

export type SegmentedControlProps = SegmentedLabel &
  SegmentedChange & {
    items: readonly SegmentedItem[];
    value: string;
    variant?: SegmentedControlVariant;
  };

export const SegmentedControl = forwardRef<
  HTMLDivElement,
  SegmentedControlProps
>(function SegmentedControl(
  {
    disabled = false,
    items,
    onChange,
    value,
    variant = 'compact',
    ...labelProps
  },
  ref,
) {
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (disabled || (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft')) {
      return;
    }

    const index = items.findIndex((item) => item.id === value);
    if (index < 0) {
      return;
    }

    event.preventDefault();
    const delta = event.key === 'ArrowRight' ? 1 : -1;
    const next = items[(index + delta + items.length) % items.length];
    if (next) {
      onChange?.(next.id);
    }
  }

  return (
    <div
      ref={ref}
      aria-disabled={disabled || undefined}
      className={cx(
        'sw-segmented',
        variant === 'filled' && 'sw-segmented-filled',
        disabled && 'sw-segmented-disabled',
      )}
      onKeyDown={onKeyDown}
      role="radiogroup"
      {...labelProps}
    >
      {items.map((item) => {
        const selected = item.id === value;

        return (
          <button
            aria-checked={selected}
            className={cx(
              'sw-segmented-item',
              selected && 'sw-segmented-item-selected',
            )}
            disabled={disabled}
            key={item.id}
            onClick={() => {
              if (!selected) {
                onChange?.(item.id);
              }
            }}
            role="radio"
            type="button"
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
});
