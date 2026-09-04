import { lightTheme } from '@scalewing/tokens';
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
});

describe('mapButtonLabelStyle', () => {
  it('uses onAccent for primary labels', () => {
    expect(buttonLabelColor('primary')).toBe('onAccent');
    expect(mapButtonLabelStyle(lightTheme, 'primary').color).toBe(
      lightTheme.colors.onAccent,
    );
  });
});
