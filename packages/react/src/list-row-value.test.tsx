import { contrastRatio } from '@scalewing/tokens';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ListGroup } from './components/ListGroup.js';
import { ListRow } from './components/ListRow.js';
import { semanticInkShare } from './css/chart-tones.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';
import { forEveryTheme, tintOver } from './every-theme.test-support.js';
import { listRowValueTones } from './list-options.js';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('ListRow value tone warning and value badge', () => {
  it('colours a warning value in the warning ink', () => {
    render(
      <ListGroup aria-label="Nests">
        <ListRow title="North colony" value="2 days" valueTone="warning" />
      </ListGroup>,
    );
    expect(screen.getByText('2 days').className).toBe(
      'sw-list-row-value sw-list-row-value-warning',
    );
    expect(listRowValueTones).toEqual([
      'success',
      'danger',
      'muted',
      'accent',
      'warning',
    ]);
    expect(generateStylesheet()).toContain(
      '.sw-list-row-value-warning { color: color-mix(in srgb, var(--sw-color-warning) 50%, var(--sw-color-text)); }',
    );
    expect(utilityClassCatalog()).toContain('sw-list-row-value-warning');
  });

  it('keeps the warning ink at 4.5:1 on the surface in every palette', () => {
    forEveryTheme((colors, label) => {
      const ink = tintOver(colors.warning, semanticInkShare, colors.text);
      expect(contrastRatio(ink, colors.surface), label).toBeGreaterThanOrEqual(
        4.5,
      );
    });
  });

  it('draws the value as a badge, still naming a pressable row', () => {
    render(
      <ListGroup aria-label="Dens">
        <ListRow
          detail="Two adults, one kit"
          onPress={vi.fn()}
          title="Red fox den"
          value="Watched"
          valueBadge="warning"
        />
      </ListGroup>,
    );
    const row = screen.getByRole('button', { name: 'Red fox den Watched' });
    const badge = row.querySelector('.sw-badge');
    expect(badge?.className).toBe('sw-badge sw-badge-warning sw-badge-md');
    expect(badge?.textContent).toBe('Watched');
  });

  it('refuses a badge with no value, an unknown badge, and a toned badge', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => render(<ListRow title="Den" valueBadge="success" />)).toThrow(
      'ListRow valueDetail, valueTone and valueBadge need a value',
    );
    expect(() =>
      render(<ListRow title="Den" value="Open" valueBadge={'gold' as never} />),
    ).toThrow('Unknown ListRow valueBadge: gold');
    expect(() =>
      render(
        <ListRow
          title="Den"
          value="Open"
          valueBadge="success"
          valueTone="success"
        />,
      ),
    ).toThrow('A ListRow value is a toned figure or a badge, not both');
  });
});
