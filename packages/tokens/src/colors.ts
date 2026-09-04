export const semanticColorKeys = [
  'background',
  'surface',
  'text',
  'muted',
  'accent',
  'danger',
  'success',
  'border',
] as const;

export type SemanticColorKey = (typeof semanticColorKeys)[number];

export type ColorTokens = Record<SemanticColorKey, string>;

export const lightColors: ColorTokens = {
  background: '#F4F6F8',
  surface: '#FFFFFF',
  text: '#121417',
  muted: '#3F4A55',
  accent: '#0B615E',
  danger: '#B42318',
  success: '#087443',
  border: '#D6DCE3',
};

export const darkColors: ColorTokens = {
  background: '#101214',
  surface: '#1A1E22',
  text: '#F5F7F8',
  muted: '#C5CDD4',
  accent: '#7EDAD6',
  danger: '#F97066',
  success: '#5BE0A0',
  border: '#2C333A',
};

export function isSemanticColorKey(value: string): value is SemanticColorKey {
  return (semanticColorKeys as readonly string[]).includes(value);
}
