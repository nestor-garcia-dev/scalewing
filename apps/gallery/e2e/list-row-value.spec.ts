import { expect, test } from '@playwright/test';

import { textContrast } from './contrast.js';

test('ListRow draws a warning value and a status badge at the row end', async ({
  page,
}, testInfo) => {
  await page.goto('/#list-group');
  const station = page.getByRole('list', { name: 'Station' });
  const warning = station.getByText('2 offline');
  const den = station.getByRole('button', { name: 'Riverbank den Watched' });
  const badge = den.locator('.sw-badge');
  await expect(badge).toHaveText('Watched');
  await expect(badge).toHaveClass(/sw-badge-warning/);
  // The badge sits at the row's end, after the title.
  const [rowBox, badgeBox] = await Promise.all([
    den.boundingBox(),
    badge.boundingBox(),
  ]);
  expect(badgeBox!.x + badgeBox!.width).toBeGreaterThan(
    rowBox!.x + rowBox!.width * 0.6,
  );
  const forced = testInfo.project.name === 'forced-colors';
  if (!forced) expect(await textContrast(warning)).toBeGreaterThanOrEqual(4.5);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await station.screenshot({ path: testInfo.outputPath('list-row-value.png') });

  if (forced) return;
  await page.getByRole('radio', { name: 'Dark' }).check();
  await expect(page.getByRole('radio', { name: 'Dark' })).toBeChecked();
  expect(await textContrast(warning)).toBeGreaterThanOrEqual(4.5);
  await station.screenshot({
    path: testInfo.outputPath('list-row-value-dark.png'),
  });
});
