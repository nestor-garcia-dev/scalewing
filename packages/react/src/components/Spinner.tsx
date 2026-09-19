'use client';

export type SpinnerSize = 'sm' | 'md' | 'lg';

export type SpinnerProps =
  | { label: string; size?: SpinnerSize; decorative?: false }
  | { label?: never; size?: SpinnerSize; decorative: true };

export function Spinner({
  label,
  size = 'md',
  decorative = false,
}: SpinnerProps) {
  const className = `sw-spinner sw-spinner-${size}`;
  if (decorative)
    return (
      <span aria-hidden="true" className={className}>
        <span className="sw-spinner-icon" />
      </span>
    );

  if (!label?.trim()) throw new RangeError('label must not be empty');

  return (
    <span className={className} role="status">
      <span aria-hidden="true" className="sw-spinner-icon" />
      <span className="sw-sr-only">{label}</span>
    </span>
  );
}
