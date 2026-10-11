import { expect, test } from '@playwright/test';

import { systemColor, textContrast, tokenColor } from './contrast.js';

test('Nav appearance words: muted words, the current one bold, no fill', async ({
  page,
}, testInfo) => {
  await page.goto('/#nav');
  const forced = testInfo.project.name === 'forced-colors';
  if (forced) await page.emulateMedia({ forcedColors: 'active' });
  const nav = page.getByRole('navigation', { name: 'Field stations' });
  const forest = nav.getByRole('button', { name: 'Forest' });
  const wetland = nav.getByRole('button', { name: 'Wetland' });
  const coast = nav.getByRole('button', { name: /Coast/ });
  const glacier = nav.getByRole('button', { name: 'Glacier' });
  const log = nav.getByRole('link', { name: 'Field log' });
  await expect(forest).toHaveAttribute('aria-current', 'page');
  await expect(forest).toHaveCSS('font-weight', '600');
  await expect(wetland).toHaveCSS('font-weight', '500');
  await expect(log).toHaveCSS('font-weight', '500');
  await expect(log).toHaveCSS('text-decoration-line', 'none');
  await expect(glacier).toBeDisabled();
  if (forced) {
    await expect(forest).toHaveCSS('text-decoration-line', 'underline');
    await expect(forest).toHaveCSS(
      'border-top-color',
      await systemColor(page, 'Highlight'),
    );
  } else {
    await expect(forest).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await expect(forest).toHaveCSS('color', await tokenColor(page, 'text'));
    const muted = await tokenColor(page, 'muted');
    await expect(wetland).toHaveCSS('color', muted);
    await expect(log).toHaveCSS('color', muted);
    await expect(coast).toHaveCSS('color', muted);
    expect(await textContrast(wetland)).toBeGreaterThanOrEqual(4.5);
  }
  // The destination in a Tooltip takes the words look and the current mark.
  await coast.click();
  await expect(coast).toHaveAttribute('aria-current', 'page');
  await expect(coast).toHaveCSS('font-weight', '600');
  await expect(forest).not.toHaveAttribute('aria-current', 'page');
});
