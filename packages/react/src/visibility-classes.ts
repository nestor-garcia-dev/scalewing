import { type Breakpoint, hideClass } from '@scalewing/tokens';

export type VisibilityProps = {
  hideBelow?: Breakpoint;
  hideFrom?: Breakpoint;
};

export function visibilityClassNames({
  hideBelow,
  hideFrom,
}: VisibilityProps): string[] {
  return [
    ...(hideBelow ? [hideClass('below', hideBelow)] : []),
    ...(hideFrom ? [hideClass('from', hideFrom)] : []),
  ];
}
