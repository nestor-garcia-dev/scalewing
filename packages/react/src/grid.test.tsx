import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Box } from './components/Box.js';
import { Button } from './components/Button.js';
import { Card } from './components/Card.js';
import { Field } from './components/Field.js';
import { Grid, gridFits } from './components/Grid.js';
import { Stack } from './components/Stack.js';
import { columnSpanClassNames } from './column-span-classes.js';
import { cssGridClasses, gridClassCatalog } from './css/css-grid.js';
import { generateStylesheet } from './css/stylesheet.js';
import {
  cssGridSpanClasses,
  gridSpanClassCatalog,
} from './css/css-grid-span.js';

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

  it('aligns children in their row with the shared align classes', () => {
    render(
      <Grid align="end" columns={2} data-testid="grid" gap={3}>
        <Field label="Nest height above the waterline in metres">
          <input name="nest-height" />
        </Field>
        <Field label="Eggs">
          <input name="eggs" />
        </Field>
      </Grid>,
    );
    const grid = screen.getByTestId('grid');
    expect(grid.className).toBe('sw-grid sw-grid-cols-2 sw-gap-3 sw-align-end');
    expect(screen.getByRole('textbox', { name: 'Eggs' })).toBeTruthy();

    for (const align of ['start', 'center', 'stretch'] as const) {
      cleanup();
      render(
        <Grid align={align} data-testid="grid">
          cell
        </Grid>,
      );
      expect(screen.getByTestId('grid').className).toContain(
        `sw-align-${align}`,
      );
    }
    const css = generateStylesheet();
    expect(css).toContain('.sw-align-end { align-items: flex-end; }');
    expect(css).toContain('.sw-align-start { align-items: flex-start; }');
  });

  it('offers six columns for a denomination row', () => {
    render(
      <Grid columns={6} columnsBelow={{ md: 2 }} data-testid="grid">
        cell
      </Grid>,
    );
    expect(screen.getByTestId('grid').className).toBe(
      'sw-grid sw-grid-cols-6 sw-grid-cols-below-md-2 sw-gap-0',
    );
  });

  it('fits columns to its width at a named minimum', () => {
    render(
      <Grid data-testid="grid" fit="medium" gap={4}>
        cell
      </Grid>,
    );
    expect(screen.getByTestId('grid').className).toBe(
      'sw-grid sw-grid-fit-medium sw-gap-4',
    );
    const css = cssGridClasses();
    expect(css).toContain(
      '.sw-grid-fit-narrow { grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr)); }',
    );
    expect(css).toContain(
      '.sw-grid-fit-medium { grid-template-columns: repeat(auto-fit, minmax(min(100%, 16.25rem), 1fr)); }',
    );
    expect(css).toContain(
      '.sw-grid-fit-wide { grid-template-columns: repeat(auto-fit, minmax(min(100%, 18.75rem), 1fr)); }',
    );
    expect(gridFits).toEqual(['narrow', 'medium', 'wide']);
  });

  it('gives each child of a fitted grid one column, whatever its span', () => {
    const css = cssGridSpanClasses();
    expect(css).toContain(
      ':where(.sw-grid-fit-wide) > .sw-grid-span-3 { grid-column: auto; }',
    );
    expect(
      css.indexOf(':where(.sw-grid-fit-narrow) > .sw-grid-span-2'),
    ).toBeGreaterThan(css.indexOf('.sw-grid-span-6 { grid-column: span 6; }'));
  });

  it('rejects an unknown fit, and a fit with fixed columns', () => {
    expect(() => render(<Grid fit={'tiny' as never}>cell</Grid>)).toThrow(
      'Unknown Grid fit: tiny',
    );
    expect(() =>
      render(
        <Grid columns={2} fit="wide">
          cell
        </Grid>,
      ),
    ).toThrow(RangeError);
    expect(() =>
      render(
        <Grid columnsBelow={{ md: 1 }} fit="wide">
          cell
        </Grid>,
      ),
    ).toThrow(RangeError);
  });

  it('rejects column counts outside the bounded catalog', () => {
    expect(() => render(<Grid columns={5 as never}>cell</Grid>)).toThrow(
      RangeError,
    );
    expect(() => render(<Grid columns={7 as never}>cell</Grid>)).toThrow(
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
      'sw-grid-cols-6',
      'sw-grid-cols-below-md-1',
      'sw-grid-cols-below-md-2',
      'sw-grid-cols-below-md-3',
      'sw-grid-cols-below-md-4',
      'sw-grid-cols-below-md-6',
      'sw-grid-fit-narrow',
      'sw-grid-fit-medium',
      'sw-grid-fit-wide',
    ]);
  });
});

