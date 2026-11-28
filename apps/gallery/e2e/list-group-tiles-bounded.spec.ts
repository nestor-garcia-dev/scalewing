import { expect, type Locator, test } from '@playwright/test';

import { axeViolations } from './axe-scan.js';

test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.project.name !== 'forced-colors') return;
  await page.emulateMedia({ forcedColors: 'active' });
});

const name = 'Which bird did you see?';

function birds(page: import('@playwright/test').Page): {
  region: Locator;
  list: Locator;
} {
  const section = page.locator('#list-group');
  return {
    region: section.getByRole('group', { name }),
    list: section.getByRole('list', { name }),
  };
}

test('ListGroup lg tiles stand at least 56 px, three across or one a row on a phone', async ({
  page,
}, testInfo) => {
  await page.goto('/#list-group');
  const { list } = birds(page);
  const tiles = list.getByRole('button');
  await expect(tiles).toHaveCount(14);
  const boxes = await tiles.evaluateAll((nodes) =>
    nodes.map((node) => {
      const box = node.getBoundingClientRect();
      return { x: box.x, y: box.y, width: box.width, height: box.height };
    }),
  );
  for (const box of boxes) expect(box.height).toBeGreaterThanOrEqual(56);
  // A one-line name sits in the middle of its tile.
  const centred = await tiles.first().evaluate((node) => {
    const words = node.querySelector('.sw-list-row-title')!;
    const tile = node.getBoundingClientRect();
    const box = words.getBoundingClientRect();
    return Math.abs(box.top + box.height / 2 - (tile.top + tile.height / 2));
  });
  expect(centred).toBeLessThanOrEqual(1);
  const firstRow = boxes.filter((box) => Math.abs(box.y - boxes[0]!.y) < 1);
  expect(firstRow).toHaveLength(testInfo.project.name === 'mobile-es' ? 1 : 3);
});

test('a short tile beside a taller one fills its tile: its press area reaches every edge', async ({
  page,
}, testInfo) => {
  await page.goto('/#list-group');
  const { list } = birds(page);
  const fits = await list.getByRole('listitem').evaluateAll((items) =>
    items.map((item) => {
      const tile = item.getBoundingClientRect();
      const row = item.querySelector('button')!.getBoundingClientRect();
      // Inside the tile's 1 px hairline on every side.
      return {
        height: Math.abs(tile.height - 2 - row.height),
        width: Math.abs(tile.width - 2 - row.width),
        tile: tile.height,
      };
    }),
  );
  for (const fit of fits) {
    expect(fit.height).toBeLessThanOrEqual(0.5);
    expect(fit.width).toBeLessThanOrEqual(0.5);
  }
  // Barn owl's detail line makes the first row of three mixed: the two
  // title-only tiles beside it are as tall as it is (62 + 2 px), not 58.
  if (testInfo.project.name !== 'mobile-es') {
    const firstRow = fits.slice(0, 3).map((fit) => Math.round(fit.tile));
    expect(firstRow).toEqual([64, 64, 64]);
  } else {
    expect(Math.round(fits[0]!.tile)).toBe(58);
    expect(Math.round(fits[1]!.tile)).toBe(64);
  }
});

test('ListGroup tiles with maxHeight scroll their grid inside one named region', async ({
  page,
}) => {
  await page.goto('/#list-group');
  const { region, list } = birds(page);
  await expect(list.getByRole('listitem')).toHaveCount(14);
  const sizes = await region.evaluate((node) => ({
    client: node.clientHeight,
    scroll: node.scrollHeight,
    overflowY: getComputedStyle(node).overflowY,
  }));
  expect(sizes.overflowY).toBe('auto');
  expect(sizes.scroll).toBeGreaterThan(sizes.client + 56);
  // Three counted rows: 3 × (62 + 2) + 2 × 12 px.
  expect(Math.abs(sizes.client - 216)).toBeLessThanOrEqual(1);
  // The list in the region is the whole grid; the region clips it.
  const listHeight = await list.evaluate((node) => node.scrollHeight);
  expect(listHeight).toBeGreaterThan(sizes.client);

  // Scrolled to its middle, the region shades both edges over the tiles.
  await region.evaluate((node) => node.scrollTo({ top: 60 }));
  await expect(region).toHaveClass(/sw-scroll-more-top/);
  await expect(region).toHaveClass(/sw-scroll-more-bottom/);
  const shades = await region.evaluate((node) => ({
    before: getComputedStyle(node, '::before').backgroundImage,
    after: getComputedStyle(node, '::after').backgroundImage,
    display: getComputedStyle(node, '::after').display,
  }));
  if (test.info().project.name === 'forced-colors')
    expect(shades.display).toBe('none');
  else {
    expect(shades.before).toContain('linear-gradient');
    expect(shades.after).toContain('linear-gradient');
  }

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

test('Tab through bounded tiles scrolls each focused tile fully into view, its ring whole', async ({
  page,
}, testInfo) => {
  await page.goto('/#list-group');
  const { region, list } = birds(page);
  const tiles = list.getByRole('button');
  await region.focus();
  await expect(region).toBeFocused();
  // The region is a keyboard stop of its own; the tiles follow it in order.
  for (let index = 0; index < 14; index += 1) {
    await page.keyboard.press('Tab');
    const tile = tiles.nth(index);
    await expect(tile).toBeFocused();
    // Fully inside the region's visible box and, on an edge that is
    // shaded (more past it), at least the 24 px shade's depth from it.
    // The shade marks follow the scroll, so wait for them to settle.
    await expect
      .poll(() =>
        tile.evaluate((node) => {
          const scroller = node.closest('.sw-list-group-scroll')!;
          const outer = scroller.getBoundingClientRect();
          const box = node.getBoundingClientRect();
          const top = box.top - outer.top;
          const bottom = outer.bottom - box.bottom;
          const shadedTop = scroller.classList.contains('sw-scroll-more-top');
          const shadedBottom = scroller.classList.contains(
            'sw-scroll-more-bottom',
          );
          return (
            top >= (shadedTop ? 23.5 : -0.5) &&
            bottom >= (shadedBottom ? 23.5 : -0.5) &&
            getComputedStyle(node).outlineStyle === 'solid'
          );
        }),
      )
      .toBe(true);
  }
  await region.screenshot({
    path: testInfo.outputPath('list-group-tiles-bounded.png'),
  });
});

test('Bounded lg tiles pass axe in light and dark', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === 'forced-colors');
  await page.goto('/#list-group');
  const scope = '#list-group .sw-list-group-lg';
  expect(await axeViolations(page, scope)).toEqual([]);
  await page.getByRole('radio', { name: 'Dark' }).check();
  await expect(page.getByRole('radio', { name: 'Dark' })).toBeChecked();
  expect(await axeViolations(page, scope)).toEqual([]);
});
