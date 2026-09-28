import { cx } from '../../class-names.js';
import { type SelectOption } from '../../select-list.js';

/**
 * The closed trigger's text: the current label, stacked in one grid cell
 * over a hidden copy of every option's label, so the trigger is as wide as
 * its longest option, as a native select is, and does not change width when
 * the value changes, including to or from the placeholder. The copies are
 * drawn from `data-label` by generated CSS, so they are neither text content
 * nor in the accessibility tree.
 */
export function SelectValue({
  options,
  placeholder,
  text,
  textIsPlaceholder,
}: {
  options: readonly SelectOption[];
  placeholder?: string;
  text: string;
  textIsPlaceholder: boolean;
}) {
  const labels = options.map((option) => option.label);
  if (placeholder !== undefined) labels.push(placeholder);
  return (
    <span className="sw-select-value">
      <span
        className={cx(
          'sw-select-value-text',
          textIsPlaceholder && 'sw-select-placeholder',
        )}
      >
        {text}
      </span>
      {labels.map((sizerLabel, index) => (
        <span
          aria-hidden="true"
          className="sw-select-value-sizer"
          data-label={sizerLabel}
          key={index}
        />
      ))}
    </span>
  );
}
