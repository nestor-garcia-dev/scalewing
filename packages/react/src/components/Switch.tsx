'use client';

import { useId } from 'react';

import { cx } from '../class-names.js';
import {
  type SwitchCheckedTone,
  switchCheckedTones,
  type SwitchLayout,
  switchLayouts,
} from '../css/css-switch.js';
import { tabStop } from '../tab-stop.js';

export {
  switchCheckedTones,
  switchLayouts,
  type SwitchCheckedTone,
  type SwitchLayout,
};

export type SwitchProps = {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  description?: string;
  /**
   * `leading` (the default) puts the control before its label;
   * `trailing` puts the label and description first and the control at
   * the row's end, the row as wide as its column, as a settings list
   * draws it.
   */
  layout?: SwitchLayout;
  /**
   * The track's colour while on: `accent` (the default) or `success`, for
   * a switch whose on state is the healthy one, such as a feature turned
   * on. The thumb's place says the state either way.
   */
  checkedTone?: SwitchCheckedTone;
};

function assertOneOf<T extends string>(
  values: readonly T[],
  value: T,
  prop: string,
) {
  if (!values.includes(value))
    throw new RangeError(`Unknown Switch ${prop}: ${String(value)}`);
}

export function Switch({
  label,
  checked,
  onCheckedChange,
  disabled = false,
  description,
  layout = 'leading',
  checkedTone = 'accent',
}: SwitchProps) {
  assertOneOf(switchLayouts, layout, 'layout');
  assertOneOf(switchCheckedTones, checkedTone, 'checkedTone');
  const labelId = useId();
  const descriptionId = useId();
  const control = (
    <span className="sw-switch-control">
      <input
        aria-checked={checked}
        aria-describedby={description ? descriptionId : undefined}
        aria-labelledby={labelId}
        checked={checked}
        className="sw-switch-input"
        disabled={disabled}
        onChange={(event) => {
          if (!disabled) onCheckedChange(event.currentTarget.checked);
        }}
        role="switch"
        tabIndex={tabStop}
        type="checkbox"
      />
      <span aria-hidden="true" className="sw-switch-track">
        <span className="sw-switch-thumb" />
      </span>
    </span>
  );
  const copy = (
    <span className="sw-switch-copy">
      <span className="sw-switch-label" id={labelId}>
        {label}
      </span>
      {description ? (
        <span className="sw-switch-description" id={descriptionId}>
          {description}
        </span>
      ) : null}
    </span>
  );

  return (
    <label
      className={cx(
        'sw-switch',
        layout === 'trailing' && 'sw-switch-trailing',
        checkedTone === 'success' && 'sw-switch-success',
      )}
    >
      {layout === 'trailing' ? (
        <>
          {copy}
          {control}
        </>
      ) : (
        <>
          {control}
          {copy}
        </>
      )}
    </label>
  );
}
