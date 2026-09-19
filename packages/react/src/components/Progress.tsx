'use client';

import { useId } from 'react';

export type ProgressTone = 'accent' | 'success' | 'danger';

export type ProgressProps = {
  label: string;
  value: number;
  max: number;
  tone?: ProgressTone;
};

export function Progress({
  label,
  value,
  max,
  tone = 'accent',
}: ProgressProps) {
  if (!label.trim()) throw new RangeError('label must not be empty');
  if (!Number.isFinite(max) || max <= 0)
    throw new RangeError('max must be a positive finite number');
  if (!Number.isFinite(value) || value < 0 || value > max)
    throw new RangeError('value must be finite and within 0..max');

  const labelId = useId();
  return (
    <div className={`sw-progress sw-progress-${tone}`}>
      <div className="sw-progress-heading">
        <span className="sw-progress-label" id={labelId}>
          {label}
        </span>
        <span aria-hidden="true" className="sw-progress-count">
          {value} / {max}
        </span>
      </div>
      <progress
        aria-labelledby={labelId}
        className="sw-progress-bar"
        max={max}
        value={value}
      />
    </div>
  );
}
