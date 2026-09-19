export type SeparatorOrientation = 'horizontal' | 'vertical';

export type SeparatorProps = {
  orientation?: SeparatorOrientation;
  decorative?: boolean;
};

export function Separator({
  orientation = 'horizontal',
  decorative = false,
}: SeparatorProps) {
  return (
    <div
      aria-hidden={decorative ? 'true' : undefined}
      aria-orientation={decorative ? undefined : orientation}
      className={`sw-separator sw-separator-${orientation}`}
      role={decorative ? 'none' : 'separator'}
    />
  );
}
