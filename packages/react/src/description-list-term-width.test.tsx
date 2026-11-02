import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import {
  DescriptionItem,
  DescriptionList,
  descriptionListTermWidths,
} from './components/DescriptionList.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => cleanup());

const css = generateStylesheet();
const item = <DescriptionItem term="Habitat">Wetland</DescriptionItem>;

describe('DescriptionList termWidth', () => {
  it('adds nothing by default', () => {
    const { container } = render(<DescriptionList>{item}</DescriptionList>);
    expect(container.querySelector('dl')?.className).toBe(
      'sw-description-list',
    );
    expect(css).toContain(
      'grid-template-columns: fit-content(40%) minmax(0, 1fr);',
    );
  });

  it('maps each named width to its class', () => {
    expect(descriptionListTermWidths).toEqual(['sm', 'md', 'lg']);
    for (const width of descriptionListTermWidths) {
      const { container, unmount } = render(
        <DescriptionList termWidth={width}>{item}</DescriptionList>,
      );
      expect(container.querySelector('dl')?.className).toBe(
        `sw-description-list sw-description-list-term-${width}`,
      );
      expect(utilityClassCatalog()).toContain(
        `sw-description-list-term-${width}`,
      );
      unmount();
    }
  });

  it('fixes the column from md only, never over half the list', () => {
    expect(css).toContain(
      '@media (min-width: 48rem) {\n  .sw-description-list-term-sm { grid-template-columns: min(8rem, 50%) minmax(0, 1fr); }\n  .sw-description-list-term-md { grid-template-columns: min(12rem, 50%) minmax(0, 1fr); }\n  .sw-description-list-term-lg { grid-template-columns: min(16rem, 50%) minmax(0, 1fr); }\n}',
    );
  });

  it('fails closed on an unknown width or with the spread layout', () => {
    expect(() =>
      render(
        // @ts-expect-error an unknown width
        <DescriptionList termWidth="12rem">{item}</DescriptionList>,
      ),
    ).toThrow(RangeError);
    expect(() =>
      render(
        <DescriptionList layout="spread" termWidth="md">
          {item}
        </DescriptionList>,
      ),
    ).toThrow(RangeError);
  });
});
