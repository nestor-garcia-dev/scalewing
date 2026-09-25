import { Inline } from './Inline.js';
import { CheckList } from './CheckList.js';
import { Chip } from './Chip.js';
import { LabeledControl } from './LabeledControl.js';

export type SingleSelectItem = {
  id: string;
  label: string;
  /** A muted line under the label in the `list` variant; chips omit it. */
  detail?: string;
};

export type SingleSelectVariant = 'chips' | 'list';

export type SingleSelectProps = {
  disabled?: boolean;
  error?: string;
  hint?: string;
  items: readonly SingleSelectItem[];
  label: string;
  onChange: (value: string) => void;
  /** The selected item id, or the empty string for no selection. */
  value: string;
  /**
   * `chips` (default) wraps radio pills; `list` stacks full-width radio rows
   * with a check mark, for a screen whose one question is this choice.
   */
  variant?: SingleSelectVariant;
};

/**
 * A labeled group of radios for one choice among more options than a
 * SegmentedControl can show. Pressing the selected option again is a no-op.
 */
export function SingleSelect({
  disabled = false,
  error,
  hint,
  items,
  label,
  onChange,
  value,
  variant = 'chips',
}: SingleSelectProps) {
  const choose = (id: string) => {
    if (id !== value) onChange(id);
  };
  if (variant === 'list') {
    return (
      <LabeledControl error={error} hint={hint} label={label}>
        <CheckList
          disabled={disabled}
          items={items}
          label={label}
          onPress={choose}
          role="radio"
          value={value ? [value] : []}
        />
      </LabeledControl>
    );
  }
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
            onPress={() => choose(item.id)}
            selected={item.id === value}
          />
        ))}
      </Inline>
    </LabeledControl>
  );
}
