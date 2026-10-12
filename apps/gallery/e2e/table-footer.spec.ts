import { expect, test } from '@playwright/test';

test('TableFooter pins its total to the bottom of the page while the rows scroll', async ({
  page,
}, testInfo) => {
  await page.goto('/#table');
  if (testInfo.project.name === 'forced-colors')
    await page.emulateMedia({ forcedColors: 'active' });
  const table = page.getByRole('table', { name: 'Census by site' });
  const region = page.getByRole('group', { name: 'Census by site' });
  const total = table.getByRole('rowheader', { name: 'All 30 sites' });
  await expect(total).toBeVisible();
  // The total is a footer row at weight 600 under a 2px rule.
  const [weight, rule] = await total.evaluate((cell) => [
    getComputedStyle(cell).fontWeight,
    getComputedStyle(cell, '::before').borderTopWidth,
  ]);
  expect(weight).toBe('600');
  expect(rule).toBe('2px');

  const fits = await region.evaluate((node) =>
    node.classList.contains('sw-scroll-fits'),
  );
  if (!fits) {
    // A table wider than its region scrolls in it and pins there instead.
    await expect(region).toHaveCSS('overflow-x', 'auto');
    return;
  }
  await expect(region).toHaveCSS('overflow-x', 'visible');

  // Scroll so the table's first rows sit at the top of the viewport: the
  // table runs past the bottom edge, and the total is pinned there.
  const viewport = page.viewportSize()!;
  const firstSite = table.getByRole('cell', { name: 'North reed bed' });
  await firstSite.evaluate((node) => node.scrollIntoView({ block: 'start' }));
  const tableBox = (await table.boundingBox())!;
  test.skip(
    tableBox.y + tableBox.height <= viewport.height,
    'The table fits the viewport, so nothing scrolls under the total.',
  );
  const box = (await total.boundingBox())!;
  expect(Math.abs(box.y + box.height - viewport.height)).toBeLessThanOrEqual(1);
  // The pinned total paints over the rows under it.
  const covering = await page.evaluate(
    ([x, y]) => document.elementFromPoint(x!, y!)?.closest('tfoot') !== null,
    [box.x + 4, box.y + box.height / 2],
  );
  expect(covering).toBe(true);

  // The sticky header pins to the page's top as well, under any sticky top
  // chrome: here the gallery's own sticky header covers it, as an AppHeader
  // would, so the check is its pinned place, not that it shows.
  await table
    .getByRole('cell', { name: 'Lagoon' })
    .evaluate((node) => node.scrollIntoView({ block: 'center' }));
  // The whole head group is what pins (its thead), not each cell.
  await expect(table.locator('thead')).toHaveCSS('position', 'sticky');
  const header = table.getByRole('columnheader', { name: 'Site' });
  const headerBox = (await header.boundingBox())!;
  expect(Math.abs(headerBox.y)).toBeLessThanOrEqual(1);
  if (testInfo.project.name === 'forced-colors') {
    // Solid system canvas, nothing showing through the pinned total.
    const [fill, filter] = await total.evaluate((cell) => [
      getComputedStyle(cell).backgroundColor,
      getComputedStyle(cell).backdropFilter,
    ]);
    expect(fill).not.toMatch(/[/,] 0(\.\d+)?\)$/);
    expect(filter).toBe('none');
  }
  await page.screenshot({ path: testInfo.outputPath('table-footer.png') });

  // Right to left, the rule still spans the cell.
  await table.evaluate((node) => node.setAttribute('dir', 'rtl'));
  const rtlRule = await total.evaluate((cell) => {
    const style = getComputedStyle(cell, '::before');
    return [style.left, style.right, style.borderTopWidth];
  });
  expect(rtlRule).toEqual(['0px', '0px', '2px']);
  await table.evaluate((node) => node.removeAttribute('dir'));
});

test('TableFooter in a table wider than its region pins inside the region', async ({
  page,
}) => {
  await page.goto('/#table');
  const table = page.getByRole('table', { name: 'Census by site' });
  const region = page.getByRole('group', { name: 'Census by site' });
  await table.scrollIntoViewIfNeeded();
  // Widen the table past its region, as many columns on a phone would.
  await table.evaluate((node) => {
    node.style.minWidth = '2400px';
  });
  await expect(region).not.toHaveClass(/sw-scroll-fits/);
  await expect(region).toHaveClass(/sw-scroll-more-end/);
  await expect(region).toHaveCSS('overflow-x', 'auto');
  // The region does not scroll vertically, so the total sits at its bottom.
  const total = table.getByRole('rowheader', { name: 'All 30 sites' });
  const regionBox = (await region.boundingBox())!;
  const box = (await total.boundingBox())!;
  expect(box.y + box.height).toBeLessThanOrEqual(
    regionBox.y + regionBox.height + 1,
  );
  // Narrow again: it fits and the region stops scrolling.
  await table.evaluate((node) => {
    node.style.minWidth = '';
  });
  await expect(region).toHaveClass(/sw-scroll-fits/);
  await expect(region).toHaveCSS('overflow-x', 'visible');
});
