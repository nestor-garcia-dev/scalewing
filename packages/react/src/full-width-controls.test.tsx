import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Button } from './components/Button.js';
import { ButtonGroup } from './components/ButtonGroup.js';
import {
  SegmentedControl,
  segmentedSizes,
} from './components/SegmentedControl.js';
import { breakpointQuery } from './css/breakpoints.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const items = [
  { id: 'week', label: 'Week 12' },
  { id: 'month', label: 'Month 40' },
  { id: 'year', label: 'Year 300' },
];

describe('SegmentedControl fullWidthBelow and size', () => {
  it('marks the field to fill below md and the track to pad less', () => {
    render(
      <SegmentedControl
        aria-label="Period"
        fullWidthBelow="md"
        items={items}
        onChange={vi.fn()}
        size="sm"
        value="week"
        variant="raised"
      />,
    );
    const group = screen.getByRole('radiogroup', { name: 'Period' });
    expect(group.parentElement?.className).toBe(
      'sw-segmented-field sw-segmented-field-full-below-md',
    );
    expect(group.className).toContain('sw-segmented-sm');
    // The whole label stays the radio's name, in its own truncating box.
    const month = screen.getByRole('radio', { name: 'Month 40' });
    expect(month.querySelector('.sw-segmented-item-label')?.textContent).toBe(
      'Month 40',
    );
    expect(segmentedSizes).toEqual(['md', 'sm']);
  });

  it('is unchanged by default', () => {
    render(
      <SegmentedControl
        aria-label="Period"
        items={items}
        onChange={vi.fn()}
        value="week"
      />,
    );
    const group = screen.getByRole('radiogroup', { name: 'Period' });
    expect(group.parentElement?.className).toBe('sw-segmented-field');
    expect(group.className).not.toContain('sw-segmented-sm');
    expect(group.querySelector('.sw-segmented-item-label')).toBeNull();
  });

  it('refuses an unknown breakpoint or size', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const base = {
      'aria-label': 'Period',
      items,
      onChange: vi.fn(),
      value: 'week',
    };
    expect(() =>
      render(<SegmentedControl {...base} fullWidthBelow={'lg' as never} />),
    ).toThrow('Unknown SegmentedControl fullWidthBelow: lg');
    expect(() =>
      render(<SegmentedControl {...base} size={'xs' as never} />),
    ).toThrow('Unknown SegmentedControl size: xs');
  });

  it('shares the width equally below md and keeps sm labels on one line', () => {
    const css = generateStylesheet();
    expect(css).toContain(
      `@media ${breakpointQuery('below', 'md')} {\n  .sw-segmented-field.sw-segmented-field-full-below-md {`,
    );
    expect(css).toContain(
      '.sw-segmented-field.sw-segmented-field-full-below-md > .sw-segmented {\n    align-self: stretch;\n    display: grid;\n    grid-auto-columns: minmax(0, 1fr);',
    );
    expect(css).toContain(
      '.sw-segmented.sw-segmented-sm .sw-segmented-item {\n  min-width: 0;\n  overflow: hidden;\n  white-space: nowrap;\n}',
    );
    expect(css).toContain(
      '.sw-segmented-sm .sw-segmented-item-label {\n  display: block;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}',
    );
    // After the raised track's padding, at the same specificity.
    expect(
      css.indexOf(
        '.sw-segmented.sw-segmented-sm:not(.sw-segmented-with-icons) .sw-segmented-item',
      ),
    ).toBeGreaterThan(
      css.indexOf('.sw-segmented.sw-segmented-raised .sw-segmented-item {'),
    );
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-segmented-field-full-below-md',
        'sw-segmented-sm',
        'sw-button-group-full-below-md',
      ]),
    );
  });
});

describe('ButtonGroup fullWidthBelow', () => {
  it('stretches an attached group below md', () => {
    render(
      <ButtonGroup aria-label="Steps" attached fullWidthBelow="md">
        <Button variant="secondary">Earlier</Button>
        <Button variant="secondary">Later</Button>
      </ButtonGroup>,
    );
    expect(screen.getByRole('group', { name: 'Steps' }).className).toContain(
      'sw-button-group-full-below-md',
    );
    expect(generateStylesheet()).toContain(
      '.sw-button-group.sw-button-group-attached.sw-button-group-full-below-md > .sw-button { flex: 1 1 0; min-width: 0; }',
    );
  });

  it('refuses it without attached or with an unknown breakpoint', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() =>
      render(
        <ButtonGroup aria-label="Steps" fullWidthBelow="md">
          <Button>Go</Button>
        </ButtonGroup>,
      ),
    ).toThrow('ButtonGroup fullWidthBelow needs attached');
    expect(() =>
      render(
        <ButtonGroup aria-label="Steps" attached fullWidthBelow={'sm' as never}>
          <Button>Go</Button>
        </ButtonGroup>,
      ),
    ).toThrow('Unknown ButtonGroup fullWidthBelow: sm');
  });
});
