import { expect, test } from '@playwright/test';

import { colorContrast } from './contrast.js';

test('DenominationGrid board options: four digits, plain outs, transposed on a phone', async ({
  page,
}, testInfo) => {
  await page.goto('/#denomination-grid');
  const region = page.getByRole('group', { name: 'Bird rings at the station' });
  const phone = testInfo.project.name === 'mobile-es';
  const table = region.getByRole('table', {
    name: 'Bird rings at the station',
  });
  await expect(table).toHaveClass(
    phone ? /sw-denomination-transposed/ : /sw-denomination-strip/,
  );
  // A four-digit count is whole in its box.
  const count = table.getByRole('spinbutton', { name: 'Keep on hand 1 ring' });
  await expect(count).toHaveValue('1200');
  const [scroll, client] = await count.evaluate((node: HTMLInputElement) => [
    node.scrollWidth,
    node.clientWidth,
  ]);
  expect(scroll).toBeLessThanOrEqual(client);
  // Given out is not red: the text colour, with its minus.
  const out = table.getByText('−300', { exact: true });
  const [ink, text] = await Promise.all([
    out.evaluate((node) => getComputedStyle(node).color),
    page
      .locator('[data-theme]')
      .first()
      .evaluate((node) => getComputedStyle(node).color),
  ]);
  if (testInfo.project.name !== 'forced-colors')
    expect(colorContrast(ink, text)).toBeLessThan(1.1);
  if (phone) {
    // A row per size: the first data row is the 1-ring row.
    await expect(table.getByRole('row').nth(1)).toContainText('1 ring');
    await expect(
      table.getByRole('row', { name: /Total/ }).getByRole('cell').nth(-2),
    ).toHaveText('−390');
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await region.screenshot({
    path: testInfo.outputPath('denomination-board.png'),
  });
  if (testInfo.project.name === 'forced-colors') return;
  await page.getByRole('radio', { name: 'Dark' }).check();
  await expect(page.getByRole('radio', { name: 'Dark' })).toBeChecked();
  await region.screenshot({
    path: testInfo.outputPath('denomination-board-dark.png'),
  });
});
