import { expect, test } from '@playwright/test';

import { colorContrast } from './contrast.js';

const fill = (element: Element) => getComputedStyle(element).backgroundColor;

test('the grouped canvas sets white cards apart on a quiet grey, light and dark', async ({
  page,
}, testInfo) => {
  await page.goto('/#canvas');
  const grouped = page.locator('#canvas [data-canvas="grouped"]');
  const card = grouped.locator('.sw-card').first();
  await expect(card).toContainText('North colony');
  const forced = testInfo.project.name === 'forced-colors';

  const page_ = await page.locator('[data-theme]').first().evaluate(fill);
  const groupedFill = await grouped.evaluate(fill);
  const cardFill = await card.evaluate(fill);
  if (!forced) {
    // Light: a grey a step off the page's white, under white cards.
    expect(groupedFill).not.toBe(page_);
    expect(colorContrast(cardFill, groupedFill)).toBeGreaterThan(1.04);
    const muted = await grouped
      .getByText('6 nights counted')
      .evaluate((node) => getComputedStyle(node).color);
    expect(colorContrast(muted, groupedFill)).toBeGreaterThanOrEqual(4.5);
  }
  // Nothing on a phone scrolls the page sideways.
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await grouped.screenshot({ path: testInfo.outputPath('canvas-grouped.png') });

  if (forced) return;
  // Dark: the background itself, already darker than the cards on it.
  await page.getByRole('radio', { name: 'Dark' }).check();
  await expect(page.getByRole('radio', { name: 'Dark' })).toBeChecked();
  const darkPage = await page.locator('[data-theme]').first().evaluate(fill);
  await expect.poll(() => grouped.evaluate(fill)).toBe(darkPage);
  expect(
    colorContrast(await card.evaluate(fill), await grouped.evaluate(fill)),
  ).toBeGreaterThan(1.1);
  await grouped.screenshot({
    path: testInfo.outputPath('canvas-grouped-dark.png'),
  });
});
