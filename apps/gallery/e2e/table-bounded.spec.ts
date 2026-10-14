import { expect, type Locator, test } from '@playwright/test';

/** The region's visible box: its top and the bottom of its client area. */
async function regionEdges(region: Locator) {
  return region.evaluate((node) => {
    const box = node.getBoundingClientRect();
    const top = box.top + node.clientTop;
    return { top, bottom: top + node.clientHeight };
  });
}

async function scrollRegionTo(region: Locator, top: number | 'end') {
  await region.evaluate((node, to) => {
    node.scrollTop = to === 'end' ? node.scrollHeight : to;
  }, top);
}

test('Table maxHeight scrolls its rows inside its region, header and total pinned', async ({
  page,
}, testInfo) => {
  const forced = testInfo.project.name === 'forced-colors';
  await page.goto('/#table');
  if (forced) await page.emulateMedia({ forcedColors: 'active' });
  const table = page.getByRole('table', { name: 'Census in its own scroll' });
  const region = page.getByRole('group', { name: 'Census in its own scroll' });
  await region.scrollIntoViewIfNeeded();

  // A bounded region is a scroll box of its own and never fits the page.
  await expect(region).toHaveCSS('overflow-y', 'auto');
  await expect(region).not.toHaveClass(/sw-scroll-fits/);
  const [clientHeight, scrollHeight] = await region.evaluate((node) => [
    node.clientHeight,
    node.scrollHeight,
  ]);
  expect(scrollHeight).toBeGreaterThan(clientHeight);

  // Eight single-line rows show between the header and the total.
  const rows = table.locator('tbody tr');
  const header = table.getByRole('columnheader', { name: 'Site' });
  const total = table.getByRole('rowheader', { name: 'All 30 sites' });
  const edges = await regionEdges(region);
  const headerBox = (await header.boundingBox())!;
  const totalBox = (await total.boundingBox())!;
  const eighth = (await rows.nth(7).boundingBox())!;
  const ninth = (await rows.nth(8).boundingBox())!;
  expect(Math.abs(headerBox.y - edges.top)).toBeLessThanOrEqual(1);
  expect(
    Math.abs(totalBox.y + totalBox.height - edges.bottom),
  ).toBeLessThanOrEqual(1);
  expect(eighth.y + eighth.height).toBeLessThanOrEqual(totalBox.y + 1);
  expect(ninth.y).toBeGreaterThanOrEqual(totalBox.y - 1);
  await expect(region).toHaveClass(/sw-scroll-more-bottom/);
  await expect(region).not.toHaveClass(/sw-scroll-more-top/);

  // Mid-way: the header stays at the region's top and the total at its
  // bottom, and both cast the shade over the rows under them.
  await scrollRegionTo(region, 120);
  await expect(region).toHaveClass(/sw-scroll-more-top/);
  await expect(region).toHaveClass(/sw-scroll-more-bottom/);
  const midHeader = (await header.boundingBox())!;
  const midTotal = (await total.boundingBox())!;
  expect(Math.abs(midHeader.y - edges.top)).toBeLessThanOrEqual(1);
  expect(
    Math.abs(midTotal.y + midTotal.height - edges.bottom),
  ).toBeLessThanOrEqual(1);
  const coveredByTotal = await page.evaluate(
    ([x, y]) => document.elementFromPoint(x!, y!)?.closest('tfoot') !== null,
    [midTotal.x + 4, midTotal.y + midTotal.height / 2],
  );
  expect(coveredByTotal).toBe(true);
  const [headShade, footShade, footRule] = await Promise.all([
    header.evaluate(
      (cell) => getComputedStyle(cell, '::before').backgroundImage,
    ),
    total.evaluate(
      (cell) => getComputedStyle(cell, '::before').backgroundImage,
    ),
    total.evaluate(
      (cell) => getComputedStyle(cell, '::before').borderBottomWidth,
    ),
  ]);
  if (forced) {
    expect(headShade).toBe('none');
    expect(footShade).toBe('none');
  } else {
    expect(headShade).toContain('linear-gradient');
    expect(footShade).toContain('linear-gradient');
  }
  // The total keeps its 2 px rule, now under its shade.
  expect(footRule).toBe('2px');
  await page.screenshot({ path: testInfo.outputPath('table-bounded.png') });

  // At the end: the last site sits right over the total, no bottom shade.
  await scrollRegionTo(region, 'end');
  await expect(region).not.toHaveClass(/sw-scroll-more-bottom/);
  const last = (await rows.last().boundingBox())!;
  const endTotal = (await total.boundingBox())!;
  expect(Math.abs(last.y + last.height - endTotal.y)).toBeLessThanOrEqual(1);
  expect(
    await total.evaluate(
      (cell) => getComputedStyle(cell, '::before').backgroundImage,
    ),
  ).toBe('none');
});

