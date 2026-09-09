import { type FlexAlignType, type FlexStyle } from 'react-native';

export type Align = 'start' | 'center' | 'end' | 'stretch';
export type Justify = 'start' | 'center' | 'end' | 'between' | 'around';

export const alignItems: Record<Align, FlexAlignType> = {
  center: 'center',
  end: 'flex-end',
  start: 'flex-start',
  stretch: 'stretch',
};

export const justifyContent: Record<Justify, FlexStyle['justifyContent']> = {
  around: 'space-around',
  between: 'space-between',
  center: 'center',
  end: 'flex-end',
  start: 'flex-start',
};
