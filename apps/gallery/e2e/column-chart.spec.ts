import { expect, type Locator, type Page, test } from '@playwright/test';

import { systemColor } from './contrast.js';

const lake = 'Change in birds at the lake, last 13 weeks';
const phone = 'Change in birds, on a phone';

/** The chart box around a hidden table, found by the table's name. */
function chartNamed(page: Page, name: string): Locator {
  return page.getByRole('table', { name }).locator('..');
}

/** Each column's painted fill, in drawing order. */
function columnFills(chart: Locator) {
  return chart
    .locator('rect.sw-chart-column')
    .evaluateAll((rects) => rects.map((rect) => getComputedStyle(rect).fill));
}

test('ColumnChart draws its figures, read from a hidden table, and fits its width', async ({
  page,
}, testInfo) => {
  const mobile = testInfo.project.name === 'mobile-es';
  const forced = testInfo.project.name === 'forced-colors';
  if (forced) await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/#column-chart');
  const table = page.getByRole('table', { name: lake });
  const chart = chartNamed(page, lake);
  await chart.scrollIntoViewIfNeeded();

  // A screen reader reads the table: a row per week, the boxed one current.
  await expect(table.getByRole('row')).toHaveCount(14);
  await expect(table.getByRole('row', { name: /^Oct 6/ })).toHaveAttribute(
    'aria-current',
    'true',
  );
  await expect(table.getByRole('cell', { name: '+63' })).toHaveCount(1);
  const svg = chart.locator('svg');
  await expect(svg).toHaveAttribute('aria-hidden', 'true');

  // The drawing is laid out at the chart's own width: no sideways scroll.
  const fit = await chart.evaluate((node) => ({
    box: node.getBoundingClientRect().width,
    svg: node.querySelector('svg')!.getBoundingClientRect().width,
    overflow: node.scrollWidth - node.clientWidth,
  }));
  expect(Math.abs(fit.svg - fit.box)).toBeLessThanOrEqual(1);
  expect(fit.overflow).toBeLessThanOrEqual(0);

  // Wide, the callouts are pinned above their columns; on a phone they are
  // a list under the plot.
  const list = chart.getByRole('list');
  await expect(list.getByRole('listitem')).toHaveText([
    'Aug 4 · Egret roost found +50',
    'Sep 29 · Heron colony arrived +52',
  ]);
  if (mobile) {
    await expect(list).toBeVisible();
    await expect(chart.locator('.sw-chart-callout-text')).toHaveCount(0);
  } else {
    await expect(list).toHaveClass(/sw-sr-only/);
    await expect(chart.locator('.sw-chart-callout-text')).toHaveCount(2);
  }

  const fills = await columnFills(chart);
  if (forced) {
    const canvasText = await systemColor(page, 'CanvasText');
    expect(new Set(fills)).toEqual(new Set([canvasText]));
  } else expect(new Set(fills).size).toBe(2);
  await chart.screenshot({ path: testInfo.outputPath('column-chart.png') });
});

test('ColumnChart at a phone width labels fewer weeks and lists its callouts', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-en');
  await page.goto('/#column-chart');
  const wide = chartNamed(page, lake);
  const narrow = chartNamed(page, phone);
  await narrow.scrollIntoViewIfNeeded();
  const width = await narrow.evaluate((n) => n.getBoundingClientRect().width);
  expect(width).toBeLessThanOrEqual(360);
  const wideLabels = await wide.locator('.sw-chart-category').count();
  const narrowLabels = narrow.locator('.sw-chart-category');
  expect(await narrowLabels.count()).toBeLessThan(wideLabels);
  await expect(narrowLabels.last()).toHaveText('Oct 6');
  await expect(narrow.getByRole('list')).toBeVisible();
  await narrow.screenshot({
    path: testInfo.outputPath('column-chart-phone.png'),
  });
});

test('ColumnChart draws grouped columns side by side and keeps its hues in dark', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === 'forced-colors');
  await page.goto('/#column-chart');
  const grouped = chartNamed(page, 'Sightings each week');
  await grouped.scrollIntoViewIfNeeded();
  const [day, night] = await grouped
    .locator('rect.sw-chart-column')
    .evaluateAll((rects) =>
      rects.slice(0, 2).map((rect) => rect.getBoundingClientRect()),
    );
  expect(night!.left).toBeGreaterThan(day!.right);
  expect(Math.abs(night!.bottom - day!.bottom)).toBeLessThanOrEqual(1);

  const light = await columnFills(grouped);
  await page.getByRole('radio', { name: 'Dark' }).check();
  const dark = await columnFills(grouped);
  expect(new Set(dark).size).toBe(2);
  expect(dark).not.toEqual(light);
  await grouped.screenshot({
    path: testInfo.outputPath('column-chart-dark.png'),
  });
});
