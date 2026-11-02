import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { FixtureGroup, fixtureGroupSides } from './components/FixtureGroup.js';
import { FixtureRow } from './components/FixtureRow.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => cleanup());

const css = generateStylesheet();
const row = (
  <FixtureRow
    away={{ name: 'Otter Pool' }}
    center="8:00"
    home={{ name: 'Heron Marsh' }}
  />
);

describe('FixtureGroup sides', () => {
  it('keeps the list as it was by default', () => {
    render(<FixtureGroup title="Sunday">{row}</FixtureGroup>);
    expect(screen.getByRole('list').className).toBe('sw-fixture-list');
    expect(css).toContain(
      'grid-template-columns: auto minmax(0, 1fr) auto minmax(0, 1fr) auto auto auto;',
    );
  });

  it('marks a fixed run', () => {
    render(
      <FixtureGroup sides="fixed" title="Sunday">
        {row}
      </FixtureGroup>,
    );
    expect(screen.getByRole('list').className).toBe(
      'sw-fixture-list sw-fixture-list-sides-fixed',
    );
    expect(fixtureGroupSides).toEqual(['fluid', 'fixed']);
    expect(utilityClassCatalog()).toContain('sw-fixture-list-sides-fixed');
  });

  it('fixes the columns from md only, after the rows below md', () => {
    const fixed = css.indexOf(
      '@media (min-width: 48rem) {\n  .sw-fixture-list-sides-fixed {\n    grid-template-columns: auto minmax(0, 16rem) minmax(7rem, auto) minmax(0, 16rem) 1fr auto auto;',
    );
    expect(fixed).toBeGreaterThan(0);
    const narrow = css.indexOf(
      '@media not all and (min-width: 48rem) {\n  .sw-fixture-list {',
    );
    expect(narrow).toBeGreaterThan(0);
    expect(narrow).toBeLessThan(fixed);
  });

  it('gives each row the same fixed columns without subgrid', () => {
    expect(css).toContain(
      '@supports not (grid-template-columns: subgrid) {\n    .sw-fixture-list-sides-fixed .sw-fixture-row {\n      grid-template-columns: minmax(0, 16rem) minmax(7rem, auto) minmax(0, 16rem) 1fr auto;',
    );
  });

  it('throws on unknown sides', () => {
    expect(() =>
      render(
        // @ts-expect-error unknown sides
        <FixtureGroup sides="wide" title="Sunday">
          {row}
        </FixtureGroup>,
      ),
    ).toThrow(RangeError);
  });
});
