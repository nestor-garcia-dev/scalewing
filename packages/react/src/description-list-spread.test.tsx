import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import {
  DescriptionItem,
  DescriptionList,
  descriptionListLayouts,
} from './components/DescriptionList.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => cleanup());

describe('DescriptionList layout', () => {
  it('lists its layouts, columns first as the default', () => {
    expect(descriptionListLayouts).toEqual(['columns', 'spread']);
  });

  it('draws the columns layout with no extra class by default', () => {
    const { container } = render(
      <DescriptionList className="extra">
        <DescriptionItem term="Wetland">12 herons</DescriptionItem>
      </DescriptionList>,
    );
    expect(container.querySelector('dl')?.className).toBe(
      'sw-description-list extra',
    );
  });

  it('marks a spread list and keeps the dt and dd in each row', () => {
    const { container } = render(
      <DescriptionList className="extra" layout="spread">
        <DescriptionItem term="Habitat">Wetland</DescriptionItem>
        <DescriptionItem term="Who can see it">Every ranger</DescriptionItem>
      </DescriptionList>,
    );
    const list = container.querySelector('dl');
    expect(list?.className).toBe(
      'sw-description-list sw-description-list-spread extra',
    );
    const rows = Array.from(list?.children ?? [], (row) =>
      Array.from(row.children, (cell) => `${cell.tagName} ${cell.textContent}`),
    );
    expect(rows).toEqual([
      ['DT Habitat', 'DD Wetland'],
      ['DT Who can see it', 'DD Every ranger'],
    ]);
  });

  it('refuses a layout it cannot draw', () => {
    expect(() =>
      render(
        <DescriptionList layout={'right' as never}>
          <DescriptionItem term="Habitat">Wetland</DescriptionItem>
        </DescriptionList>,
      ),
    ).toThrow(new RangeError('Unknown DescriptionList layout: right'));
  });

  it('generates the spread rows after the narrow-screen rule and catalogs the class', () => {
    const css = generateStylesheet();
    const spread =
      '.sw-description-list-spread > .sw-description-item {\n  column-gap: var(--sw-space-4);\n  grid-template-columns: fit-content(50%) minmax(0, 1fr);\n}';
    expect(css).toContain(
      '.sw-description-list-spread { grid-template-columns: minmax(0, 1fr); }',
    );
    expect(css).toContain(spread);
    expect(css).toContain(
      '.sw-description-list-spread .sw-description-detail {\n  align-items: flex-end;\n  text-align: end;\n}',
    );
    // After the narrow-screen columns, so a phone keeps the rows spread.
    expect(css.indexOf(spread)).toBeGreaterThan(
      css.indexOf(
        '.sw-description-list { grid-template-columns: minmax(0, 1fr); }',
      ),
    );
    expect(utilityClassCatalog()).toContain('sw-description-list-spread');
  });
});
