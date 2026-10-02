import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Table, TableBody, TableCell, TableRow } from './components/Table.js';
import {
  pinnedStartShadeRules,
  scrollRegionRules,
} from './css/css-scroll-region.js';
import { scrollOverflow } from './scroll-overflow.js';

afterEach(() => cleanup());

describe('scrollOverflow', () => {
  it('reports no overflow when the content fits, within a pixel', () => {
    expect(scrollOverflow(0, 300, 300)).toEqual({ start: false, end: false });
    expect(scrollOverflow(0, 300.6, 300)).toEqual({ start: false, end: false });
  });

  it('reports the end at the start, both in the middle, and the start at the end', () => {
    expect(scrollOverflow(0, 800, 390)).toEqual({ start: false, end: true });
    expect(scrollOverflow(200, 800, 390)).toEqual({ start: true, end: true });
    expect(scrollOverflow(410, 800, 390)).toEqual({ start: true, end: false });
    // A fraction short of the end counts as the end.
    expect(scrollOverflow(409.5, 800, 390)).toEqual({
      start: true,
      end: false,
    });
  });

  it('reads a right-to-left box, whose scroll position runs negative', () => {
    expect(scrollOverflow(-200, 800, 390)).toEqual({ start: true, end: true });
    expect(scrollOverflow(-410, 800, 390)).toEqual({
      start: true,
      end: false,
    });
  });
});

function setMetrics(
  box: HTMLElement,
  metrics: { scrollLeft: number; scrollWidth: number; clientWidth: number },
) {
  for (const [key, value] of Object.entries(metrics))
    Object.defineProperty(box, key, { configurable: true, value });
}

describe('Table scroll cue', () => {
  function renderTable() {
    render(
      <Table aria-label="Sightings">
        <TableBody>
          <TableRow>
            <TableCell>Heron</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    return screen.getByRole('group', { name: 'Sightings' });
  }

  it('adds no cue to a table that fits', () => {
    const region = renderTable();
    expect(region.className).toBe('sw-table-wrap');
  });

  it('marks each edge with content past it as the table scrolls', () => {
    const region = renderTable();
    setMetrics(region, { scrollLeft: 0, scrollWidth: 800, clientWidth: 390 });
    fireEvent.scroll(region);
    expect(region.className).toBe('sw-table-wrap sw-scroll-more-end');

    setMetrics(region, { scrollLeft: 200, scrollWidth: 800, clientWidth: 390 });
    fireEvent.scroll(region);
    expect(region.className).toBe(
      'sw-table-wrap sw-scroll-more-start sw-scroll-more-end',
    );

    setMetrics(region, { scrollLeft: 410, scrollWidth: 800, clientWidth: 390 });
    fireEvent.scroll(region);
    expect(region.className).toBe('sw-table-wrap sw-scroll-more-start');
  });

  it('measures again when the region is resized', () => {
    const observers: ResizeObserverCallback[] = [];
    const observed: Element[] = [];
    const original = globalThis.ResizeObserver;
    globalThis.ResizeObserver = class {
      constructor(callback: ResizeObserverCallback) {
        observers.push(callback);
      }
      observe(target: Element) {
        observed.push(target);
      }
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;
    try {
      const region = renderTable();
      expect(observers).toHaveLength(1);
      // The region and its table: a row added or a cell widened resizes it.
      expect(observed).toEqual([
        region,
        screen.getByRole('table', { name: 'Sightings' }),
      ]);
      setMetrics(region, { scrollLeft: 0, scrollWidth: 800, clientWidth: 390 });
      act(() => {
        observers[0]!([], {} as ResizeObserver);
      });
      expect(region.className).toBe('sw-table-wrap sw-scroll-more-end');
    } finally {
      globalThis.ResizeObserver = original;
    }
  });
});

describe('scrollRegionRules', () => {
  const css = scrollRegionRules('.sw-table-wrap');
  const startShade =
    'inset var(--sw-space-6) 0 var(--sw-space-5) calc(-1 * var(--sw-space-5)) color-mix(in srgb, var(--sw-color-text) 28%, transparent)';
  const endShade =
    'inset calc(-1 * var(--sw-space-6)) 0 var(--sw-space-5) calc(-1 * var(--sw-space-5)) color-mix(in srgb, var(--sw-color-text) 28%, transparent)';

  it('shades the edge with more content, mirrored right to left, both last', () => {
    expect(css).toContain(
      `.sw-table-wrap.sw-scroll-more-start { box-shadow: ${startShade}; }`,
    );
    expect(css).toContain(
      `.sw-table-wrap.sw-scroll-more-end { box-shadow: ${endShade}; }`,
    );
    expect(css).toContain(
      `.sw-table-wrap.sw-scroll-more-start:dir(rtl) { box-shadow: ${endShade}; }`,
    );
    expect(css.trimEnd().split('\n').at(-1)).toBe(
      `.sw-table-wrap.sw-scroll-more-start.sw-scroll-more-end { box-shadow: ${startShade}, ${endShade}; }`,
    );
  });
});

describe('pinnedStartShadeRules', () => {
  const css = pinnedStartShadeRules('.sw-denomination-scroll', [
    '.sw-denomination-strip .sw-denomination-label',
  ]);

  it('casts the start shade from the pinned column, mirrored, and not in forced colors', () => {
    expect(css)
      .toContain(`.sw-denomination-scroll.sw-scroll-more-start .sw-denomination-strip .sw-denomination-label::after {
  background: linear-gradient(to right, color-mix(in srgb, var(--sw-color-text) 28%, transparent), transparent);
  content: '';
  inset-block: 0;
  inset-inline-start: 100%;`);
    expect(css)
      .toContain(`.sw-denomination-scroll.sw-scroll-more-start:dir(rtl) .sw-denomination-strip .sw-denomination-label::after {
  background: linear-gradient(to left,`);
    expect(css).toContain(`@media (forced-colors: active) {
  .sw-denomination-scroll.sw-scroll-more-start .sw-denomination-strip .sw-denomination-label::after { display: none; }
}`);
  });
});
