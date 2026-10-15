import { expect, test } from '@playwright/test';

import { colorContrast } from './contrast.js';

test('a bare BarChart draws neutral and accent bars with no track or axis', async ({
  page,
}, testInfo) => {
  await page.goto('/#bar-chart');
  const chart = page
    .getByRole('list', { name: 'Owls heard by night' })
    .locator('xpath=..');
  await expect(chart).toHaveClass(/sw-bar-chart-bare/);
  await expect(chart.locator('.sw-bar-chart-axis')).toHaveCount(0);
  const track = chart.locator('.sw-bar-chart-track').first();
  await expect(track).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  const fillOf = (label: string) =>
    chart
      .locator('.sw-bar-chart-row', { hasText: label })
      .locator('.sw-bar-chart-fill')
      .evaluate((node) => getComputedStyle(node).backgroundColor);
  const card = chart.locator(
    'xpath=ancestor::*[contains(@class, "sw-card")][1]',
  );
  const forced = testInfo.project.name === 'forced-colors';
  const check = async () => {
    const [usual, busiest, surface] = await Promise.all([
      fillOf('Mon'),
      fillOf('Sat'),
      card.evaluate((node) => getComputedStyle(node).backgroundColor),
    ]);
    if (forced) return;
    expect(usual).not.toBe(busiest);
    // Only the opaque light card is a fair backdrop to measure against.
    if (!surface.includes('rgba')) {
      expect(colorContrast(usual, surface)).toBeGreaterThanOrEqual(3);
      expect(colorContrast(busiest, surface)).toBeGreaterThanOrEqual(3);
    }
  };
  await check();
  if (forced) {
    // No edge either: the track's border is the canvas colour.
    const [edge, canvas] = await Promise.all([
      track.evaluate((node) => getComputedStyle(node).borderTopColor),
      card.evaluate((node) => getComputedStyle(node).backgroundColor),
    ]);
    // Chromium reports the forced edge either as the canvas colour (the
    // Canvas rule applied) or, in a screenshot-only emulation, as fully
    // transparent; both draw no line, unlike a forced black edge.
    expect(edge === canvas || /, 0\)$/.test(edge)).toBe(true);
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await card.screenshot({ path: testInfo.outputPath('bar-chart-bare.png') });
  if (forced) return;
  await page.getByRole('radio', { name: 'Dark' }).check();
  await expect(page.getByRole('radio', { name: 'Dark' })).toBeChecked();
  await check();
  await card.screenshot({
    path: testInfo.outputPath('bar-chart-bare-dark.png'),
  });
});
