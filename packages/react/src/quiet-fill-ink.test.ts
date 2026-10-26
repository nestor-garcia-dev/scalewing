import { contrastRatio } from '@scalewing/tokens';
import { describe, expect, it } from 'vitest';

import { groupedCanvasMutedShare } from './css/css-canvas-grouped.js';
import { cssContextSwitcherTriggerClasses } from './css/css-context-switcher-trigger.js';
import { cssFixtureClasses } from './css/css-fixture.js';
import { cssListRowClasses } from './css/css-list-row.js';
import { cssTablePressClasses } from './css/css-table-press.js';
import { mutedReadsAsText, quietFill } from './css/quiet-fill.js';
import { generateStylesheet } from './css/stylesheet.js';
import { forEveryTheme, tintOver } from './every-theme.test-support.js';

/*
 * FutMas F-010-S22 gap 1: a pressable FixtureRow's muted details measured
 * 4.14:1 on its hover fill (ink light), under WCAG 1.4.3's 4.5:1. The fill
 * stays (it is the pressable cue); the words take the text colour while it
 * shows. The fill's share is read from the generated value.
 */
const fillShare = Number(/(\d+)%/.exec(quietFill)![1]) / 100;

/** Every opaque ground a row can sit on: the page, a surface, the grouped canvas. */
function grounds(
  colors: Parameters<Parameters<typeof forEveryTheme>[0]>[0],
  scheme: string,
) {
  return {
    background: colors.background,
    surface: colors.surface,
    grouped:
      scheme === 'dark'
        ? colors.background
        : tintOver(colors.muted, groupedCanvasMutedShare, colors.background),
  };
}

describe('Muted words on the quiet fill', () => {
  it('keeps the text colour at 4.5:1 on the fill in every palette and scheme', () => {
    forEveryTheme((colors, label, theme) => {
      for (const [name, ground] of Object.entries(
        grounds(colors, theme.colorScheme),
      )) {
        const fill = tintOver(colors.muted, fillShare, ground);
        expect(
          contrastRatio(colors.text, fill),
          `${label} text on the fill over ${name}`,
        ).toBeGreaterThanOrEqual(4.5);
      }
    });
  });

  it('needs the swap: muted words fall under 4.5:1 on the fill', () => {
    // Records why the rule exists; if no palette fell under, the rule
    // could go.
    const below: string[] = [];
    forEveryTheme((colors, label) => {
      const fill = tintOver(colors.muted, fillShare, colors.surface);
      if (contrastRatio(colors.muted, fill) < 4.5) below.push(label);
    });
    expect(below).toContain('ink light');
  });

  it('redefines the muted token on what sits on the fill, never on what paints it', () => {
    expect(mutedReadsAsText(['.a:hover *', '.b'])).toBe(
      '.a:hover *,\n.b {\n  --sw-color-muted: var(--sw-color-text);\n}',
    );
    const css = generateStylesheet();
    const scopes = [
      ...css.matchAll(
        /([^{}]+)\{\n {2}--sw-color-muted: var\(--sw-color-text\);/g,
      ),
    ]
      .flatMap((match) => match[1]!.split(',\n'))
      .map((selector) => selector.trim());
    expect(scopes.length).toBeGreaterThan(0);
    for (const selector of scopes)
      expect(
        selector.endsWith(' *') || selector.endsWith('> .sw-fixture-detail'),
        selector,
      ).toBe(true);
  });

  it('applies to a hovered FixtureRow and the detail under a filled item', () => {
    const css = cssFixtureClasses();
    const hover = css.slice(css.indexOf('@media (hover: hover)'));
    expect(hover).toMatch(
      /^@media \(hover: hover\) \{\n {2}\.sw-fixture-row-pressable:hover \{ background: [^}]+\}\n\n {2}\.sw-fixture-row-pressable:hover \* \{\n {2}--sw-color-muted: var\(--sw-color-text\);\n\}\n\}/,
    );
    expect(css).toContain(
      ':is(.sw-fixture-item-action, .sw-fixture-item-select):has(> .sw-fixture-row-pressable:hover) > .sw-fixture-detail {',
    );
  });

  it('applies to an open or hovered ContextSwitcher trigger’s words', () => {
    const css = cssContextSwitcherTriggerClasses();
    expect(css).toContain(
      ".sw-context-switcher-trigger[aria-expanded='true'] * {\n  --sw-color-muted: var(--sw-color-text);\n}",
    );
    // Hover only where a pointer hovers.
    expect(css).toMatch(
      /@media \(hover: hover\) \{\n {2}\.sw-context-switcher-trigger:hover \* \{\n {2}--sw-color-muted: var\(--sw-color-text\);\n\}\n\}/,
    );
  });

  it('applies to a ListRow while hovered or pressed, never when disabled', () => {
    const css = cssListRowClasses();
    expect(css).toContain(
      '.sw-list-row-pressable:hover:not(.sw-list-row-disabled) * {',
    );
    expect(css).toContain(
      '.sw-list-row-pressable:active:not(.sw-list-row-disabled) * {',
    );
  });

  it('applies to a pressable TableRow and its muted cells in every filled state', () => {
    const css = cssTablePressClasses();
    for (const state of [':hover', ':active', ':has(:focus-visible)']) {
      expect(css).toContain(`.sw-table-row-press${state} > :is(td, th) *`);
      expect(css).toContain(
        `.sw-table-row-press${state} > .sw-table-tone-muted`,
      );
    }
  });
});
