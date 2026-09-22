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
 * `compact` is the quiet chip track for a section switch; `filled` stretches
 * to its container, gives every segment the same width and paints the
 * selected one in the accent, for a choice that decides what a form does.
 */
export type SegmentedControlVariant = 'compact' | 'filled';

export type SegmentedControlProps = SegmentedLabel & {
  items: readonly SegmentedItem[];
  onChange: (id: string) => void;
  value: string;
  variant?: SegmentedControlVariant;
};

export const SegmentedControl = forwardRef<
  HTMLDivElement,
  SegmentedControlProps
>(function SegmentedControl(
  { items, onChange, value, variant = 'compact', ...labelProps },
  ref,
) {
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
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
      onChange(next.id);
    }
  }

  return (
    <div
      ref={ref}
      className={cx(
        'sw-segmented',
        variant === 'filled' && 'sw-segmented-filled',
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
            key={item.id}
            onClick={() => {
              if (!selected) {
                onChange(item.id);
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
