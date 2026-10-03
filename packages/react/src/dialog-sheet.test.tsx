import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { Dialog } from './components/Dialog.js';
import { Text } from './components/Text.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';
import { ThemeProvider } from './theme/ThemeProvider.js';

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function close() {
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  };
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const css = generateStylesheet();

/** The body of the first rule for `selector` after `from`. */
function ruleBody(selector: string, from = 0): string {
  const start = css.indexOf(`${selector} {`, from);
  expect(start).toBeGreaterThanOrEqual(0);
  return css.slice(start, css.indexOf('}', start));
}

describe('Dialog sheetBelow', () => {
  it('adds the sheet class only when asked, beside the size', () => {
    render(
      <ThemeProvider colorScheme="light">
        <Dialog
          onClose={() => {}}
          open
          sheetBelow="md"
          size="lg"
          title="Review the count"
        >
          <Text>Fourteen herons.</Text>
        </Dialog>
        <Dialog onClose={() => {}} open title="Confirm">
          <Text>Release the heron?</Text>
        </Dialog>
      </ThemeProvider>,
    );

    const sheet = screen.getByRole('dialog', { name: 'Review the count' });
    expect(sheet.className).toContain(
      'sw-dialog sw-dialog-lg sw-dialog-sheet-below-md',
    );
    expect(
      screen.getByRole('dialog', { name: 'Confirm' }).className,
    ).not.toContain('sw-dialog-sheet');
  });

  it('generates a bottom sheet below the breakpoint and the centered dialog from it up', () => {
    expect(utilityClassCatalog()).toContain('sw-dialog-sheet-below-md');
    const query =
      '@media not all and (min-width: 48rem) {\n  .sw-dialog-sheet-below-md {';
    const start = css.indexOf(query);
    expect(start).toBeGreaterThan(css.indexOf('.sw-dialog-lg {'));
    // Only inside that query: from md up the dialog stays centered.
    expect(css.split('.sw-dialog-sheet-below-md {')).toHaveLength(2);

    const sheet = ruleBody('.sw-dialog-sheet-below-md', start);
    expect(sheet).toContain('margin: auto 0 0;');
    expect(sheet).toContain('width: 100%;');
    expect(sheet).toContain('max-width: none;');
    expect(sheet).toContain(
      'border-radius: var(--sw-radius-lg) var(--sw-radius-lg) 0 0;',
    );
    expect(sheet).toContain('border-width: 1px 0 0;');
    expect(sheet).toContain(
      'max-height: min(100vh - var(--sw-space-8), 100dvh - var(--sw-space-8));',
    );
    expect(sheet).toContain(
      'padding-bottom: calc(var(--sw-space-5) + env(safe-area-inset-bottom, 0px));',
    );
    expect(sheet).toContain(
      'padding-left: max(var(--sw-space-5), env(safe-area-inset-left, 0px));',
    );
    expect(sheet).not.toMatch(/#[0-9a-f]{3,8}\b|\d+px\s*;/i);
  });

  it('slides the sheet up with the motion tokens and holds it still under reduced motion', () => {
    expect(ruleBody('.sw-dialog-sheet-below-md[open]')).toContain(
      'animation: sw-dialog-sheet-in var(--sw-motion-default) var(--sw-motion-easing);',
    );
    expect(css).toContain(
      '@keyframes sw-dialog-sheet-in {\n  from { translate: 0 100%; }\n}',
    );
    expect(css).toContain(
      '@media (prefers-reduced-motion: reduce) {\n  .sw-dialog-sheet-below-md[open] { animation: none; }\n}',
    );
  });
});

describe('Dialog closeLabel', () => {
  it('ends the title row with an icon-only ghost button that asks onClose', () => {
    const onClose = vi.fn();
    render(
      <ThemeProvider colorScheme="light">
        <Dialog
          closeLabel="Close"
          onClose={onClose}
          open
          title="Review the count"
          titleLevel={2}
        >
          <Text as="h3" variant="label">
            Herons
          </Text>
        </Dialog>
      </ThemeProvider>,
    );

    const dialog = screen.getByRole('dialog', { name: 'Review the count' });
    const title = within(dialog).getByRole('heading', { level: 2 });
    expect(dialog.getAttribute('aria-labelledby')).toBe(title.id);
    const close = within(dialog).getByRole('button', { name: 'Close' });
    expect(close.className).toBe(
      'sw-button sw-button-ghost sw-button-sm sw-dialog-close',
    );
    expect(close.getAttribute('type')).toBe('button');
    const row = title.parentElement;
    expect(row?.className).toBe('sw-dialog-header');
    expect(row?.firstElementChild).toBe(title);
    expect(row?.lastElementChild).toBe(close);
    const glyph = close.querySelector('.sw-dialog-close-glyph');
    expect(glyph?.getAttribute('aria-hidden')).toBe('true');
    expect(glyph?.textContent).toBe('');
    // The title stays the dialog's name; the button is not part of it.
    expect(title.textContent).toBe('Review the count');
    expect(within(dialog).getByRole('heading', { level: 3 }).textContent).toBe(
      'Herons',
    );

    fireEvent.click(close);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('keeps the markup unchanged without a closeLabel', () => {
    render(
      <ThemeProvider colorScheme="light">
        <Dialog onClose={() => {}} open title="Confirm">
          <Text>Release the heron?</Text>
        </Dialog>
      </ThemeProvider>,
    );

    const dialog = screen.getByRole('dialog', { name: 'Confirm' });
    expect(within(dialog).queryByRole('button')).toBeNull();
    expect(dialog.querySelector('.sw-dialog-header')).toBeNull();
    const title = within(dialog).getByRole('heading', { name: 'Confirm' });
    expect(title.tagName).toBe('H3');
    expect(title.parentElement?.className).toContain('sw-stack');
  });

  it('generates the title row, a square close button and a private crossed glyph', () => {
    for (const className of [
      'sw-dialog-header',
      'sw-dialog-close',
      'sw-dialog-close-glyph',
    ])
      expect(utilityClassCatalog()).toContain(className);
    const close = ruleBody('.sw-button.sw-dialog-close');
    expect(close).toContain('padding-inline: 0;');
    expect(close).toContain('min-width: var(--sw-control-sm-min-height);');
    // As tall as one title line, the glyph's end on the padding edge.
    expect(close).toContain(
      'margin-block: calc((28px - var(--sw-control-sm-min-height)) / 2);',
    );
    expect(close).toContain(
      'margin-inline-end: calc((var(--sw-space-4) - var(--sw-control-sm-min-height)) / 2);',
    );
    const coarse = css.indexOf(
      '@media (pointer: coarse) {\n  .sw-button.sw-dialog-close {',
    );
    expect(coarse).toBeGreaterThan(0);
    expect(ruleBody('.sw-button.sw-dialog-close', coarse)).toContain(
      'min-height: var(--sw-control-md-min-height);',
    );
    const glyph = ruleBody(
      '.sw-dialog-close-glyph::before,\n.sw-dialog-close-glyph::after',
    );
    expect(glyph).toContain('border-top: 2px solid currentColor;');
    expect(glyph).not.toContain('background');
    expect(ruleBody('.sw-dialog-close-glyph')).toContain(
      'width: var(--sw-space-4);',
    );
  });
});
