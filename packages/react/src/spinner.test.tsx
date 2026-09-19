import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Spinner } from './components/Spinner.js';

afterEach(() => cleanup());

describe('Spinner', () => {
  it('announces one localized loading status and maps size classes', () => {
    const { rerender } = render(
      <Spinner label="Loading sightings" size="sm" />,
    );
    const status = screen.getByRole('status');
    expect(status.textContent).toBe('Loading sightings');
    expect(status.className).toContain('sw-spinner-sm');
    expect(
      status.querySelector('.sw-spinner-icon')?.getAttribute('aria-hidden'),
    ).toBe('true');
    rerender(<Spinner label="Cargando avistamientos" size="lg" />);
    expect(status.textContent).toBe('Cargando avistamientos');
    expect(status.className).toContain('sw-spinner-lg');
  });

  it('hides additional decorative indicators from accessibility', () => {
    render(
      <div>
        <Spinner label="Loading sightings" />
        <Spinner decorative size="sm" />
        <Spinner decorative size="lg" />
      </div>,
    );
    expect(screen.getAllByRole('status')).toHaveLength(1);
    expect(document.querySelectorAll('.sw-spinner')).toHaveLength(3);
    expect(
      document.querySelectorAll('.sw-spinner[aria-hidden="true"]'),
    ).toHaveLength(2);
  });

  it('rejects an empty announced status', () => {
    expect(() => render(<Spinner label="   " />)).toThrow(RangeError);
  });
});
