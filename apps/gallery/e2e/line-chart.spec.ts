import { expect, type Locator, type Page, test } from '@playwright/test';

import { systemColor, tokenColor } from './contrast.js';

const roost = 'Birds roosting at the reserve each night';
const phone = 'Birds roosting, on a phone';

function chartNamed(page: Page, name: string): Locator {
  return page.locator('.sw-chart', {
    has: page.getByRole('table', { name }),
  });
}

test('LineChart draws a value by date, read from a hidden table, and fits its width', async ({
  page,
}, testInfo) => {
  const forced = testInfo.project.name === 'forced-colors';
  if (forced) await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/#line-chart');
  const table = page.getByRole('table', { name: roost });
  const chart = chartNamed(page, roost);
  await chart.scrollIntoViewIfNeeded();

  // Every night is a row; the boxed week's seven are current; a night a
  // flock left names it in the markers column.
  await expect(table.getByRole('row')).toHaveCount(79);
  await expect(table.locator('tr[aria-current="true"]')).toHaveCount(7);
  await expect(
    table.getByRole('columnheader', { name: 'A flock left' }),
  ).toHaveCount(1);
  await expect(table.getByRole('row', { name: /^Aug 13 / })).toContainText(
    '2600',
  );
  await expect(chart.locator('svg')).toHaveAttribute('aria-hidden', 'true');

  // The hidden table does not widen the page.
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - innerWidth,
    ),
  ).toBeLessThanOrEqual(0);

  const fit = await chart.evaluate((node) => ({
    box: node.getBoundingClientRect().width,
    svg: node.querySelector('svg')!.getBoundingClientRect().width,
    overflow: node.scrollWidth - node.clientWidth,
  }));
  expect(Math.abs(fit.svg - fit.box)).toBeLessThanOrEqual(1);
  expect(fit.overflow).toBeLessThanOrEqual(0);

  // Seven markers, each a triangle pointing down.
  const triangles = chart.locator('polygon.sw-chart-marker');
  await expect(triangles).toHaveCount(7);
  const tip = await triangles.first().evaluate((node) => {
    const [a, b, c] = (node as SVGPolygonElement)
      .getAttribute('points')!
      .split(' ')
      .map((pair) => pair.split(',').map(Number));
    return { tipBelow: c![1]! > a![1]! && a![1] === b![1] };
  });
  expect(tip.tipBelow).toBe(true);

  const stroke = await chart
    .locator('.sw-chart-line')
    .evaluate((node) => getComputedStyle(node).stroke);
  const marker = await triangles
    .first()
    .evaluate((node) => getComputedStyle(node).fill);
  if (forced) {
    expect(stroke).toBe(await systemColor(page, 'Highlight'));
    expect(marker).toBe(await systemColor(page, 'CanvasText'));
  } else {
    expect(stroke).toBe(await tokenColor(page, 'accent'));
    expect(marker).toBe(await tokenColor(page, 'warning'));
  }
  await chart.screenshot({ path: testInfo.outputPath('line-chart.png') });
});

test('LineChart at a phone width labels fewer dates, ending on the last', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-en');
  await page.goto('/#line-chart');
  const wide = chartNamed(page, roost);
  const narrow = chartNamed(page, phone);
  await narrow.scrollIntoViewIfNeeded();
  expect(
    await narrow.evaluate((node) => node.getBoundingClientRect().width),
  ).toBeLessThanOrEqual(360);
  const narrowDates = narrow.locator('.sw-chart-category');
  expect(await narrowDates.count()).toBeLessThan(
    await wide.locator('.sw-chart-category').count(),
  );
  await expect(narrowDates.last()).toHaveText('Oct 12');
  await narrow.screenshot({
    path: testInfo.outputPath('line-chart-phone.png'),
  });
});

test('LineChart steps a value that changes on a day, in its own tone, in dark too', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === 'forced-colors');
  await page.goto('/#line-chart');
  const steps = chartNamed(page, 'Nest boxes lent to other reserves');
  await steps.scrollIntoViewIfNeeded();
  // Every segment of a step line is level or upright.
  const level = await steps.locator('.sw-chart-line').evaluate((node) => {
    const points = (node as SVGPolylineElement)
      .getAttribute('points')!
      .split(' ')
      .map((pair) => pair.split(',').map(Number));
    return points
      .slice(1)
      .every(
        ([x, y], index) => x === points[index]![0] || y === points[index]![1],
      );
  });
  expect(level).toBe(true);
  await expect(steps.locator('.sw-chart-end-label')).toHaveCount(0);
  const light = await steps
    .locator('.sw-chart-line')
    .evaluate((node) => getComputedStyle(node).stroke);
  expect(light).toBe(await tokenColor(page, 'warning'));
  await page.getByRole('radio', { name: 'Dark' }).check();
  const dark = await steps
    .locator('.sw-chart-line')
    .evaluate((node) => getComputedStyle(node).stroke);
  expect(dark).toBe(await tokenColor(page, 'warning'));
  expect(dark).not.toBe(light);
  await chartNamed(page, roost).screenshot({
    path: testInfo.outputPath('line-chart-dark.png'),
  });
});
