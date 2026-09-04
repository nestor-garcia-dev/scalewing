import { type SpacingStep, type Theme } from '@scalewing/tokens';

export type SpacingProps = {
  padding?: SpacingStep;
  paddingX?: SpacingStep;
  paddingY?: SpacingStep;
  paddingTop?: SpacingStep;
  paddingRight?: SpacingStep;
  paddingBottom?: SpacingStep;
  paddingLeft?: SpacingStep;
  gap?: SpacingStep;
};

export type NativeSpacingStyle = {
  padding?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  gap?: number;
};

export function mapSpacingStyle(
  theme: Theme,
  props: SpacingProps,
): NativeSpacingStyle {
  const style: NativeSpacingStyle = {};

  if (props.padding !== undefined) {
    style.padding = theme.space[props.padding];
  }

  if (props.paddingX !== undefined) {
    style.paddingHorizontal = theme.space[props.paddingX];
  }

  if (props.paddingY !== undefined) {
    style.paddingVertical = theme.space[props.paddingY];
  }

  if (props.paddingTop !== undefined) {
    style.paddingTop = theme.space[props.paddingTop];
  }

  if (props.paddingRight !== undefined) {
    style.paddingRight = theme.space[props.paddingRight];
  }

  if (props.paddingBottom !== undefined) {
    style.paddingBottom = theme.space[props.paddingBottom];
  }

  if (props.paddingLeft !== undefined) {
    style.paddingLeft = theme.space[props.paddingLeft];
  }

  if (props.gap !== undefined) {
    style.gap = theme.space[props.gap];
  }

  return style;
}
