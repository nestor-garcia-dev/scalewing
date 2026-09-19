'use client';

import { useId } from 'react';

export type SwitchProps = {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  description?: string;
};

export function Switch({
  label,
  checked,
  onCheckedChange,
  disabled = false,
  description,
}: SwitchProps) {
  const labelId = useId();
  const descriptionId = useId();

  return (
    <label className="sw-switch">
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
          type="checkbox"
        />
        <span aria-hidden="true" className="sw-switch-track">
          <span className="sw-switch-thumb" />
        </span>
      </span>
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
    </label>
  );
}
