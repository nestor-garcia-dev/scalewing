import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import {
  createTheme,
  secondaryActionBorder,
  semanticColorKeys,
  type ColorScheme,
  type PaletteId,
  type Theme,
  type ThemeColors,
} from '@scalewing/tokens';

const ThemeContext = createContext<Theme | null>(null);

export type ThemeProviderProps = {
  colorScheme?: ColorScheme | 'system';
  palette?: PaletteId;
  colors?: ThemeColors;
  children: ReactNode;
};

function schemeFromMedia(): ColorScheme {
  if (
    typeof window === 'undefined' ||
    typeof window.matchMedia !== 'function'
  ) {
    return 'light';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function themeCssVars(theme: Theme): CSSProperties {
  const vars: Record<string, string> = {};

  for (const key of semanticColorKeys) {
    vars[`--sw-color-${key}`] = theme.colors[key];
  }
  vars['--sw-button-secondary-border'] = secondaryActionBorder(theme.colors);

  vars['--sw-glass-blur'] = `${theme.glass.blur}px`;
  vars['--sw-glass-saturate'] = String(theme.glass.saturate);
  vars['--sw-glass-fill'] = theme.glass.fill;
  vars['--sw-glass-border'] = theme.glass.border;
  vars['--sw-glass-specular'] = theme.glass.specular;

  return vars as CSSProperties;
}

export function ThemeProvider({
  colorScheme = 'system',
  palette,
  colors,
  children,
}: ThemeProviderProps) {
  const [systemScheme, setSystemScheme] =
    useState<ColorScheme>(schemeFromMedia);

  useEffect(() => {
    if (colorScheme !== 'system' || typeof window.matchMedia !== 'function') {
      return;
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      setSystemScheme(media.matches ? 'dark' : 'light');
    };

    onChange();
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [colorScheme]);

  const resolvedScheme = colorScheme === 'system' ? systemScheme : colorScheme;
  const theme = useMemo(
    () => createTheme({ colorScheme: resolvedScheme, palette, colors }),
    [colors, palette, resolvedScheme],
  );

  return (
    <ThemeContext.Provider value={theme}>
      <div
        data-palette={palette}
        data-theme={theme.colorScheme}
        style={themeCssVars(theme)}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme(): Theme {
  const theme = useContext(ThemeContext);

  if (!theme) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return theme;
}
