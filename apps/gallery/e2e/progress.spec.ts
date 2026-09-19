import { expect, test } from '@playwright/test';

test('Progress presents zero, partial, and complete measured values', async ({
  page,
}, testInfo) => {
  await page.goto('/#progress');
  if (testInfo.project.name === 'forced-colors') {
    await page.emulateMedia({ forcedColors: 'active' });
    expect(
      await page.evaluate(() => matchMedia('(forced-colors: active)').matches),
    ).toBe(true);
  }
  const section = page.locator('#progress');
  const zero = section.getByRole('progressbar', { name: 'Habitats surveyed' });
  const partial = section.getByRole('progressbar', {
    name: 'Field guides reviewed',
  });
  const complete = section.getByRole('progressbar', {
    name: 'Species records checked',
  });

  await expect(zero).toHaveAttribute('value', '0');
  await expect(partial).toHaveAttribute('value', '2');
  await expect(complete).toHaveAttribute('value', '4');
  for (const bar of [zero, partial, complete]) {
    await expect(bar).toHaveAttribute('max', '4');
    await expect(bar).toHaveCSS('animation-name', 'none');
  }
  await expect(section.getByText('0 / 4')).toBeVisible();
  await expect(section.getByText('2 / 4')).toBeVisible();
  await expect(section.getByText('4 / 4')).toBeVisible();
  await section.screenshot({ path: testInfo.outputPath('progress.png') });
});
