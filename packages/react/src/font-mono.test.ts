import { describe, expect, it } from 'vitest';

import { typedInputs } from './css/css-document.js';
import { monospaceFamilies } from './css/css-font-mono.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

describe('sw-font-mono', () => {
  it('names only generic families, so no face is chosen outside the tokens', () => {
    expect(monospaceFamilies).toBe('ui-monospace, monospace');
  });

  it('sets the family on any element and outranks the canvas text controls', () => {
    const css = generateStylesheet();
    expect(css).toContain(
      `[data-theme] .sw-font-mono,\n[data-theme] :is(${typedInputs}).sw-font-mono {\n  font-family: ui-monospace, monospace;\n}`,
    );
    // The canvas's controls are `[data-theme] :is(…)`; the class adds one
    // more (the computed rank is checked in the gallery's font-mono spec).
    expect(css).toContain(`[data-theme] :is(${typedInputs}) {`);
    expect(utilityClassCatalog()).toContain('sw-font-mono');
  });
});
