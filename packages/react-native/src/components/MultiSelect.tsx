import { Inline } from './Inline.js';
import { CheckList } from './CheckList.js';
import { Chip } from './Chip.js';
import { LabeledControl } from './LabeledControl.js';

export type MultiSelectItem = {
  id: string;
  label: string;
};

export type MultiSelectProps = {
  disabled?: boolean;
  error?: string;
  hint?: string;
  items: readonly MultiSelectItem[];
  label: string;
  onChange: (value: string[]) => void;
  value: readonly string[];
  /**
   * `chips` (default) wraps checkable pills; `list` stacks full-width rows
   * with a check mark, for a screen whose one question is this choice.
   */
  variant?: MultiSelectVariant;
};

export type MultiSelectVariant = 'chips' | 'list';

/** Toggles one id and reports the selection in item order. */
export function toggleSelection(
  items: readonly MultiSelectItem[],
  value: readonly string[],
  id: string,
): string[] {
  const next = new Set(value);
  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }
  return items.filter((item) => next.has(item.id)).map((item) => item.id);
}

export function MultiSelect({
  disabled = false,
  error,
  hint,
  items,
  label,
  onChange,
  value,
  variant = 'chips',
}: MultiSelectProps) {
  const toggle = (id: string) => onChange(toggleSelection(items, value, id));
  if (variant === 'list') {
    return (
      <LabeledControl error={error} hint={hint} label={label}>
        <CheckList
          disabled={disabled}
          items={items}
          label={label}
          onToggle={toggle}
          value={value}
        />
      </LabeledControl>
    );
  }
  return (
    <LabeledControl error={error} hint={hint} label={label}>
      <Inline accessibilityLabel={label} gap={2} wrap>
        {items.map((item) => (
          <Chip
            accessibilityRole="checkbox"
            disabled={disabled}
            key={item.id}
            label={item.label}
            onPress={() => toggle(item.id)}
            selected={value.includes(item.id)}
          />
        ))}
      </Inline>
    </LabeledControl>
  );
}
