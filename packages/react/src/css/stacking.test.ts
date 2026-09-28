import { describe, expect, it } from 'vitest';

import { stackingOrder } from './stacking.js';
import { generateStylesheet } from './stylesheet.js';

const css = generateStylesheet();

function zIndexOf(selector: string): number {
  const start = css.indexOf(`${selector} {`);
  expect(start).toBeGreaterThanOrEqual(0);
  const block = css.slice(start, css.indexOf('}', start));
  const match = /z-index: (\d+);/.exec(block);
  expect(match).not.toBeNull();
  return Number(match?.[1]);
}

describe('stacking order', () => {
  it('generates every z-index from one layer table', () => {
    const layers = new Set<number>(Object.values(stackingOrder));
    const used = [...css.matchAll(/z-index: (\d+);/g)].map((match) =>
      Number(match[1]),
    );
    expect(used.length).toBeGreaterThan(0);
    for (const value of used) expect(layers).toContain(value);
  });

  it('keeps a surface holding an open popup over the ActionBar and under the AppHeader', () => {
    const actionBar = zIndexOf('.sw-action-bar-sticky');
    const popupHost = zIndexOf(
      '.sw-accordion:has(.sw-select-list, .sw-action-menu-list, .sw-tooltip:not([hidden]), .sw-date-field-calendar)',
    );
    const appHeader = zIndexOf('.sw-app-header-sticky');
    const stickyCell = zIndexOf('.sw-table-sticky thead th');
    expect(stickyCell).toBeLessThan(actionBar);
    expect(actionBar).toBeLessThan(popupHost);
    expect(popupHost).toBeLessThan(appHeader);
    for (const popup of [
      '.sw-select-list',
      '.sw-action-menu-list',
      '.sw-tooltip',
      '.sw-date-field-calendar',
    ])
      expect(zIndexOf(popup)).toBeGreaterThan(appHeader);
  });

  it('lifts the ActionBar only as far as bottom chrome at every breakpoint', () => {
    const sticky = [
      ...css.matchAll(/\.sw-action-bar-sticky[\w-]* \{[^}]*z-index: (\d+);/g),
    ].map((match) => Number(match[1]));
    expect(sticky).toEqual([
      stackingOrder.bottomChrome,
      stackingOrder.bottomChrome,
    ]);
  });
});
