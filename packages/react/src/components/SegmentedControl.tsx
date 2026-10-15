'use client';

import { forwardRef, useId, type KeyboardEvent, type ReactNode } from 'react';

import { type AccessibleName } from '../accessible-name.js';
import { cx } from '../class-names.js';
import { type Breakpoint, breakpoints } from '../css/breakpoints.js';
import { segmentedRaisedClass } from '../css/css-segmented-raised.js';
import {
  segmentedFullWidthClass,
  type SegmentedSize,
  segmentedSizes,
  segmentedSmClass,
} from '../css/css-segmented-sizing.js';
import { FieldErrorRegion } from './FieldErrorRegion.js';
import { tabStop } from '../tab-stop.js';

export { segmentedSizes, type SegmentedSize };

export type SegmentedItem = {
  id: string;
  label: ReactNode;
  /**
   * A consumer mark before the label, such as a `GlyphTile` or a Lucide
   * glyph, hidden from assistive technology (the label names the item).
   * When any item has one, every item of a compact track takes the `md`
   * control height and label type on a subtle track; a filled track keeps
   * its look and gains the marks. A falsy value (`0`, `''`) is no icon.
   */
  icon?: ReactNode;
};

/**
 * `compact` is the quiet chip track for a section switch; `filled` gives every
 * segment the same width and paints the selected one in the accent, for a
 * choice that decides what a form does. It sizes to its container: the full
 * width in a Stack, the width of its widest label in an Inline. `raised` is
 * a grey track whose selected segment is the surface raised by a small
 * shadow, every segment at the md control height with its words in the
 * text color, sized to its segments even in a Stack (unlike `compact`).
 */
export type SegmentedControlVariant = 'compact' | 'filled' | 'raised';

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

export type SegmentedControlProps = AccessibleName &
  SegmentedChange & {
    items: readonly SegmentedItem[];
    value: string;
    variant?: SegmentedControlVariant;
    /**
     * A validation message under the control, as `Field`'s: announced from a
     * polite live region, linked by `aria-describedby`, with `aria-invalid`
     * and a danger outline on the group. An empty string is no error.
     */
    error?: string;
    /** Sets `aria-required` on the group; the visible mark belongs to the element that labels it. */
    required?: boolean;
    /**
     * Below this breakpoint the control fills its column and its segments
     * share the width equally, whatever the variant, such as a period
     * switch across a phone. From it up it keeps its own width.
     */
    fullWidthBelow?: Breakpoint;
    /**
     * `sm` pads every segment a step less and keeps each label on one line
     * (ending in an ellipsis past its share; its name keeps the whole
     * label), so three or four segments with counts fit a phone's card.
     * Keep the labels short enough to fit: the hidden part cannot be read.
     * `md` (the default) is the variant's own padding.
     */
    size?: SegmentedSize;
  };

export const SegmentedControl = forwardRef<
  HTMLDivElement,
  SegmentedControlProps
>(function SegmentedControl(
  {
    disabled = false,
    error,
    fullWidthBelow,
    items,
    onChange,
    required = false,
    size = 'md',
    value,
    variant = 'compact',
    ...labelProps
  },
  ref,
) {
  const errorId = useId();
  if (
    fullWidthBelow !== undefined &&
    !(breakpoints as readonly unknown[]).includes(fullWidthBelow)
  )
    throw new RangeError(
      `Unknown SegmentedControl fullWidthBelow: ${String(fullWidthBelow)}`,
    );
  if (!(segmentedSizes as readonly unknown[]).includes(size))
    throw new RangeError(`Unknown SegmentedControl size: ${String(size)}`);
  const withIcons = items.some((item) => item.icon);

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

  // The wrapper is always rendered, so an error that appears later swaps
  // text into a live region that already exists and the group keeps focus.
  return (
    <div
      className={cx(
        'sw-segmented-field',
        variant === 'filled' && 'sw-segmented-field-filled',
        fullWidthBelow && segmentedFullWidthClass(fullWidthBelow),
      )}
    >
      <div
        ref={ref}
        aria-describedby={error ? errorId : undefined}
        aria-disabled={disabled || undefined}
        aria-invalid={error ? true : undefined}
        aria-required={required || undefined}
        className={cx(
          'sw-segmented',
          variant === 'filled' && 'sw-segmented-filled',
          variant === 'raised' && segmentedRaisedClass,
          withIcons && 'sw-segmented-with-icons',
          disabled && 'sw-segmented-disabled',
          size === 'sm' && segmentedSmClass,
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
              // Every item stays a tab stop, as each already was outside
              // Safari: the arrow keys change the value, not the focus.
              tabIndex={tabStop}
              type="button"
            >
              {item.icon ? (
                <span aria-hidden="true" className="sw-segmented-item-icon">
                  {item.icon}
                </span>
              ) : null}
              {size === 'sm' ? (
                // Its own box, so the ellipsis works in a flex item too.
                <span className="sw-segmented-item-label">{item.label}</span>
              ) : (
                item.label
              )}
            </button>
          );
        })}
      </div>
      <FieldErrorRegion
        className="sw-field-error"
        id={errorId}
        message={error}
      />
    </div>
  );
});
