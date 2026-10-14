import { cx } from '../../class-names.js';
import { type DateRangePreset } from '../../date-range-input.js';
import { tabStop } from '../../tab-stop.js';

export type RangePresetsProps = {
  presets: readonly DateRangePreset[];
  /** Names the group, such as "Quick ranges". */
  label: string;
  /** The preset whose range is the one shown, if any. */
  pressedId: string | undefined;
  onChoose: (preset: DateRangePreset) => void;
  /** `list` beside the months; `row` above one month, scrolling sideways. */
  layout: 'list' | 'row';
};

/**
 * DateRangeButton's presets: a named group of buttons, the one matching
 * the range shown `aria-pressed`. A press applies its range at once.
 */
export function RangePresets({
  presets,
  label,
  pressedId,
  onChoose,
  layout,
}: RangePresetsProps) {
  return (
    <div
      aria-label={label}
      className={cx(
        'sw-date-range-presets',
        layout === 'row' && 'sw-date-range-presets-row',
      )}
      role="group"
    >
      {presets.map((preset) => (
        <button
          aria-pressed={preset.id === pressedId}
          className="sw-date-range-preset"
          key={preset.id}
          onClick={() => onChoose(preset)}
          tabIndex={tabStop}
          type="button"
        >
          {preset.label}
        </button>
      ))}
    </div>
  );
}
