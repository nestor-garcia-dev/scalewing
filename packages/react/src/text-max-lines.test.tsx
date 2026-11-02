import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Text, textMaxLines } from './components/Text.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => cleanup());

const css = generateStylesheet();

describe('Text maxLines', () => {
  it('adds no class by default', () => {
    render(<Text>Heron</Text>);
    expect(screen.getByText('Heron').className).toBe('sw-text-body');
  });

  it('clamps with a generated class and keeps every word in the DOM', () => {
    render(
      <button type="button">
        <Text as="span" maxLines={2} variant="label">
          A very long station name
        </Text>
      </button>,
    );
    const text = screen.getByText('A very long station name');
    expect(text.className).toBe('sw-text-label sw-text-clamp-2');
    expect(
      screen.getByRole('button', { name: 'A very long station name' }),
    ).toBeTruthy();
    expect(textMaxLines).toEqual([2, 3]);
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining(['sw-text-clamp-2', 'sw-text-clamp-3']),
    );
    expect(css).toContain(
      '.sw-text-clamp-2 {\n  -webkit-box-orient: vertical;\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  line-clamp: 2;\n  overflow: hidden;\n}',
    );
    // Only the drawing is cut: nothing hides it from assistive technology.
    const clamp = css.slice(css.indexOf('.sw-text-clamp-2 {'));
    expect(clamp.slice(0, clamp.indexOf('}'))).not.toMatch(
      /visibility|display: none|clip-path/,
    );
  });

  it('sets the bodySm variant as a paragraph', () => {
    render(<Text variant="bodySm">Heron</Text>);
    const text = screen.getByText('Heron');
    expect(text.tagName).toBe('P');
    expect(css).toContain(
      '.sw-text-bodySm { font-family: var(--sw-font-sans); font-size: 15px; line-height: 22px; font-weight: 400; letter-spacing: -0.2px; }',
    );
  });

  it('fails closed on an unknown count or with truncate', () => {
    expect(() =>
      // @ts-expect-error an unknown count
      render(<Text maxLines={5}>Heron</Text>),
    ).toThrow(RangeError);
    expect(() =>
      render(
        <Text maxLines={2} truncate>
          Heron
        </Text>,
      ),
    ).toThrow(RangeError);
  });
});
