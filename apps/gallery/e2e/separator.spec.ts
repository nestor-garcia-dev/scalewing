import { expect, test } from '@playwright/test';

test('Separator exposes semantic orientation and decorative mode with token colors', async ({
  page,
}, testInfo) => {
  await page.goto('/#separator');
  if (testInfo.project.name === 'forced-colors') {
    await page.emulateMedia({ forcedColors: 'active' });
    expect(
      await page.evaluate(() => matchMedia('(forced-colors: active)').matches),
    ).toBe(true);
  }
  const section = page.locator('#separator');
  const semantic = section.getByRole('separator');
  await expect(semantic).toHaveCount(2);
  await expect(semantic.nth(0)).toHaveAttribute(
    'aria-orientation',
    'horizontal',
  );
  await expect(semantic.nth(1)).toHaveAttribute('aria-orientation', 'vertical');
  await expect(semantic.nth(0)).toHaveCSS('height', '1px');
  await expect(semantic.nth(1)).toHaveCSS('width', '1px');
  await expect(
    section.locator('.sw-separator[aria-hidden="true"]'),
  ).toHaveCount(1);
  const lightColor = await semantic
    .nth(0)
    .evaluate((element) => getComputedStyle(element).backgroundColor);
  await section.screenshot({
    path: testInfo.outputPath('separator-light.png'),
  });
  if (testInfo.project.name !== 'forced-colors') {
    await page.getByRole('radio', { name: 'Dark' }).check();
    await expect(page.getByRole('radio', { name: 'Dark' })).toBeChecked();
    const darkColor = await semantic
      .nth(0)
      .evaluate((element) => getComputedStyle(element).backgroundColor);
    expect(darkColor).not.toBe(lightColor);
    await section.screenshot({
      path: testInfo.outputPath('separator-dark.png'),
    });
  }
});
