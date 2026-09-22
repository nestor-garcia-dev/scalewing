import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Button } from './components/Button.js';
import { Grid } from './components/Grid.js';
import { cssGridClasses, gridClassCatalog } from './css/css-grid.js';

afterEach(() => cleanup());

describe('Grid', () => {
  it('maps columns, phone columns, and gap to generated classes and keeps Box props', () => {
    render(
      <Grid
        aria-label="Quick actions"
        as="section"
        columns={3}
        columnsBelow={{ md: 2 }}
        gap={2}
        padding={4}
      >
        <Button onPress={() => undefined} variant="secondary">
          Log a sighting
        </Button>
        <Button onPress={() => undefined} variant="secondary">
          Open the field guide
        </Button>
        <Button onPress={() => undefined} variant="secondary">
          Plan a survey
        </Button>
      </Grid>,
    );
    const grid = screen.getByRole('region', { name: 'Quick actions' });
    expect(grid.tagName).toBe('SECTION');
    expect(grid.className.split(' ')).toEqual([
      'sw-padding-4',
      'sw-grid',
      'sw-grid-cols-3',
      'sw-grid-cols-below-md-2',
      'sw-gap-2',
    ]);
    expect(grid.children).toHaveLength(3);
  });

  it('defaults to one column with no gap and no phone override', () => {
    render(<Grid data-testid="grid">cell</Grid>);
    expect(screen.getByTestId('grid').className).toBe(
      'sw-grid sw-grid-cols-1 sw-gap-0',
    );
  });

  it('rejects column counts outside the bounded catalog', () => {
    expect(() => render(<Grid columns={5 as never}>cell</Grid>)).toThrow(
      RangeError,
    );
    expect(() =>
      render(<Grid columnsBelow={{ md: 0 as never }}>cell</Grid>),
    ).toThrow(RangeError);
  });

  it('generates equal-width column rules and one phone media block per breakpoint', () => {
    const css = cssGridClasses();
    expect(css).toContain('.sw-grid {');
    expect(css).toContain(
      '.sw-grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }',
    );
    expect(css).toContain('@media not all and (min-width: 48rem) {');
    expect(css).toContain(
      '.sw-grid-cols-below-md-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }',
    );
    expect(gridClassCatalog()).toEqual([
      'sw-grid',
      'sw-grid-cols-1',
      'sw-grid-cols-2',
      'sw-grid-cols-3',
      'sw-grid-cols-4',
      'sw-grid-cols-below-md-1',
      'sw-grid-cols-below-md-2',
      'sw-grid-cols-below-md-3',
      'sw-grid-cols-below-md-4',
    ]);
  });
});
