import { createContext, useContext, type ReactNode } from 'react';
import { Pressable } from 'react-native';

import { Box } from './Box.js';
import { Text } from './Text.js';
import { useTheme } from '../theme/ThemeProvider.js';
import {
  mapTableCellStyle,
  mapTableRowStyle,
  type TableDensity,
} from '../map-table-style.js';

const TableContext = createContext<{ density: TableDensity }>({
  density: 'compact',
});

export type TableProps = {
  children: ReactNode;
  density?: TableDensity;
};

export function Table({ children, density = 'compact' }: TableProps) {
  return (
    <TableContext.Provider value={{ density }}>
      <Box>{children}</Box>
    </TableContext.Provider>
  );
}

export type TableHeaderProps = {
  children: ReactNode;
};

export function TableHeader({ children }: TableHeaderProps) {
  return <Box>{children}</Box>;
}

export type TableBodyProps = {
  children: ReactNode;
};

export function TableBody({ children }: TableBodyProps) {
  return <Box>{children}</Box>;
}

export type TableRowProps = {
  accessibilityLabel?: string;
  children: ReactNode;
  onPress?: () => void;
};

export function TableRow({
  accessibilityLabel,
  children,
  onPress,
}: TableRowProps) {
  const theme = useTheme();
  const { density } = useContext(TableContext);

  if (onPress) {
    return (
      <Pressable
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => mapTableRowStyle(theme, { density, pressed })}
      >
        {children}
      </Pressable>
    );
  }

  return <Box style={mapTableRowStyle(theme, { density })}>{children}</Box>;
}

export type TableCellProps = {
  align?: 'start' | 'center' | 'end';
  children: ReactNode;
  flex?: number;
  header?: boolean;
  numeric?: boolean;
  truncate?: boolean;
};

export function TableCell({
  align = 'start',
  children,
  flex = 1,
  header = false,
  numeric = false,
  truncate = false,
}: TableCellProps) {
  return (
    <Box style={mapTableCellStyle({ align, flex, numeric })}>
      {typeof children === 'string' || typeof children === 'number' ? (
        <Text
          color={header ? 'muted' : 'text'}
          truncate={truncate}
          variant={numeric ? 'data' : 'caption'}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Box>
  );
}

export type { TableDensity };
