import { Text } from './Text.js';

/**
 * A form control's label words and its required mark, as `Field` draws
 * them. The `<label>` around it inherits the canvas's body type, so its
 * line box, and the gap to the control below, is the same for every field
 * that uses it (`Field` and `DateField`). The mark is `aria-hidden`: the
 * control's own required state is what assistive technology reads.
 */
export function FieldLabelText({
  label,
  required = false,
  size = 'md',
  visuallyHidden = false,
}: {
  label: string;
  required?: boolean;
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
      {required ? (
        <span aria-hidden="true" className="sw-field-required">
          {' '}
          *
        </span>
      ) : null}
    </Text>
  );
}
