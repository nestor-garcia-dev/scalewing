import { type ColorTokens } from './colors.js';
import { type ColorScheme } from './theme.js';

export const paletteFamilies = ['quiet', 'lighter', 'fun', 'retro'] as const;

export type PaletteFamily = (typeof paletteFamilies)[number];

export const paletteIds = [
  'indigo',
  'cerulean',
  'navy',
  'sky',
  'ink',
  'cornflower',
  'soft-blue',
  'capri',
  'raspberry',
  'tangerine',
  'amber',
  'fuchsia',
  'sunburst',
  'harvest',
  'postcard',
  'mocha',
  'synthwave',
] as const;

export type PaletteId = (typeof paletteIds)[number];

export const defaultPaletteId: PaletteId = 'indigo';

export type PaletteDefinition = {
  id: PaletteId;
  name: string;
  family: PaletteFamily;
  summary: string;
  light: Partial<ColorTokens>;
  dark: Partial<ColorTokens>;
};

const onLight = '#FFFFFF';
const onDark = '#101214';

function accentPair(
  lightAccent: string,
  darkAccent: string,
): Pick<PaletteDefinition, 'light' | 'dark'> {
  return {
    light: { accent: lightAccent, onAccent: onLight },
    dark: { accent: darkAccent, onAccent: onDark },
  };
}