test('Table maxHeight region scrolls from the keyboard, its ring over the pinned rows', async ({
  page,
}, testInfo) => {
  const forced = testInfo.project.name === 'forced-colors';
  await page.goto('/#table');
  const table = page.getByRole('table', { name: 'Census in its own scroll' });
  const region = page.getByRole('group', { name: 'Census in its own scroll' });
  await region.scrollIntoViewIfNeeded();
  const ringOf = (cell: Locator) =>
    cell.evaluate((node) => getComputedStyle(node).boxShadow);
  const corner = table.getByRole('columnheader').first();
  const total = table.getByRole('rowheader', { name: 'All 30 sites' });
  expect(await ringOf(corner)).toBe('none');

  // A key press first, so the focus that follows counts as keyboard focus.
  await page.keyboard.press('Shift');
  await region.focus();
  await expect(region).toBeFocused();
  expect(await region.evaluate((node) => node.matches(':focus-visible'))).toBe(
    true,
  );
  // The header's corner cell carries the ring's top and its outer side,
  // the total's first cell its bottom and outer side, in the ring's colour.
  // (Forced colours drop shadows when painting, though the computed value
  // stays; there the outline beside the rows is the ring.)
  const cornerRing = await ringOf(corner);
  const totalRing = await ringOf(total);
  expect(cornerRing).toMatch(/ 0px 2px 0px 0px inset/);
  expect(cornerRing).toMatch(/ 2px 0px 0px 0px inset/);
  expect(totalRing).toMatch(/ 0px -2px 0px 0px inset/);
  expect(totalRing).toMatch(/ 2px 0px 0px 0px inset/);
  if (!forced) {
    const accent = await region.evaluate(
      (node) => getComputedStyle(node).outlineColor,
    );
    expect(cornerRing.split(accent)).toHaveLength(3);
    expect(totalRing.split(accent)).toHaveLength(3);
  }

  const pageTop = await page.evaluate(() => window.scrollY);
  await page.keyboard.press('End');
  await expect
    .poll(() => region.evaluate((node) => node.scrollTop))
    .toBeGreaterThan(0);
  await expect(region).not.toHaveClass(/sw-scroll-more-bottom/);
  // The rows scroll in the region; the page stays where it was.
  expect(await page.evaluate(() => window.scrollY)).toBe(pageTop);
});

test('Table maxHeight with sorting headers keeps eight rows showing', async ({
  page,
}, testInfo) => {
  await page.goto('/#table');
  const table = page.getByRole('table', { name: 'Census in its own scroll' });
  const region = page.getByRole('group', { name: 'Census in its own scroll' });
  await region.scrollIntoViewIfNeeded();
  const sortButton = table.getByRole('button', { name: 'Adults' });
  const coarse = await page.evaluate(
    () => matchMedia('(pointer: coarse)').matches,
  );
  expect(coarse).toBe(testInfo.project.name === 'mobile-es');
  if (coarse)
    expect((await sortButton.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  await sortButton.click();
  await expect(
    table.getByRole('columnheader', { name: 'Adults' }),
  ).toHaveAttribute('aria-sort', 'ascending');

  // Whatever the header's height, eight rows fit between it and the total.
  const rows = table.locator('tbody tr');
  const header = (await table.locator('thead').boundingBox())!;
  // The pinned cells, not the tfoot box, which keeps its place in the flow.
  const total = (await table
    .getByRole('rowheader', { name: 'All 30 sites' })
    .boundingBox())!;
  const first = (await rows.first().boundingBox())!;
  const eighth = (await rows.nth(7).boundingBox())!;
  const ninth = (await rows.nth(8).boundingBox())!;
  expect(Math.abs(first.y - (header.y + header.height))).toBeLessThanOrEqual(1);
  expect(eighth.y + eighth.height).toBeLessThanOrEqual(total.y + 1);
  expect(ninth.y).toBeGreaterThanOrEqual(total.y - 1);
});

test('Table maxHeight without a total shades its own bottom edge', async ({
  page,
}, testInfo) => {
  const forced = testInfo.project.name === 'forced-colors';
  await page.goto('/#table');
  if (forced) await page.emulateMedia({ forcedColors: 'active' });
  const table = page.getByRole('table', { name: 'Sites in their own scroll' });
  const region = page.getByRole('group', { name: 'Sites in their own scroll' });
  await region.scrollIntoViewIfNeeded();
  await expect(region).toHaveClass(/sw-scroll-more-bottom/);

  // Six compact rows under the header, the seventh past the bottom.
  const edges = await regionEdges(region);
  const rows = table.locator('tbody tr');
  const sixth = (await rows.nth(5).boundingBox())!;
  expect(sixth.y + sixth.height).toBeLessThanOrEqual(edges.bottom + 1);
  const seventh = (await rows.nth(6).boundingBox())!;
  expect(seventh.y).toBeGreaterThanOrEqual(edges.bottom - 1);

  const shade = () =>
    region.evaluate((node) => getComputedStyle(node).backgroundImage);
  if (forced) expect(await shade()).toBe('none');
  else expect(await shade()).toContain('linear-gradient');

  // Mid-way, the header covers the top, so only the bottom is the region's.
  await scrollRegionTo(region, 60);
  await expect(region).toHaveClass(/sw-scroll-more-top/);
  const backgrounds = await shade();
  if (!forced) expect(backgrounds.match(/linear-gradient/g)).toHaveLength(1);

  await scrollRegionTo(region, 'end');
  await expect(region).not.toHaveClass(/sw-scroll-more-bottom/);
  expect(await shade()).toBe('none');
});

test('An unbounded table keeps pinning its total to the page', async ({
  page,
}) => {
  await page.goto('/#table');
  // The census without maxHeight is as tall as its rows and, fitting its
  // width, is no scroll box, so its sticky total pins to the page.
  const region = page.getByRole('group', { name: 'Census by site' });
  await region.scrollIntoViewIfNeeded();
  // Three short columns fit at 390 and at 1280, so this always holds.
  await expect(region).toHaveClass('sw-table-wrap sw-scroll-fits');
  await expect(region).toHaveCSS('overflow-y', 'visible');
  await expect(region).toHaveCSS('max-height', 'none');
});
