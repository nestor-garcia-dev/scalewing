import { Inline } from './Inline.js';
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
};

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
}: MultiSelectProps) {
  return (
    <LabeledControl error={error} hint={hint} label={label}>
      <Inline accessibilityLabel={label} gap={2} wrap>
        {items.map((item) => (
          <Chip
            accessibilityRole="checkbox"
            disabled={disabled}
            key={item.id}
            label={item.label}
            onPress={() => onChange(toggleSelection(items, value, item.id))}
            selected={value.includes(item.id)}
          />
        ))}
      </Inline>
    </LabeledControl>
  );
}
