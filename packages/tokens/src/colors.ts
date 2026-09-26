export const semanticColorKeys = [
  'background',
  'surface',
  'text',
  'muted',
  'accent',
  'onAccent',
  'secondary',
  'onSecondary',
  'tertiary',
  'onTertiary',
  'subtle',
  'danger',
  'onDanger',
  'success',
  'warning',
  'border',
] as const;

export type SemanticColorKey = (typeof semanticColorKeys)[number];

export type ColorTokens = Record<SemanticColorKey, string>;

export const lightColors: ColorTokens = {
  background: '#FFFFFF',
  surface: '#FFFFFF',
  text: '#1D1D1F',
  muted: '#6E6E73',
  accent: '#5B3DF5',
  onAccent: '#FFFFFF',
  // Follows `surface` unless a palette or overlay sets it (see createTheme),
  // so a secondary action stays an outlined pill by default.
  secondary: '#FFFFFF',
  onSecondary: '#1D1D1F',
  // A neutral default, apart from every palette's accent; a palette may tint it.
  tertiary: '#48484A',
  onTertiary: '#FFFFFF',
  subtle: '#F2F2F5',
  danger: '#B42318',
  onDanger: '#FFFFFF',
  success: '#087443',
  warning: '#B54708',
  border: '#D2D2D7',
};

export const darkColors: ColorTokens = {
  background: '#000000',
  surface: '#1C1C1E',
  text: '#F5F5F7',
  muted: '#A1A1A6',
  accent: '#A78BFA',
  onAccent: '#101214',
  secondary: '#1C1C1E',
  onSecondary: '#F5F5F7',
  tertiary: '#D1D1D6',
  onTertiary: '#101214',
  subtle: '#2C2C2E',
  danger: '#F97066',
  onDanger: '#101214',
  success: '#5BE0A0',
  warning: '#FDB022',
  border: '#3A3A3C',
};

export function isSemanticColorKey(value: string): value is SemanticColorKey {
  return (semanticColorKeys as readonly string[]).includes(value);
}
