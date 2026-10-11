import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Button, ButtonGroup } from './index.js';
import { breakpointQuery } from './css/breakpoints.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => cleanup());

describe('ButtonGroup attached', () => {
  it('marks an attached group and leaves the action row as it was', () => {
    const { rerender } = render(
      <ButtonGroup aria-label="Day" attached>
        <Button onPress={() => undefined} variant="secondary">
          Today
        </Button>
      </ButtonGroup>,
    );
    expect(screen.getByRole('group', { name: 'Day' }).className).toBe(
      'sw-button-group sw-button-group-end sw-button-group-attached',
    );
    rerender(
      <ButtonGroup aria-label="Day">
        <Button onPress={() => undefined}>Today</Button>
      </ButtonGroup>,
    );
    expect(screen.getByRole('group', { name: 'Day' }).className).toBe(
      'sw-button-group sw-button-group-end',
    );
  });
});

describe('ButtonGroup attached CSS', () => {
  const css = generateStylesheet();
  const group = '.sw-button-group.sw-button-group-attached';

  it('lists its class', () => {
    expect(utilityClassCatalog()).toContain('sw-button-group-attached');
  });

  it('joins the buttons: no gap, one divider, square inner and rounded outer corners', () => {
    expect(css).toContain(
      `${group} {\n  align-items: stretch;\n  display: inline-flex;\n  flex-wrap: nowrap;\n  gap: 0;\n  isolation: isolate;\n  max-width: 100%;\n  width: fit-content;`,
    );
    expect(css).toContain(`${group} > .sw-button {\n  border-radius: 0;\n}`);
    expect(css).toContain(
      `${group} > .sw-button + .sw-button {\n  margin-inline-start: -1px;\n}`,
    );
    expect(css).toContain(
      `${group} > .sw-button:first-child {\n  border-end-start-radius: var(--sw-radius-sm);\n  border-start-start-radius: var(--sw-radius-sm);\n}`,
    );
    expect(css).toContain(
      `${group} > .sw-button:last-child {\n  border-end-end-radius: var(--sw-radius-sm);\n  border-start-end-radius: var(--sw-radius-sm);\n}`,
    );
  });

  it('raises a pressed button and the focused one over their neighbours, with the standard ring', () => {
    expect(css).toContain(
      `${group} > .sw-button[aria-pressed='true'] {\n  position: relative;\n  z-index: 1;\n}`,
    );
    expect(css).toContain(
      `${group} > .sw-button:focus-visible {\n  position: relative;\n  z-index: 2;\n}`,
    );
    // No inset ring: the button's own outer ring stays.
    expect(css).not.toMatch(
      /sw-button-group-attached > \.sw-button:focus-visible \{[^}]*outline-offset/,
    );
  });

  it('draws a divider for a borderless variant in its own text colour', () => {
    expect(css).toContain(
      `${group} > .sw-button + .sw-button:not(.sw-button-secondary) {\n  border-inline-start-color: color-mix(in srgb, currentColor 30%, transparent);\n}`,
    );
  });

  it('keeps its row below md', () => {
    expect(css).toContain(
      `@media ${breakpointQuery('below', 'md')} {\n  ${group} { align-items: stretch; flex-direction: row; }\n  ${group} > * { width: auto; }\n}`,
    );
    // After the action row's own phone rule; it already wins on specificity,
    // and the order guards a later change to the selector.
    expect(css.indexOf(`${group} > * { width: auto; }`)).toBeGreaterThan(
      css.indexOf('.sw-button-group > * { width: 100%; }'),
    );
  });
});
