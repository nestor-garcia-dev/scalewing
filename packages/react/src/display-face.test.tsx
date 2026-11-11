import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { cssDisplayFaceRules, displayFaces } from './css/css-display-face.js';
import { generateStylesheet } from './css/stylesheet.js';
import { ThemeProvider } from './theme/ThemeProvider.js';

afterEach(() => cleanup());

describe('ThemeProvider displayFace', () => {
  it('leaves the root unmarked by default and marks a condensed face', () => {
    const plain = render(
      <ThemeProvider colorScheme="light">
        <h1>Title</h1>
      </ThemeProvider>,
    );
    expect(
      (plain.container.firstElementChild as HTMLElement).hasAttribute(
        'data-display-face',
      ),
    ).toBe(false);
    cleanup();
    const condensed = render(
      <ThemeProvider colorScheme="light" displayFace="condensed">
        <h1>Title</h1>
      </ThemeProvider>,
    );
    expect(
      (condensed.container.firstElementChild as HTMLElement).dataset
        .displayFace,
    ).toBe('condensed');
  });

  it('refuses an unknown face', () => {
    expect(() =>
      render(
        <ThemeProvider displayFace={'slab' as never}>
          <h1>Title</h1>
        </ThemeProvider>,
      ),
    ).toThrow(new RangeError('Unknown display face: slab'));
    expect(displayFaces).toEqual(['system', 'condensed']);
  });

  it('sets only the titles in the condensed face, in the stylesheet', () => {
    const rules = cssDisplayFaceRules();
    expect(rules)
      .toBe(`[data-display-face='condensed'] :is(.sw-text-hero, .sw-text-display, .sw-text-headline, .sw-text-heading) {
  font-family: "Barlow Condensed", "Arial Narrow", sans-serif;
  letter-spacing: 0;
}`);
    expect(rules).not.toContain('sw-text-body');
    expect(generateStylesheet()).toContain(rules);
  });

  it('keeps the compact title sizes and lets the mono face win', () => {
    const sheet = generateStylesheet();
    const face = sheet.indexOf("[data-display-face='condensed']");
    const mono = sheet.indexOf('[data-theme] .sw-font-mono');
    expect(face).toBeGreaterThan(-1);
    // Same specificity: the later mono rule wins on a mono title.
    expect(mono).toBeGreaterThan(face);
    // The face rule sets no size, so the compact steps below md stay.
    expect(cssDisplayFaceRules()).not.toMatch(/font-size|line-height/);
  });
});
