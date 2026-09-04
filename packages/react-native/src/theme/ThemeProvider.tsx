import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import {
  createTheme,
  type ColorScheme,
  type ColorTokens,
  type Theme,
} from '@scalewing/tokens';

const ThemeContext = createContext<Theme | null>(null);

export type ThemeProviderProps = {
  colorScheme?: ColorScheme | 'system';
  colors?: Partial<ColorTokens>;
  children: ReactNode;
};

export function ThemeProvider({
  colorScheme = 'system',
  colors,
  children,
}: ThemeProviderProps) {
  const deviceScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const resolvedScheme = colorScheme === 'system' ? deviceScheme : colorScheme;
  const theme = useMemo(
    () => createTheme({ colorScheme: resolvedScheme, colors }),
    [colors, resolvedScheme],
  );

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): Theme {
  const theme = useContext(ThemeContext);

  if (!theme) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return theme;
}
