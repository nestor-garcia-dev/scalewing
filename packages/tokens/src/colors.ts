export const semanticColorKeys = [
  'background',
  'surface',
  'text',
  'muted',
  'accent',
  'onAccent',
  'danger',
  'onDanger',
  'success',
  'border',
] as const;

export type SemanticColorKey = (typeof semanticColorKeys)[number];

export type ColorTokens = Record<SemanticColorKey, string>;

export const lightColors: ColorTokens = {
  background: '#F5F5F7',
  surface: '#FFFFFF',
  text: '#1D1D1F',
  muted: '#6E6E73',
  accent: '#0B615E',
  onAccent: '#FFFFFF',
  danger: '#B42318',
  onDanger: '#FFFFFF',
  success: '#087443',
  border: '#D2D2D7',
};

export const darkColors: ColorTokens = {
  background: '#000000',
  surface: '#1C1C1E',
  text: '#F5F5F7',
  muted: '#A1A1A6',
  accent: '#7EDAD6',
  onAccent: '#101214',
  danger: '#F97066',
  onDanger: '#101214',
  success: '#5BE0A0',
  border: '#3A3A3C',
};

export function isSemanticColorKey(value: string): value is SemanticColorKey {
  return (semanticColorKeys as readonly string[]).includes(value);
}
