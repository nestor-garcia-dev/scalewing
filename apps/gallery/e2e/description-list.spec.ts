import { expect, test } from '@playwright/test';

test('DescriptionList pairs terms in one column, divides rows and stacks on a phone', async ({
  page,
}, testInfo) => {
  await page.goto('/#description-list');
  if (testInfo.project.name === 'forced-colors') {
    await page.emulateMedia({ forcedColors: 'active' });
    expect(
      await page.evaluate(() => matchMedia('(forced-colors: active)').matches),
    ).toBe(true);
  }
  const list = page.locator(
    '#description-list dl[aria-label="Habitat survey"]',
  );
  const terms = list.locator('dt');
  const details = list.locator('dd');
  await expect(terms).toHaveText(['Wetland', 'Old-growth forest', 'Dunes']);
  await expect(details).toHaveCount(3);

  const termBoxes = await Promise.all(
    [0, 1, 2].map(async (index) => (await terms.nth(index).boundingBox())!),
  );
  const detailBoxes = await Promise.all(
    [0, 1, 2].map(async (index) => (await details.nth(index).boundingBox())!),
  );
  // Every term starts one column and every detail the next.
  for (const box of termBoxes) expect(box.x).toBe(termBoxes[0].x);
  for (const box of detailBoxes) expect(box.x).toBe(detailBoxes[0].x);
  const items = list.locator('.sw-description-item');
  if (testInfo.project.name === 'mobile-es') {
    // Below md each term sits over its detail.
    for (const [index, term] of termBoxes.entries()) {
      expect(detailBoxes[index].x).toBe(term.x);
      expect(detailBoxes[index].y).toBeGreaterThanOrEqual(term.y + term.height);
    }
  } else {
    // Side by side, each row aligned to its top.
    for (const [index, term] of termBoxes.entries()) {
      expect(detailBoxes[index].x).toBeGreaterThan(term.x + term.width);
      expect(detailBoxes[index].y).toBe(term.y);
    }
    // A caption term's first line is level with its caption detail's.
    const firstLine = async (cell: typeof terms) =>
      (await cell.locator(':scope > *').first().boundingBox())!.y;
    for (const index of [0, 1, 2])
      expect(await firstLine(terms.nth(index))).toBe(
        await firstLine(details.nth(index)),
      );
  }
  // A hairline between rows, none above the first.
  await expect(items.nth(0)).toHaveCSS('border-top-width', '0px');
  await expect(items.nth(1)).toHaveCSS('border-top-width', '1px');
  await expect(items.nth(2)).toHaveCSS('border-top-width', '1px');
  await page
    .locator('#description-list')
    .screenshot({ path: testInfo.outputPath('description-list.png') });
});
