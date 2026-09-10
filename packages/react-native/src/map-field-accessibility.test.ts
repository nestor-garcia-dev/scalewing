import { describe, expect, it } from 'vitest';

import { mapFieldAccessibility } from './map-field-accessibility.js';

describe('mapFieldAccessibility', () => {
  it('uses the visible label and exposes disabled state', () => {
    expect(
      mapFieldAccessibility({ disabled: true, label: 'Team name' }),
    ).toEqual({
      accessibilityHint: undefined,
      accessibilityLabel: 'Team name',
      accessibilityState: { disabled: true },
    });
  });

  it('announces an error ahead of supporting hints', () => {
    expect(
      mapFieldAccessibility({
        accessibilityHint: 'Original hint',
        disabled: false,
        error: 'Team name is required.',
        hint: 'Publicly visible.',
        label: 'Team name',
      }),
    ).toMatchObject({
      accessibilityHint: 'Team name is required.',
    });
  });
});
