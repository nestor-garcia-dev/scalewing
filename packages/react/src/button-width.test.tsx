import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Button, type ButtonWidth } from './components/Button.js';
import { Inline } from './components/Inline.js';
import { buttonWidths } from './css/css-button-width.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => {
  cleanup();
});

describe('Button width', () => {
  it('is as wide as its words by default, with no width class', () => {
    render(<Button onPress={() => undefined}>Edit</Button>);
    const button = screen.getByRole('button', { name: 'Edit' });
    expect(button.className).not.toContain('sw-button-full');
    expect(buttonWidths).toEqual(['content', 'full']);
  });

  it('fills its row beside a sibling with width full, its other classes kept', () => {
    render(
      <Inline gap={2}>
        <Button onPress={() => undefined} variant="neutral" width="full">
          Edit
        </Button>
        <Button aria-label="More" onPress={() => undefined} variant="neutral">
          •••
        </Button>
      </Inline>,
    );
    const edit = screen.getByRole('button', { name: 'Edit' });
    expect(edit.className.split(' ')).toEqual([
      'sw-button',
      'sw-button-neutral',
      'sw-button-md',
      'sw-button-full',
    ]);
    expect(
      screen.getByRole('button', { name: 'More' }).className,
    ).not.toContain('sw-button-full');
  });

  it('generates the fill rules: the column, and the row a sibling leaves', () => {
    const css = generateStylesheet();
    expect(utilityClassCatalog()).toContain('sw-button-full');
    expect(css).toContain('.sw-button-full {\n  width: 100%;\n}');
    expect(css).toContain(
      '.sw-inline > .sw-button-full {\n  flex: 1 1 0;\n  min-width: 0;\n}',
    );
    // A wrapping row: it grows from its words and wraps, never shrinks past them.
    expect(css).toContain(
      '.sw-inline.sw-wrap > .sw-button-full {\n  flex: 1 1 auto;\n  width: auto;\n}',
    );
  });

  it('fails closed on an unknown width', () => {
    expect(() =>
      render(
        <Button onPress={() => undefined} width={'wide' as ButtonWidth}>
          Edit
        </Button>,
      ),
    ).toThrow('Unknown Button width: wide');
  });
});
