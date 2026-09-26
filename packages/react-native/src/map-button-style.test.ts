import { createTheme, lightTheme } from '@scalewing/tokens';
import { describe, expect, it } from 'vitest';

import {
  buttonLabelColor,
  mapButtonLabelStyle,
  mapButtonViewStyle,
} from './map-button-style.js';

describe('mapButtonViewStyle', () => {
  it('uses the 44px md control and accent fill for primary', () => {
    const style = mapButtonViewStyle(lightTheme, {
      disabled: false,
      size: 'md',
      variant: 'primary',
    });

    expect(style.minHeight).toBe(44);
    expect(style.backgroundColor).toBe(lightTheme.colors.accent);
    expect(style.borderRadius).toBe(lightTheme.radius.pill);
    expect(style.opacity).toBe(1);
  });

  it('applies disabled opacity from the theme', () => {
    const style = mapButtonViewStyle(lightTheme, {
      disabled: true,
      size: 'sm',
      variant: 'ghost',
    });

    expect(style.minHeight).toBe(32);
    expect(style.opacity).toBe(lightTheme.disabledOpacity);
    expect(style.backgroundColor).toBe('transparent');
  });

  it('maps xs to the 28px compact control', () => {
    const style = mapButtonViewStyle(lightTheme, {
      disabled: false,
      size: 'xs',
      variant: 'secondary',
    });

    expect(style.minHeight).toBe(28);
    // By default a secondary action is an outlined pill on the surface.
    expect(style.backgroundColor).toBe(lightTheme.colors.surface);
    expect(style.borderColor).toBe(lightTheme.colors.border);
  });

  it('fills secondary and tertiary solid in a palette that sets them', () => {
    const signal = createTheme({ colorScheme: 'light', palette: 'signal' });
    const secondary = mapButtonViewStyle(signal, {
      disabled: false,
      size: 'md',
      variant: 'secondary',
    });
    expect(secondary.backgroundColor).toBe(signal.colors.secondary);
    // A solid fill shows no hairline ring.
    expect(secondary.borderColor).toBe(signal.colors.secondary);
    const tertiary = mapButtonViewStyle(signal, {
      disabled: false,
      size: 'md',
      variant: 'tertiary',
    });
    expect(tertiary.backgroundColor).toBe(signal.colors.tertiary);
    expect(tertiary.borderColor).toBe('transparent');
  });
});

describe('mapButtonLabelStyle', () => {
  it('pairs each fill with its own label colour', () => {
    expect(buttonLabelColor('secondary')).toBe('onSecondary');
    expect(buttonLabelColor('tertiary')).toBe('onTertiary');
    const signal = createTheme({ colorScheme: 'dark', palette: 'signal' });
    expect(mapButtonLabelStyle(signal, 'tertiary').color).toBe(
      signal.colors.onTertiary,
    );
  });

  it('uses onAccent for primary labels', () => {
    expect(buttonLabelColor('primary')).toBe('onAccent');
    expect(mapButtonLabelStyle(lightTheme, 'primary').color).toBe(
      lightTheme.colors.onAccent,
    );
  });
});
