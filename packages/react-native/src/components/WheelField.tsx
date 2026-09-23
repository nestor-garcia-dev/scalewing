import { useState } from 'react';

import {
  assertWheelFieldValue,
  restingWheelItem,
} from '../wheel-field-items.js';
import { DisclosureControl } from './DisclosureControl.js';
import { LabeledControl } from './LabeledControl.js';
import { Wheel, type WheelItem } from './Wheel.js';

export type WheelFieldItem = WheelItem;

export type WheelFieldProps = {
  disabled?: boolean;
  error?: string;
  hint?: string;
  /** Ordered choices; an empty value rests the wheel on the first one. */
  items: readonly WheelFieldItem[];
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  /** Names the column `<testID>-wheel`. */
  testID?: string;
  /** The selected item id, or the empty string for no selection. */
  value: string;
  /** Accessible name of the column; the field label when omitted. */
  wheelLabel?: string;
};

/**
 * A labeled field-shaped button that discloses one snapping wheel for a
 * choice from a long ordered list (years, counts, durations) where chips
 * would not fit. Rows are radio targets; a settled scroll or a tap selects.
 * An empty value rests on the first item and reports nothing until the
 * person taps a row or scrolls the wheel.
 */
export function WheelField({
  disabled = false,
  error,
  hint,
  items,
  label,
  onChange,
  placeholder,
  testID,
  value,
  wheelLabel,
}: WheelFieldProps) {
  assertWheelFieldValue(items, value);

  const [open, setOpen] = useState(false);
  const selected = items.find((item) => item.id === value);

  return (
    <LabeledControl error={error} hint={hint} label={label}>
      <DisclosureControl
        accessibilityHint={error ?? hint}
        disabled={disabled}
        expanded={open}
        invalid={Boolean(error)}
        label={label}
        onPress={() => setOpen((current) => !current)}
        placeholder={placeholder}
        valueText={selected?.label ?? ''}
      />
      {open ? (
        <Wheel
          accessibilityLabel={wheelLabel ?? label}
          disabled={disabled}
          items={items}
          onSelect={onChange}
          selectedId={restingWheelItem(items, value)?.id ?? ''}
          testID={testID ? `${testID}-wheel` : undefined}
        />
      ) : null}
    </LabeledControl>
  );
}
