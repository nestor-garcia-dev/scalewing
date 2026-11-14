import { expect, test } from '@playwright/test';

test('a transposed grid with pinEnd keeps its last column and total in view on a phone', async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== 'mobile-es',
    'pinEnd works while transposed, below md',
  );
  await page.goto('/#denomination-grid');
  const example = page.getByTestId('denomination-pin-end');
  const region = example.locator('.sw-denomination-scroll-pin-end');
  await region.scrollIntoViewIfNeeded();
  const total = example.locator('tfoot .sw-denomination-transposed-end');
  const label = example
    .locator('tbody .sw-denomination-transposed-label')
    .first();
  const edges = async () => {
    const [regionBox, totalBox, labelBox] = await Promise.all([
      region.boundingBox(),
      total.boundingBox(),
      label.boundingBox(),
    ]);
    return {
      totalEnd: Math.abs(
        totalBox!.x + totalBox!.width - (regionBox!.x + regionBox!.width),
      ),
      labelStart: Math.abs(labelBox!.x - regionBox!.x),
    };
  };
  // The counts do not fit: the region scrolls, the ends stay put.
  expect(
    await region.evaluate((node) => node.scrollWidth > node.clientWidth),
  ).toBe(true);
  expect((await edges()).totalEnd).toBeLessThanOrEqual(1);
  await region.evaluate((node) => {
    node.scrollLeft = node.scrollWidth;
  });
  const after = await edges();
  expect(after.totalEnd).toBeLessThanOrEqual(1);
  expect(after.labelStart).toBeLessThanOrEqual(1);
  await expect(total).toHaveText('72');
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await example.screenshot({
    path: testInfo.outputPath('denomination-pin-end.png'),
  });
});
