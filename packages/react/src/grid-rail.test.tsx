import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Grid, gridRails } from './components/Grid.js';
import { generateStylesheet } from './css/stylesheet.js';

afterEach(() => cleanup());

const css = generateStylesheet();

function gridClasses(element: React.ReactElement): string[] {
  const { container } = render(element);
  return (container.firstElementChild as HTMLElement).className.split(' ');
}

describe('Grid rail', () => {
  it('takes the rail class and no columns class', () => {
    const classes = gridClasses(<Grid gap={4} rail="lg" />);
    expect(classes).toContain('sw-grid-rail-lg');
    expect(classes.some((name) => name.startsWith('sw-grid-cols'))).toBe(false);
  });

  it('stacks below the breakpoint and pins a 20rem rail from it', () => {
    expect(gridRails).toEqual(['md', 'lg']);
    expect(css).toContain(
      '.sw-grid-rail-lg { grid-template-columns: minmax(0, 1fr); }\n@media (min-width: 64rem) {\n  .sw-grid-rail-lg { grid-template-columns: minmax(0, 1fr) 20rem; }\n}',
    );
    expect(css).toContain(
      '.sw-grid-rail-md { grid-template-columns: minmax(0, 1fr); }\n@media (min-width: 48rem) {\n  .sw-grid-rail-md { grid-template-columns: minmax(0, 1fr) 20rem; }\n}',
    );
  });

  it('ignores a child column span, as a fitted grid does', () => {
    expect(css).toContain(
      ':where(.sw-grid-rail-lg) > .sw-grid-span-2 { grid-column: auto; }',
    );
  });

  it('leaves columns and fit as they were', () => {
    expect(gridClasses(<Grid columns={3} />)).toContain('sw-grid-cols-3');
    expect(gridClasses(<Grid />)).toContain('sw-grid-cols-1');
    expect(gridClasses(<Grid fit="narrow" />)).toContain('sw-grid-fit-narrow');
  });

  it('fails closed on a second way to set the columns or an unknown rail', () => {
    expect(() => render(<Grid columns={2} rail="lg" />)).toThrow(RangeError);
    expect(() => render(<Grid columnsBelow={{ md: 1 }} rail="lg" />)).toThrow(
      RangeError,
    );
    expect(() => render(<Grid fit="wide" rail="md" />)).toThrow(RangeError);
    expect(() =>
      // @ts-expect-error an unknown rail
      render(<Grid rail="xl" />),
    ).toThrow(RangeError);
  });
});
