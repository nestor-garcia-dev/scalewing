import { expect, test } from '@playwright/test';

const name = 'Site census with its total last';

test('Table stickyHeader="page" pins its header to the page while the total scrolls with the rows', async ({
  page,
}, testInfo) => {
  await page.goto('/#table');
  if (testInfo.project.name === 'forced-colors')
    await page.emulateMedia({ forcedColors: 'active' });
  const table = page.getByRole('table', { name });
  const region = page.getByRole('group', { name });
  const total = table.getByRole('rowheader', { name: 'All 30 sites' });
  await expect(total).toBeVisible();
  await expect(table).toHaveClass(/sw-table-sticky-page/);
  await expect(table.locator('tfoot')).not.toHaveClass(
    /sw-table-footer-sticky/,
  );

  const fits = await region.evaluate((node) =>
    node.classList.contains('sw-scroll-fits'),
  );
  if (!fits) {
    // A table wider than its region scrolls in it and pins there instead.
    await expect(region).toHaveCSS('overflow-x', 'auto');
    return;
  }
  // No sticky footer, yet the fitting region is no scroll box.
  await expect(region).toHaveCSS('overflow-x', 'visible');

  // With the first rows at the viewport's top, the total is past the
  // bottom edge: it scrolls with the table, it is not pinned.
  const viewport = page.viewportSize()!;
  await table
    .getByRole('cell', { name: 'North reed bed' })
    .evaluate((node) => node.scrollIntoView({ block: 'start' }));
  const tableBox = (await table.boundingBox())!;
  test.skip(
    tableBox.y + tableBox.height <= viewport.height,
    'The table fits the viewport, so nothing scrolls.',
  );
  const totalBox = (await total.boundingBox())!;
  expect(totalBox.y).toBeGreaterThan(viewport.height);

  // Mid-table, the whole header group is pinned to the page's top (the
  // gallery's own sticky header covers it, as an AppHeader would): the
  // headings at the edge and last season's row right under them, its
  // figures (td cells) as well as its name, over the rows scrolling by.
  await table
    .getByRole('cell', { name: 'Lagoon' })
    .evaluate((node) => node.scrollIntoView({ block: 'center' }));
  await expect(table.locator('thead')).toHaveCSS('position', 'sticky');
  const header = table.getByRole('columnheader', { name: 'Site' });
  const headerBox = (await header.boundingBox())!;
  expect(Math.abs(headerBox.y)).toBeLessThanOrEqual(1);
  const headerBottom = headerBox.y + headerBox.height;
  // With the gallery's header out of the way, the pinned cells are what a
  // press at their middle hits, not the body rows scrolling under them.
  await page
    .locator('.gallery-header')
    .evaluate((node: HTMLElement) => (node.style.visibility = 'hidden'));
  for (const cell of [
    table.getByRole('rowheader', { name: 'Last season' }),
    table.getByRole('cell', { name: '1184' }),
    table.getByRole('cell', { name: '402' }),
  ]) {
    const box = (await cell.boundingBox())!;
    expect(Math.abs(box.y - headerBottom)).toBeLessThanOrEqual(1);
    const onTop = await cell.evaluate((node) => {
      const rect = node.getBoundingClientRect();
      const hit = document.elementFromPoint(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
      );
      return hit === node || node.contains(hit);
    });
    expect(onTop).toBe(true);
  }

  // At the table's end the total sits in the flow under the last site.
  await total.evaluate((node) => node.scrollIntoView({ block: 'center' }));
  const last = (await table
    .getByRole('cell', { name: 'Scrape' })
    .boundingBox())!;
  const atEnd = (await total.boundingBox())!;
  expect(Math.abs(atEnd.y - (last.y + last.height))).toBeLessThanOrEqual(2);
  await page.screenshot({ path: testInfo.outputPath('table-sticky-page.png') });
});

test('Table stickyHeader="page" in a table wider than its region pins inside the region', async ({
  page,
}) => {
  await page.goto('/#table');
  const table = page.getByRole('table', { name });
  const region = page.getByRole('group', { name });
  await table.scrollIntoViewIfNeeded();
  await table.evaluate((node) => {
    node.style.minWidth = '2400px';
  });
  await expect(region).not.toHaveClass(/sw-scroll-fits/);
  await expect(region).toHaveCSS('overflow-x', 'auto');
  await table.evaluate((node) => {
    node.style.minWidth = '';
  });
  await expect(region).toHaveClass(/sw-scroll-fits/);
  await expect(region).toHaveCSS('overflow-x', 'visible');
});
