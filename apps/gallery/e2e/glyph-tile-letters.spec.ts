import { expect, test } from '@playwright/test';

for (const size of ['sm', 'md', 'lg'] as const)
  test(`GlyphTile fits one, two and three letters inside a ${size} tile`, async ({
    page,
  }) => {
    await page.goto('/#glyph-tile');
    const row = page.getByTestId(`glyph-letters-${size}`);
    const tiles = row.locator('.sw-glyph-tile');
    await expect(tiles).toHaveCount(4);
    const fits = await tiles.evaluateAll((nodes) =>
      nodes.map((tile) => {
        const text = tile.querySelector('.sw-glyph-tile-text')!;
        const outer = tile.getBoundingClientRect();
        const inner = text.getBoundingClientRect();
        return {
          words: text.textContent,
          inside:
            inner.left >= outer.left - 0.5 &&
            inner.right <= outer.right + 0.5 &&
            inner.top >= outer.top - 0.5 &&
            inner.bottom <= outer.bottom + 0.5,
        };
      }),
    );
    for (const fit of fits)
      expect(fit, fit.words!).toEqual({ words: fit.words, inside: true });
    await expect(row.locator('.sw-glyph-tile-text-3')).toHaveCount(2);
  });
