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

import {
  assertThemeCanvas,
  type ThemeCanvas,
} from '../css/css-canvas-grouped.js';
import { assertThemeDensity, type ThemeDensity } from '../css/css-density.js';
import { assertThemeFrame, type ThemeFrame } from '../css/css-theme-frame.js';
import {
  assertDisplayFace,
  type DisplayFace,
} from '../css/css-display-face.js';

const ThemeContext = createContext<Theme | null>(null);

/** The density of the ThemeProvider around this one. */
const DensityContext = createContext<ThemeDensity>('comfortable');

export type ThemeProviderProps = {
  colorScheme?: ColorScheme | 'system';
  palette?: PaletteId;
  colors?: ThemeColors;
  /**
   * The page's tone: `default` is the theme's background; `grouped` (opt-in)
   * is a quiet grey in the light scheme (the background in the dark one,
   * already darker than its surface), so white cards stand apart from the
   * page. Put links and accent words in the cards: on the grouped grey the
   * accent falls under 4.5:1 in some palettes, while the text and muted
   * colours keep it. An unknown value throws a `RangeError`.
   */
  canvas?: ThemeCanvas;
  /**
   * `none` (default) leaves the children in the document's flow; `site`
   * (opt-in) makes the themed root a public site's page: a column at least
   * the window's height whose last child (the footer) sits at its foot, so
   * a short page's footer meets the window's foot. An unknown value throws
   * a `RangeError`.
   */
  frame?: ThemeFrame;
  /**
   * `system` (default) sets titles in the body face; `condensed` (opt-in)
   * sets `hero`, `display`, `headline` and `heading` text in the tokens'
   * condensed face (Barlow Condensed, which the app loads). It writes
   * `data-display-face` on the themed node, which every title inside
   * inherits; a nested provider's `system` cannot undo it, so set it once at
   * the page's root. An unknown value throws a `RangeError`.
   */
  displayFace?: DisplayFace;
  /**
   * `comfortable` (default) draws today's touch-sized controls. `compact`
   * (opt-in) is a desktop data tool's scale, on a fine pointer only (a touch
   * screen keeps its 44 px targets): md controls 36 px high with 14 px side
   * padding, sm 28/10, xs 24/8, FilterChips 32 px, Card corners at the md
   * radius, and 15/22 reading text in a Card, a Table and a DescriptionList
   * and for everything that inherits the root's type. It reaches everything
   * inside: a ThemeProvider nested in a compact one is compact too. An
   * unknown value throws a `RangeError`.
   */
  density?: ThemeDensity;
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
  canvas = 'default',
  frame = 'none',
  displayFace = 'system',
  density = 'comfortable',
  children,
}: ThemeProviderProps) {
  assertThemeCanvas(canvas);
  assertThemeFrame(frame);
  assertDisplayFace(displayFace);
  assertThemeDensity(density);
  const resolvedDensity =
    useContext(DensityContext) === 'compact' ? 'compact' : density;
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
      <DensityContext.Provider value={resolvedDensity}>
        <div
          data-canvas={canvas === 'default' ? undefined : canvas}
          data-density={resolvedDensity === 'compact' ? 'compact' : undefined}
          data-display-face={displayFace === 'system' ? undefined : displayFace}
          data-frame={frame === 'none' ? undefined : frame}
          data-palette={palette}
          data-theme={theme.colorScheme}
          style={themeCssVars(theme)}
        >
          {children}
        </div>
      </DensityContext.Provider>
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
