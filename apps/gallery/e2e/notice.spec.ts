import { expect, test } from '@playwright/test';

import { textContrast } from './contrast';

test('Notice tints each tone, announces by tone, and wraps a rich message under its title', async ({
  page,
}, testInfo) => {
  await page.goto('/#notice');
  const forced = testInfo.project.name === 'forced-colors';
  if (forced) {
    await page.emulateMedia({ forcedColors: 'active' });
    expect(
      await page.evaluate(() => matchMedia('(forced-colors: active)').matches),
    ).toBe(true);
  }
  const section = page.locator('#notice');

  const saved = section
    .getByRole('status')
    .filter({ hasText: 'Survey saved.' });
  const warning = section
    .getByRole('status')
    .filter({ hasText: 'Unconfirmed sighting.' });
  const danger = section
    .getByRole('alert')
    .filter({ hasText: 'The river crossing is closed.' });
  await expect(saved).toHaveCount(1);
  await expect(warning).toHaveCount(1);
  await expect(danger).toHaveCount(1);
  // role none: a note that is part of the page is no live region.
  const due = section.locator('.sw-notice-info');
  await expect(due).not.toHaveAttribute('role');
  await expect(due.locator('.sw-notice-icon')).toHaveAttribute(
    'aria-hidden',
    'true',
  );
  await expect(due.getByRole('button', { name: 'Open the log' })).toBeVisible();

  for (const notice of [due, saved, warning, danger]) {
    for (const part of ['.sw-notice-title', '.sw-notice-body']) {
      const node = notice.locator(part);
      if ((await node.count()) === 0) continue;
      expect(await textContrast(node)).toBeGreaterThanOrEqual(4.5);
    }
    if (forced) await expect(notice).toHaveCSS('border-top-style', 'solid');
    else
      expect(
        await notice.evaluate((node) => getComputedStyle(node).backgroundColor),
      ).not.toBe('rgba(0, 0, 0, 0)');
  }

  // A short message shares the title's row on a desktop.
  const top = async (selector: string) =>
    saved
      .locator(selector)
      .evaluate((node) => node.getBoundingClientRect().top);
  if (testInfo.project.name !== 'mobile-es')
    expect(
      Math.abs(
        (await top('.sw-notice-title')) - (await top('.sw-notice-body')),
      ),
    ).toBeLessThan(4);

  // A message holding a checkbox drops under the title, and the checkbox works.
  const stacked = section.getByTestId('notice-stacked');
  const titleBox = await stacked.locator('.sw-notice-title').boundingBox();
  const bodyBox = await stacked.locator('.sw-notice-body').boundingBox();
  expect(bodyBox!.y).toBeGreaterThanOrEqual(titleBox!.y + titleBox!.height);
  const box = stacked.getByRole('checkbox', {
    name: 'I counted again and it is still short',
  });
  // A field's muted description inside takes the ink, readable on the fill.
  expect(
    await textContrast(stacked.locator('.sw-field-description')),
  ).toBeGreaterThanOrEqual(4.5);
  await stacked
    .getByRole('textbox', { name: 'Why is it short?' })
    .fill('A fox');
  await box.check();
  await expect(box).toBeChecked();

  await section.screenshot({ path: testInfo.outputPath('notice.png') });
});
