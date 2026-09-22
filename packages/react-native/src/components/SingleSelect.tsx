import { Inline } from './Inline.js';
import { Chip } from './Chip.js';
import { LabeledControl } from './LabeledControl.js';

export type SingleSelectItem = {
  id: string;
  label: string;
};

export type SingleSelectProps = {
  disabled?: boolean;
  error?: string;
  hint?: string;
  items: readonly SingleSelectItem[];
  label: string;
  onChange: (value: string) => void;
  /** The selected item id, or the empty string for no selection. */
  value: string;
};

/**
 * A labeled group of radio chips for one choice among more options than a
 * SegmentedControl can show. Pressing the selected chip again is a no-op.
 */
export function SingleSelect({
  disabled = false,
  error,
  hint,
  items,
  label,
  onChange,
  value,
}: SingleSelectProps) {
  return (
    <LabeledControl error={error} hint={hint} label={label}>
      <Inline
        accessibilityLabel={label}
        accessibilityRole="radiogroup"
        gap={2}
        wrap
      >
        {items.map((item) => (
          <Chip
            accessibilityRole="radio"
            disabled={disabled}
            key={item.id}
            label={item.label}
            onPress={() => {
              if (item.id !== value) onChange(item.id);
            }}
            selected={item.id === value}
          />
        ))}
      </Inline>
    </LabeledControl>
  );
}
