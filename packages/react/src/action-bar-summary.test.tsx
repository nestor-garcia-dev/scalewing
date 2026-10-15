import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ActionBar, type ActionBarSummary } from './components/ActionBar.js';
import { Button } from './components/Button.js';
import { cssActionBarSummaryClasses } from './css/css-action-bar-summary.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => cleanup());

function bar(summary?: ActionBarSummary, status?: string) {
  return (
    <ActionBar status={status} summary={summary}>
      <Button onPress={() => undefined} variant="secondary">
        Cancel
      </Button>
      <Button disabled onPress={() => undefined}>
        Save count
      </Button>
    </ActionBar>
  );
}

describe('ActionBar summary', () => {
  it('puts a labelled figure first in the polite status region', () => {
    const { rerender } = render(bar());
    const status = screen.getByRole('status');
    rerender(
      bar(
        { label: 'Counted', value: '1,240', detail: 'short 60' },
        'Draft saved',
      ),
    );
    // The same live region takes the figure, so it is announced.
    expect(screen.getByRole('status')).toBe(status);
    expect(status.textContent).toBe('Counted 1,240 short 60Draft saved');
    const summary = status.firstElementChild!;
    expect(summary.className).toBe('sw-action-bar-summary');
    const value = summary.querySelector('.sw-action-bar-summary-value')!;
    expect(value.textContent).toBe('1,240');
    expect(value.className).toBe(
      'sw-action-bar-summary-value sw-text-heading sw-tabular',
    );
    expect(
      summary.querySelector('.sw-action-bar-summary-label')!.textContent,
    ).toBe('Counted');
    // The actions keep the existing API: a secondary and one disabled primary.
    expect(screen.getByRole('button', { name: 'Save count' })).toHaveProperty(
      'disabled',
      true,
    );
  });

  it('tones the value and leaves out a missing detail', () => {
    const { rerender } = render(
      bar({ label: 'Counted', value: '1,240', tone: 'danger' }),
    );
    const summary = () =>
      screen.getByRole('status').querySelector('.sw-action-bar-summary')!;
    expect(summary().className).toBe(
      'sw-action-bar-summary sw-action-bar-summary-danger',
    );
    expect(summary().querySelector('.sw-action-bar-summary-detail')).toBeNull();
    rerender(bar({ label: 'Counted', value: '1,300', tone: 'success' }));
    expect(summary().className).toContain('sw-action-bar-summary-success');
    rerender(bar({ label: 'Counted', value: '1,300', tone: 'default' }));
    expect(summary().className).toBe('sw-action-bar-summary');
  });

  it('refuses blank words and an unknown tone', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    for (const bad of [
      { label: ' ', value: '1' },
      { label: 'Counted', value: '1', detail: ' ' },
      { label: 'Counted', value: '1', tone: 'warning' as 'danger' },
      { label: 'Counted', value: 1240 as unknown as string },
    ])
      expect(() => render(bar(bad))).toThrow(RangeError);
    vi.restoreAllMocks();
  });

  it('is generated from tokens and listed in the catalog', () => {
    const css = cssActionBarSummaryClasses();
    expect(generateStylesheet()).toContain(css);
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-action-bar-summary',
        'sw-action-bar-summary-label',
        'sw-action-bar-summary-value',
        'sw-action-bar-summary-detail',
        'sw-action-bar-summary-danger',
        'sw-action-bar-summary-success',
      ]),
    );
    expect(css).toContain('color: var(--sw-color-danger);');
    expect(css).toContain('align-items: baseline;');
    expect(css).not.toMatch(/#[0-9a-f]{3,6}\b/i);
  });
});
