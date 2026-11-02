import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { type TabItem, Tabs } from './components/Tabs.js';
import { utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => cleanup());

function renderTabs(items: readonly TabItem[]) {
  return render(
    <Tabs
      aria-label="Schedule"
      id="schedule"
      items={items}
      onChange={() => undefined}
      value={items[0]!.id}
    />,
  );
}

describe('Tabs count', () => {
  it('leaves a tab without a count as it was', () => {
    renderTabs([{ id: 'weeks', label: 'Weeks' }]);
    expect(screen.getByRole('tab', { name: 'Weeks' }).className).toBe(
      'sw-tab sw-tab-selected',
    );
  });

  it('draws the pill after the words, read in the name', () => {
    renderTabs([{ count: 4, id: 'held', label: 'Postponed' }]);
    const tab = screen.getByRole('tab', { name: 'Postponed 4' });
    expect(tab.className).toContain('sw-tab-counted');
    expect(tab.querySelector('.sw-nav-count')?.textContent).toBe('4');
  });

  it('reads the count label in place of the number, in the amber tone', () => {
    renderTabs([
      {
        count: 4,
        countLabel: '4 need a time',
        countTone: 'warning',
        id: 'held',
        label: 'Postponed',
      },
    ]);
    const tab = screen.getByRole('tab', { name: 'Postponed 4 need a time' });
    const pill = tab.querySelector('.sw-nav-count')!;
    expect(pill.className).toContain('sw-nav-count-warning');
    expect(pill.getAttribute('aria-hidden')).toBe('true');
  });

  it('shows no pill for zero', () => {
    const { container } = renderTabs([
      { count: 0, id: 'held', label: 'Postponed' },
    ]);
    expect(container.querySelector('.sw-nav-count')).toBeNull();
    expect(container.querySelector('.sw-tab-counted')).toBeNull();
  });

  it('fails closed on a count that is no whole number, or words with no count', () => {
    expect(() =>
      renderTabs([{ count: 1.5, id: 'held', label: 'Postponed' }]),
    ).toThrow(RangeError);
    expect(() =>
      renderTabs([{ countLabel: '4 late', id: 'held', label: 'Postponed' }]),
    ).toThrow(RangeError);
    expect(() =>
      renderTabs([{ countTone: 'warning', id: 'held', label: 'Postponed' }]),
    ).toThrow(RangeError);
  });

  it('is in the class catalog', () => {
    expect(utilityClassCatalog()).toContain('sw-tab-counted');
  });
});
