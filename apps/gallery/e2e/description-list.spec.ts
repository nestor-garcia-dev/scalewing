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
  const list = page.locator('#description-list dl');
  const terms = list.locator('dt');
  const details = list.locator('dd');
  await expect(terms).toHaveText(['Wetland', 'Old-growth forest', 'Dunes']);
  await expect(details).toHaveCount(3);

  // Every box is read in one synchronous evaluate: sections higher on the
  // page (images, a PDF) load and move the list while separate reads run.
  const rows = await list.evaluate((node) => {
    // A cell, or its first line, that draws no box reads as null and fails.
    const shown = (element: Element | null) =>
      element && element.getClientRects().length > 0
        ? element.getBoundingClientRect()
        : null;
    const cell = (element: Element | null) => {
      const box = shown(element);
      if (!box || box.width === 0 || box.height === 0) return null;
      return {
        x: box.x,
        y: box.y,
        width: box.width,
        height: box.height,
        firstLineY: shown(element?.firstElementChild ?? null)?.y ?? null,
      };
    };
    return Array.from(
      node.querySelectorAll('.sw-description-item'),
      (item) => ({
        term: cell(item.querySelector('dt')),
        detail: cell(item.querySelector('dd')),
      }),
    );
  });
  expect(rows).toHaveLength(3);
  const [first] = rows;
  for (const { term, detail } of rows) {
    if (!term || !detail || !first?.term || !first.detail)
      throw new Error('Every term and detail draws a box.');
    // Every term starts one column and every detail the next.
    expect(term.x).toBe(first.term.x);
    expect(detail.x).toBe(first.detail.x);
    if (testInfo.project.name === 'mobile-es') {
      // Below md each term sits over its detail.
      expect(detail.x).toBe(term.x);
      expect(detail.y).toBeGreaterThanOrEqual(term.y + term.height);
    } else {
      // Side by side, each row aligned to its top.
      expect(detail.x).toBeGreaterThan(term.x + term.width);
      expect(detail.y).toBe(term.y);
      // The term's first line is level with its detail's first line.
      expect(term.firstLineY).not.toBeNull();
      expect(term.firstLineY).toBe(detail.firstLineY);
    }
  }
  const items = list.locator('.sw-description-item');
  // A hairline between rows, none above the first.
  await expect(items.nth(0)).toHaveCSS('border-top-width', '0px');
  await expect(items.nth(1)).toHaveCSS('border-top-width', '1px');
  await expect(items.nth(2)).toHaveCSS('border-top-width', '1px');
  await page
    .locator('#description-list')
    .screenshot({ path: testInfo.outputPath('description-list.png') });
});
