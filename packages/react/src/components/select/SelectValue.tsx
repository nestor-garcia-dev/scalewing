import { type SelectOption } from '../../select-list.js';

/**
 * The closed trigger's text: the current label, stacked in one grid cell
 * over a hidden copy of every option's label, so the trigger is as wide as
 * its longest option, as a native select is, and does not change width when
 * the value changes. The copies are drawn from `data-label` by generated CSS,
 * so they are neither text content nor in the accessibility tree.
 */
export function SelectValue({
  options,
  text,
}: {
  options: readonly SelectOption[];
  text: string;
}) {
  return (
    <span className="sw-select-value">
      <span className="sw-select-value-text">{text}</span>
      {options.map((option) => (
        <span
          aria-hidden="true"
          className="sw-select-value-sizer"
          data-label={option.label}
          key={option.value}
        />
      ))}
    </span>
  );
}
