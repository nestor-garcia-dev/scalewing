import { cx } from '../../class-names.js';
import { tabStop } from '../../tab-stop.js';
import {
  type FilterChipCountAppearance,
  type FilterChipOption,
} from './options.js';

/**
 * A chip's count: a muted figure after a space, or inline in the chip's
 * own words after a middle dot hidden from assistive technology, so the
 * name reads "Open 3" either way.
 */
function ChipCount({
  count,
  appearance,
}: {
  count: number;
  appearance: FilterChipCountAppearance;
}) {
  if (appearance === 'inline')
    return (
      <>
        {' '}
        <span aria-hidden="true">·</span>{' '}
        <span className="sw-filter-chip-count-inline">{count}</span>
      </>
    );
  return (
    <>
      {' '}
      <span className="sw-filter-chip-count">{count}</span>
    </>
  );
}

type FilterChipProps = {
  option: FilterChipOption;
  /** The group's shared input name. */
  name: string;
  type: 'radio' | 'checkbox';
  checked: boolean;
  required: boolean;
  /** Whether this chip is a Tab stop: every checkbox, and one radio. */
  tabStopHere: boolean;
  countAppearance: FilterChipCountAppearance;
  onCheckedChange: (checked: boolean) => void;
};

/** One chip: a native radio or checkbox under its face. */
export function FilterChip({
  option,
  name,
  type,
  checked,
  required,
  tabStopHere,
  countAppearance,
  onCheckedChange,
}: FilterChipProps) {
  return (
    <label
      className={cx(
        'sw-filter-chip',
        option.count === 0 && 'sw-filter-chip-quiet',
        option.tone === 'warning' && 'sw-filter-chip-warning',
      )}
    >
      <input
        checked={checked}
        className="sw-filter-chip-input"
        disabled={option.disabled}
        name={name}
        onChange={(event) => {
          if (!option.disabled) onCheckedChange(event.currentTarget.checked);
        }}
        required={required}
        tabIndex={tabStopHere ? tabStop : undefined}
        type={type}
        value={option.value}
      />
      <span className="sw-filter-chip-face">
        {option.label}
        {option.count === undefined ? null : (
          <ChipCount appearance={countAppearance} count={option.count} />
        )}
      </span>
    </label>
  );
}
