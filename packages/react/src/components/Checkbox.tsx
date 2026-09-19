'use client';

import { useId } from 'react';

export type CheckboxProps = {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  description?: string;
  error?: string;
};

export function Checkbox({
  label,
  checked,
  onCheckedChange,
  disabled = false,
  required = false,
  description,
  error,
}: CheckboxProps) {
  const descriptionId = useId();
  const errorId = useId();
  const describedBy = [
    description ? descriptionId : null,
    error ? errorId : null,
  ]
    .filter((id) => id !== null)
    .join(' ');

  return (
    <div className="sw-checkbox">
      <label className="sw-checkbox-label">
        <span className="sw-checkbox-control">
          <input
            aria-describedby={describedBy || undefined}
            aria-invalid={Boolean(error)}
            checked={checked}
            className="sw-checkbox-input"
            disabled={disabled}
            onChange={(event) => {
              if (!disabled) onCheckedChange(event.currentTarget.checked);
            }}
            required={required}
            type="checkbox"
          />
          <span aria-hidden="true" className="sw-checkbox-mark" />
        </span>
        <span className="sw-checkbox-text">{label}</span>
      </label>
      {description ? (
        <span className="sw-checkbox-description" id={descriptionId}>
          {description}
        </span>
      ) : null}
      {error ? (
        <span className="sw-checkbox-error" id={errorId}>
          {error}
        </span>
      ) : null}
    </div>
  );
}
