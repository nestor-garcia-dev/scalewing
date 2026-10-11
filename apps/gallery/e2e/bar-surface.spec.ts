import { expect, test } from '@playwright/test';

import { systemColor, tokenColor } from './contrast.js';

test('AppHeader bar and a Box border bottom: full-width bands with a hairline under them', async ({
  page,
}, testInfo) => {
  await page.goto('/#app-header');
  const forced = testInfo.project.name === 'forced-colors';
  if (forced) await page.emulateMedia({ forcedColors: 'active' });
  const header = page
    .locator('header.sw-app-header-bar')
    .filter({ hasText: 'Field station' });
  const sub = page.getByRole('navigation', { name: 'Herd sections' });
  const hairline = forced
    ? await systemColor(page, 'CanvasText')
    : await tokenColor(page, 'border');
  for (const band of [header, sub]) {
    await expect(band).toHaveCSS('border-bottom-width', '1px');
    await expect(band).toHaveCSS('border-top-width', '0px');
    await expect(band).toHaveCSS('border-left-width', '0px');
    await expect(band).toHaveCSS('border-top-left-radius', '0px');
    await expect(band).toHaveCSS('border-bottom-color', hairline);
  }
  if (!forced) {
    const surface = await tokenColor(page, 'surface');
    await expect(header).toHaveCSS('background-color', surface);
    await expect(header).toHaveCSS('backdrop-filter', 'none');
    await expect(sub).toHaveCSS('background-color', surface);
  }
  // The two bands meet: the sub-bar starts where the header ends.
  const top = (await header.boundingBox())!;
  const below = (await sub.boundingBox())!;
  expect(Math.abs(top.y + top.height - below.y)).toBeLessThanOrEqual(1);
  expect(Math.abs(top.width - below.width)).toBeLessThanOrEqual(1);
});