describe('columnSpan', () => {
  it('maps a span to its generated class and nothing when unset', () => {
    expect(columnSpanClassNames({})).toEqual([]);
    expect(columnSpanClassNames({ columnSpan: 2 })).toEqual(['sw-grid-span-2']);
  });

  it('lays out two to one with any Box-based child and drops the prop from the DOM', () => {
    render(
      <Grid columns={3} columnsBelow={{ md: 1 }} data-testid="grid" gap={4}>
        <Stack columnSpan={2} data-testid="form" gap={4}>
          Sighting form
        </Stack>
        <Card data-testid="panel" variant="outlined">
          Habitat lookup
        </Card>
      </Grid>,
    );
    expect(screen.getByTestId('grid').className).toBe(
      'sw-grid sw-grid-cols-3 sw-grid-cols-below-md-1 sw-gap-4',
    );
    const form = screen.getByTestId('form');
    expect(form.className.split(' ')).toContain('sw-grid-span-2');
    expect(form.hasAttribute('columnspan')).toBe(false);
    expect(screen.getByTestId('panel').className).not.toContain('sw-grid-span');
  });

  it('keeps spacing, visibility, and custom classes beside the span', () => {
    render(
      <Box
        className="custom"
        columnSpan={6}
        data-testid="box"
        hideBelow="md"
        padding={2}
      >
        Census row
      </Box>,
    );
    expect(screen.getByTestId('box').className).toBe(
      'sw-padding-2 sw-hide-below-md sw-grid-span-6 custom',
    );
  });

  it('rejects spans outside the bounded catalog', () => {
    for (const span of [0, 5, 7, 1.5]) {
      expect(() => render(<Box columnSpan={span as never}>cell</Box>)).toThrow(
        new RangeError('columnSpan must be one of 1, 2, 3, 4, 6'),
      );
    }
  });

  it('generates span rules capped at the columns a grid has at each width', () => {
    const css = cssGridSpanClasses();
    expect(css).toContain('.sw-grid-span-2 { grid-column: span 2; }');
    expect(css).toContain(
      ':where(.sw-grid-cols-2) > .sw-grid-span-3 { grid-column: span 2; }',
    );
    expect(css).not.toContain(':where(.sw-grid-cols-3) > .sw-grid-span-2');
    const phone = css.slice(
      css.indexOf('@media not all and (min-width: 48rem) {'),
    );
    expect(phone).toContain(
      '  :where(.sw-grid-cols-below-md-1) > .sw-grid-span-2 { grid-column: span 1; }',
    );
    expect(phone).toContain(
      '  :where(.sw-grid-cols-below-md-4) > .sw-grid-span-4 { grid-column: span 4; }',
    );
    expect(css.indexOf('.sw-grid-span-6 {')).toBeLessThan(
      css.indexOf(':where(.sw-grid-cols-1)'),
    );
    expect(css.indexOf(':where(.sw-grid-cols-4)')).toBeLessThan(
      css.indexOf('@media'),
    );
    expect(gridSpanClassCatalog()).toEqual([
      'sw-grid-span-1',
      'sw-grid-span-2',
      'sw-grid-span-3',
      'sw-grid-span-4',
      'sw-grid-span-6',
    ]);
  });
});
