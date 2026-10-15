import { contrastRatio } from '@scalewing/tokens';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  Switch,
  switchCheckedTones,
  switchLayouts,
} from './components/Switch.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';
import { forEveryTheme } from './every-theme.test-support.js';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('Switch layout and checkedTone', () => {
  it('puts the control after its label and description when trailing', () => {
    const onCheckedChange = vi.fn();
    render(
      <Switch
        checked={false}
        checkedTone="success"
        description="Names stay out of the file"
        label="Number the observers"
        layout="trailing"
        onCheckedChange={onCheckedChange}
      />,
    );
    const control = screen.getByRole('switch', {
      name: 'Number the observers',
    });
    const row = control.closest('label')!;
    expect(row.className).toBe(
      'sw-switch sw-switch-trailing sw-switch-success',
    );
    // Reading order matches the drawing: words first, then the control.
    expect(row.firstElementChild?.className).toBe('sw-switch-copy');
    expect(row.lastElementChild?.className).toBe('sw-switch-control');
    expect(
      document.getElementById(control.getAttribute('aria-describedby')!)
        ?.textContent,
    ).toBe('Names stay out of the file');
    fireEvent.click(control);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(switchLayouts).toEqual(['leading', 'trailing']);
    expect(switchCheckedTones).toEqual(['accent', 'success']);
  });

  it('keeps the leading accent switch by default', () => {
    render(<Switch checked label="Active only" onCheckedChange={vi.fn()} />);
    const row = screen.getByRole('switch').closest('label')!;
    expect(row.className).toBe('sw-switch');
    expect(row.firstElementChild?.className).toBe('sw-switch-control');
  });

  it('refuses an unknown layout or tone', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const base = { checked: false, label: 'On', onCheckedChange: vi.fn() };
    expect(() => render(<Switch {...base} layout={'end' as never} />)).toThrow(
      'Unknown Switch layout: end',
    );
    expect(() =>
      render(<Switch {...base} checkedTone={'green' as never} />),
    ).toThrow('Unknown Switch checkedTone: green');
  });

  it('generates the trailing row and the success track, Highlight in forced colours', () => {
    const css = generateStylesheet();
    expect(css).toContain(
      '.sw-switch-trailing {\n  align-items: flex-start;\n  display: flex;',
    );
    expect(css).toContain(
      '.sw-switch-success .sw-switch-input:checked + .sw-switch-track {\n  background: var(--sw-color-success);',
    );
    expect(css).toContain(
      '.sw-switch-success .sw-switch-input:checked + .sw-switch-track { background: Highlight; border-color: Highlight; }',
    );
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining(['sw-switch-trailing', 'sw-switch-success']),
    );
  });

  it('keeps the success track at 3:1 on the surface and the page, and apart from its thumb', () => {
    forEveryTheme((colors, label) => {
      // The thumb is drawn in the surface colour, so the surface ratio is
      // also the thumb against the track.
      expect(
        contrastRatio(colors.success, colors.surface),
        `${label} track on surface`,
      ).toBeGreaterThanOrEqual(3);
      expect(
        contrastRatio(colors.success, colors.background),
        `${label} track on background`,
      ).toBeGreaterThanOrEqual(3);
    });
  });
});
