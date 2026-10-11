import { expect, test } from '@playwright/test';

import { colorContrast } from './contrast';

test('GlyphTile fills each hue, sizes 24, 28 and 32, keeps a white glyph at 3:1 and stays decorative', async ({
  page,
}, testInfo) => {
  await page.goto('/#glyph-tile');
  const forced = testInfo.project.name === 'forced-colors';
  if (forced) await page.emulateMedia({ forcedColors: 'active' });
  const section = page.locator('#glyph-tile');

  for (const [size, side] of [
    ['sm', 24],
    ['md', 28],
    ['lg', 32],
  ] as const) {
    const tiles = section
      .getByTestId(`glyph-tiles-${size}`)
      .locator('.sw-glyph-tile');
    await expect(tiles).toHaveCount(7);
    const box = (await tiles.first().boundingBox())!;
    expect(Math.round(box.width)).toBe(side);
    expect(Math.round(box.height)).toBe(side);
    const glyph = (await tiles.first().locator('svg').boundingBox())!;
    expect(Math.round(glyph.width)).toBe(16);
  }

  const tiles = section.getByTestId('glyph-tiles-md').locator('.sw-glyph-tile');
  for (let index = 0; index < 7; index += 1) {
    const tile = tiles.nth(index);
    await expect(tile).toHaveAttribute('aria-hidden', 'true');
    if (forced) {
      await expect(tile).toHaveCSS('border-top-style', 'solid');
      continue;
    }
    const [fill, ink] = await tile.evaluate((node) => [
      getComputedStyle(node).backgroundColor,
      getComputedStyle(node).color,
    ]);
    expect(ink).toBe('rgb(255, 255, 255)');
    expect(colorContrast(fill!, ink!)).toBeGreaterThanOrEqual(3);
  }
  // Each hue is its own fill.
  if (!forced) {
    const fills = await tiles.evaluateAll((nodes) =>
      nodes.map((node) => getComputedStyle(node).backgroundColor),
    );
    expect(new Set(fills).size).toBe(7);
  }
  // A decorative tile adds nothing to the accessible text of its row.
  const reef = section.getByText('Reef', { exact: true }).locator('xpath=..');
  await expect(reef).toMatchAriaSnapshot('- paragraph: Reef');
  await section.screenshot({ path: testInfo.outputPath('glyph-tile.png') });
});
