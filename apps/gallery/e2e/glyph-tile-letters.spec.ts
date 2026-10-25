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

test('letters keep 4.5:1 on a deeper fill; a glyph keeps the categorical fill', async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name === 'forced-colors',
    'forced colours draw the tile with system colours',
  );
  await page.goto('/#glyph-tile');
  const letters = page
    .getByTestId('glyph-letters-sm')
    .locator('.sw-glyph-tile');
  const measured = await letters.evaluateAll((tiles) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d', { willReadFrequently: true })!;
    const bytes = (color: string) => {
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = color;
      context.fillRect(0, 0, 1, 1);
      return [...context.getImageData(0, 0, 1, 1).data].slice(0, 3);
    };
    const luminance = (rgb: number[]) =>
      rgb
        .map((value) => value / 255)
        .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
        .reduce(
          (sum, c, index) => sum + c * [0.2126, 0.7152, 0.0722][index]!,
          0,
        );
    return tiles.map((tile) => {
      const text = luminance(bytes(getComputedStyle(tile).color));
      const fill = luminance(bytes(getComputedStyle(tile).backgroundColor));
      return (Math.max(text, fill) + 0.05) / (Math.min(text, fill) + 0.05);
    });
  });
  expect(measured.length).toBeGreaterThan(0);
  for (const ratio of measured) expect(ratio).toBeGreaterThanOrEqual(4.5);

  // A glyph tile keeps the fill the scale draws (3:1 for a glyph).
  const glyph = page.locator('#glyph-tile .sw-glyph-tile:has(> svg)').first();
  const [fill, token] = await glyph.evaluate((tile) => {
    const probe = document.createElement('span');
    tile.parentElement!.append(probe);
    probe.style.backgroundColor = 'var(--sw-glyph-tile-fill)';
    probe.className = tile.className;
    const token = getComputedStyle(probe).backgroundColor;
    probe.remove();
    return [getComputedStyle(tile).backgroundColor, token];
  });
  expect(fill).toBe(token);
});
