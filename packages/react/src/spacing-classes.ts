import { type SpacingStep } from '@scalewing/tokens';
import { type PaddingAxis, spacingClass } from './css/spacing-classes.js';

export type SpacingProps = {
  padding?: SpacingStep;
  paddingX?: SpacingStep;
  paddingY?: SpacingStep;
  paddingTop?: SpacingStep;
  paddingRight?: SpacingStep;
  paddingBottom?: SpacingStep;
  paddingLeft?: SpacingStep;
};

const paddingPropToAxis = {
  padding: 'all',
  paddingX: 'x',
  paddingY: 'y',
  paddingTop: 'top',
  paddingRight: 'right',
  paddingBottom: 'bottom',
  paddingLeft: 'left',
} as const satisfies Record<keyof SpacingProps, PaddingAxis>;

export function spacingClassNames(props: SpacingProps): string[] {
  return Object.entries(paddingPropToAxis).flatMap(([prop, axis]) => {
    const step = props[prop as keyof SpacingProps];
    return step === undefined ? [] : [spacingClass('padding', axis, step)];
  });
}
