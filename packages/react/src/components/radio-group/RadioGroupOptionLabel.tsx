import { useId, type ReactNode } from 'react';

export type RadioGroupOption = {
  value: string;
  label: string;
  disabled?: boolean;
  /**
   * A decorative glyph between the radio and the label, such as a person or
   * a building for the kind of check. It is `aria-hidden` and drawn in the
   * text color: the option's accessible name stays its `label` text.
   */
  icon?: ReactNode;
  /**
   * Secondary text for this option, such as its history: a muted caption at
   * the row's inline end, or on a second line under the label when the row
   * is narrower than md or the two do not fit. It is the radio's accessible
   * description (`aria-describedby`), never part of its name, and a press on
   * it chooses the option. It may hold phrasing content such as a `Badge`,
   * but nothing interactive: it sits inside the option's `<label>`.
   * `undefined`, `null`, `false`, `true` and `''` are no description; any
   * other node, `0` or a component that renders nothing included, is one,
   * so pass `undefined` when there is nothing to say.
   */
  description?: ReactNode;
};

type RadioGroupOptionLabelProps = {
  option: RadioGroupOption;
  name: string;
  checked: boolean;
  required: boolean;
  onSelect: () => void;
};

/** Whether React renders something for a description: not nothing, a boolean or ''. */
function hasDescription(description: ReactNode): boolean {
  return (
    description !== undefined &&
    description !== null &&
    typeof description !== 'boolean' &&
    description !== ''
  );
}

/**
 * One option of a RadioGroup: the native radio and its mark, the optional
 * glyph, and the label. With a description, the label and the description
 * share a wrapping body, and the radio is named by the label text alone and
 * described by the description.
 */
export function RadioGroupOptionLabel({
  option,
  name,
  checked,
  required,
  onSelect,
}: RadioGroupOptionLabelProps) {
  const id = useId();
  const textId = `${id}-text`;
  const descriptionId = `${id}-description`;
  const described = hasDescription(option.description);
  const text = (
    <span className="sw-radio-group-text" id={described ? textId : undefined}>
      {option.label}
    </span>
  );

  return (
    <label className="sw-radio-group-option">
      <span className="sw-radio-group-control">
        <input
          aria-describedby={described ? descriptionId : undefined}
          aria-labelledby={described ? textId : undefined}
          checked={checked}
          className="sw-radio-group-input"
          disabled={option.disabled}
          name={name}
          onChange={(event) => {
            if (event.currentTarget.checked) onSelect();
          }}
          required={required}
          type="radio"
          value={option.value}
        />
        <span aria-hidden="true" className="sw-radio-group-mark" />
      </span>
      {option.icon ? (
        <span aria-hidden="true" className="sw-radio-group-icon">
          {option.icon}
        </span>
      ) : null}
      {described ? (
        <span className="sw-radio-group-body">
          {text}
          <span
            className="sw-radio-group-option-description"
            id={descriptionId}
          >
            {option.description}
          </span>
        </span>
      ) : (
        text
      )}
    </label>
  );
}
