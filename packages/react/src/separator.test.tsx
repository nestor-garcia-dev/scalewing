import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Separator } from './components/Separator.js';

afterEach(() => cleanup());

describe('Separator', () => {
  it('renders a semantic horizontal separator by default', () => {
    render(<Separator />);
    const separator = screen.getByRole('separator');
    expect(separator.getAttribute('aria-orientation')).toBe('horizontal');
    expect(separator.className).toContain('sw-separator-horizontal');
  });

  it('announces vertical orientation', () => {
    render(<Separator orientation="vertical" />);
    const separator = screen.getByRole('separator');
    expect(separator.getAttribute('aria-orientation')).toBe('vertical');
    expect(separator.className).toContain('sw-separator-vertical');
  });

  it('hides a decorative divider from the accessibility tree', () => {
    const { container } = render(<Separator decorative />);
    expect(screen.queryByRole('separator')).toBeNull();
    const divider = container.querySelector('.sw-separator');
    expect(divider?.getAttribute('aria-hidden')).toBe('true');
    expect(divider?.getAttribute('role')).toBe('none');
    expect(divider?.getAttribute('aria-orientation')).toBeNull();
  });
});
