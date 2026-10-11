import { Text } from './Text.js';

export const requiredMarks = ['visible', 'hidden'] as const;

/**
 * Whether a required control's label shows the required mark: `visible`
 * (the default) draws " *" after the label; `hidden` leaves it out, for a
 * form that marks nothing as required (or marks what is optional instead).
 * The control stays required either way, so assistive technology still
 * hears it. When hidden, say in visible text which fields must be filled
 * (a form-level note, or "Required" in the description); a placeholder
 * alone is not enough (WCAG 3.3.2).
 */
export type RequiredMark = (typeof requiredMarks)[number];

/** Fails closed on a value that is not a known required mark. */
export function assertRequiredMark(value: unknown): void {
  if (!(requiredMarks as readonly unknown[]).includes(value))
    throw new RangeError(`Unknown requiredMark: ${String(value)}`);
}

/** Whether the mark is drawn: a required control whose mark is visible. */
export function showsRequiredMark(
  required: boolean,
  requiredMark: RequiredMark,
): boolean {
  return required && requiredMark === 'visible';
}

/**
 * A form control's label words and its required mark, as `Field` draws
 * them. The `<label>` around it inherits the canvas's body type, so its
 * line box, and the gap to the control below, is the same for every field
 * that uses it (`Field`, `DateField` and `Select`; `Combobox` through
 * `Field`, and `FilterChips` shares `showsRequiredMark` for its legend). The mark is `aria-hidden`: the
 * control's own required state is what assistive technology reads, and
 * `requiredMark="hidden"` leaves it out.
 */
export function FieldLabelText({
  label,
  required = false,
  requiredMark = 'visible',
  size = 'md',
  visuallyHidden = false,
}: {
  label: string;
  required?: boolean;
  requiredMark?: RequiredMark;
  size?: 'xs' | 'md';
  visuallyHidden?: boolean;
}) {
  return (
    <Text
      as="span"
      className={visuallyHidden ? 'sw-sr-only' : undefined}
      variant={size === 'xs' ? 'caption' : 'label'}
    >
      {label}
      {showsRequiredMark(required, requiredMark) ? (
        <span aria-hidden="true" className="sw-field-required">
          {' '}
          *
        </span>
      ) : null}
    </Text>
  );
}