export const palettes: readonly PaletteDefinition[] = [
  {
    id: 'indigo',
    name: 'Electric indigo',
    family: 'quiet',
    summary: 'Default. High-chroma violet for links and primary actions.',
    light: {},
    dark: {},
  },
  {
    id: 'cerulean',
    name: 'Cerulean',
    family: 'quiet',
    summary: 'Apple-family blue with more contrast headroom than system blue.',
    ...accentPair('#0066CC', '#5AC8FA'),
  },
  {
    id: 'navy',
    name: 'Ink navy',
    family: 'quiet',
    summary: 'Dark pills and near-charcoal links for a research surface.',
    ...accentPair('#0A2540', '#7EB8FF'),
  },
  {
    id: 'sky',
    name: 'Sky',
    family: 'quiet',
    summary: 'Blue-cyan, distinct from success without going violet.',
    ...accentPair('#0369A1', '#38BDF8'),
  },
  {
    id: 'ink',
    name: 'Ink',
    family: 'quiet',
    summary: 'Accent matches text. Buttons like black and white CTAs.',
    ...accentPair('#1D1D1F', '#F5F5F7'),
  },
  {
    id: 'cornflower',
    name: 'Cornflower',
    family: 'lighter',
    summary: 'Airier blue. Passes 4.5:1 with no headroom.',
    ...accentPair('#4F6BED', '#93A4FF'),
  },
  {
    id: 'soft-blue',
    name: 'Soft blue',
    family: 'lighter',
    summary: 'Washed denim. Lower chroma than Cerulean.',
    ...accentPair('#3B6FD4', '#8BB8FF'),
  },
  {
    id: 'capri',
    name: 'Capri',
    family: 'lighter',
    summary: 'Mediterranean blue. Dark pair goes aqua, not teal-green.',
    ...accentPair('#0077B6', '#48CAE4'),
  },
  {
    id: 'raspberry',
    name: 'Raspberry',
    family: 'fun',
    summary: 'Hot pink. Warm, so ADP negatives sit nearby.',
    ...accentPair('#DB2777', '#F472B6'),
  },
  {
    id: 'tangerine',
    name: 'Tangerine',
    family: 'fun',
    summary: 'Sports-board orange. Close to danger; not a quiet default.',
    ...accentPair('#C2410C', '#FB923C'),
  },
  {
    id: 'amber',
    name: 'Amber',
    family: 'fun',
    summary: 'Gold highlight. Passes contrast. Warmer than Cerulean.',
    ...accentPair('#B45309', '#FCD34D'),
  },
  {
    id: 'fuchsia',
    name: 'Fuchsia',
    family: 'fun',
    summary: 'Magenta rather than violet-blue. Far from success and danger.',
    ...accentPair('#C026D3', '#E879F9'),
  },
  {
    id: 'sunburst',
    name: 'Sunburst',
    family: 'retro',
    summary: '70s teal and rust on cream. Overlay background, not just accent.',
    light: {
      background: '#F6DCAC',
      surface: '#FBF0D8',
      text: '#1D1D1F',
      muted: '#5C5346',
      border: '#E5C48A',
      accent: '#A33B20',
      onAccent: onLight,
    },
    dark: {
      background: '#012D4E',
      surface: '#0A3D5C',
      text: '#F6DCAC',
      muted: '#C4A882',
      border: '#1A5A70',
      accent: '#FAA968',
      onAccent: onDark,
    },
  },
  {
    id: 'harvest',
    name: 'Harvest',
    family: 'retro',
    summary:
      'Olive and mustard on bone. Olive is the accent so mustard stays a chip.',
    light: {
      background: '#E3DCC8',
      surface: '#EBE6D6',
      text: '#1D1D1F',
      muted: '#5C5346',
      border: '#C9C2AE',
      accent: '#3E3E24',
      onAccent: onLight,
    },
    dark: {
      background: '#263E24',
      surface: '#2F4A2C',
      text: '#E3DCC8',
      muted: '#B8B090',
      border: '#3D5238',
      accent: '#CEA453',
      onAccent: onDark,
    },
  },
  {
    id: 'postcard',
    name: 'Postcard',
    family: 'retro',
    summary:
      'Navy and brick on sage-cream. Poster coral stays off the accent token.',
    light: {
      background: '#E4E4CC',
      surface: '#EEEEDD',
      text: '#1B2130',
      muted: '#5C5346',
      border: '#D0D0B8',
      accent: '#A33B2B',
      onAccent: onLight,
    },
    dark: {
      background: '#1B2130',
      surface: '#252B40',
      text: '#E4E4CC',
      muted: '#B8B49A',
      border: '#3A4158',
      accent: '#EEAF90',
      onAccent: onDark,
    },
  },
  {
    id: 'mocha',
    name: 'Mocha',
    family: 'retro',
    summary:
      'Chocolate on sand. Seafoam is a companion, not success-adjacent accent.',
    light: {
      background: '#F3E3C3',
      surface: '#F8EEE0',
      text: '#473333',
      muted: '#6B5348',
      border: '#E0CBA8',
      accent: '#473333',
      onAccent: onLight,
    },
    dark: {
      background: '#473333',
      surface: '#5A4242',
      text: '#F3E3C3',
      muted: '#D4C4A8',
      border: '#6B5353',
      accent: '#E8C69F',
      onAccent: onDark,
    },
  },
  {
    id: 'synthwave',
    name: 'Synthwave',
    family: 'retro',
    summary: 'Neon pink on purple-black. Light mode keeps a white canvas.',
    light: { accent: '#D81B60', onAccent: onLight },
    dark: {
      background: '#1A0533',
      surface: '#241043',
      text: '#F5F5F7',
      muted: '#C9B8E8',
      border: '#4A2C6A',
      accent: '#FF2A6D',
      onAccent: onDark,
    },
  },
];

const paletteByIdMap = new Map(
  palettes.map((palette) => [palette.id, palette] as const),
);

export function isPaletteId(value: string): value is PaletteId {
  return paletteByIdMap.has(value as PaletteId);
}

export function paletteById(id: PaletteId): PaletteDefinition {
  const palette = paletteByIdMap.get(id);

  if (!palette) {
    throw new Error(`Unknown palette: ${id}`);
  }

  return palette;
}

export function colorsForPalette(
  id: PaletteId,
  scheme: ColorScheme,
): Partial<ColorTokens> {
  const palette = paletteById(id);
  return scheme === 'dark' ? palette.dark : palette.light;
}

export function paletteHasStylesheet(id: PaletteId): boolean {
  const palette = paletteById(id);
  return (
    Object.keys(palette.light).length > 0 ||
    Object.keys(palette.dark).length > 0
  );
}

export function palettesWithStylesheets(): PaletteDefinition[] {
  return palettes.filter((palette) => paletteHasStylesheet(palette.id));
}

export const familyLabel: Record<PaletteFamily, string> = {
  quiet: 'Quiet',
  lighter: 'Lighter',
  fun: 'Fun',
  retro: 'Retro',
};
