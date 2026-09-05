import { lightColors, darkColors } from './colors.js';
import { parseHexColor } from './contrast.js';

export type GlassTokens = {
  blur: number;
  border: string;
  fill: string;
  saturate: number;
  specular: string;
};

function mixChannel(from: number, to: number, amount: number): number {
  return Math.round(from + (to - from) * amount);
}

function rgba(red: number, green: number, blue: number, alpha: number): string {
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export function glassForAccent(
  accent: string,
  scheme: 'light' | 'dark',
): GlassTokens {
  if (scheme === 'light') {
    return {
      blur: 24,
      saturate: 1,
      fill: rgba(255, 255, 255, 1),
      border: rgba(210, 210, 215, 1),
      specular: rgba(255, 255, 255, 0),
    };
  }

  const [accentRed, accentGreen, accentBlue] = parseHexColor(accent);

  return {
    blur: 24,
    saturate: 1.8,
    fill: rgba(
      mixChannel(28, accentRed, 0.18),
      mixChannel(28, accentGreen, 0.18),
      mixChannel(30, accentBlue, 0.18),
      0.72,
    ),
    border: rgba(
      mixChannel(255, accentRed, 0.4),
      mixChannel(255, accentGreen, 0.4),
      mixChannel(255, accentBlue, 0.4),
      0.22,
    ),
    specular: rgba(
      mixChannel(255, accentRed, 0.2),
      mixChannel(255, accentGreen, 0.2),
      mixChannel(255, accentBlue, 0.2),
      0.28,
    ),
  };
}

export const lightGlass: GlassTokens = glassForAccent(
  lightColors.accent,
  'light',
);

export const darkGlass: GlassTokens = glassForAccent(darkColors.accent, 'dark');
