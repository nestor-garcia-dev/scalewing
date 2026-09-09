import { type Theme } from '@scalewing/tokens';
import { type ViewStyle } from 'react-native';

export type TableDensity = 'comfortable' | 'compact';

export function mapTableRowStyle(
  theme: Theme,
  options: { density: TableDensity; pressed?: boolean },
): ViewStyle {
  const compact = options.density === 'compact';

  return {
    alignItems: 'center',
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    opacity: options.pressed ? theme.disabledOpacity : 1,
    paddingHorizontal: compact ? theme.space[2] : theme.space[3],
    paddingVertical: compact ? theme.space[1] : theme.space[2],
  };
}

export function mapTableCellStyle(options: {
  align: 'start' | 'center' | 'end';
  flex: number;
  numeric: boolean;
}): ViewStyle {
  const alignment =
    options.align === 'center'
      ? 'center'
      : options.numeric || options.align === 'end'
        ? 'flex-end'
        : 'flex-start';

  return {
    alignItems: alignment,
    flex: options.flex,
    minWidth: 0,
  };
}
