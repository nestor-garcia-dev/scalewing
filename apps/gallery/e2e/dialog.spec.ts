import { expect, test } from '@playwright/test';

test('Dialog keeps the reading width by default and widens at size lg', async ({
  page,
}, testInfo) => {
  await page.goto('/#dialog');
  const section = page.locator('#dialog');
  const isPhone = testInfo.project.name === 'mobile-es';
  const rem = await page.evaluate(() =>
    parseFloat(getComputedStyle(document.documentElement).fontSize),
  );

  await section.getByRole('button', { name: 'Open dialog' }).click();
  const reading = page.getByRole('dialog', { name: 'How we rank' });
  await expect(reading).toBeVisible();
  const readingBox = await reading.boundingBox();
  expect(readingBox).not.toBeNull();
  await page.screenshot({ path: testInfo.outputPath('dialog-md.png') });
  await reading.getByRole('button', { name: 'Close' }).click();
  await expect(reading).toBeHidden();

  await section.getByRole('button', { name: 'Open wide dialog' }).click();
  const wide = page.getByRole('dialog', { name: 'Count the till' });
  await expect(wide).toBeVisible();
  const wideBox = await wide.boundingBox();
  expect(wideBox).not.toBeNull();
  const fields = wide.getByRole('textbox');
  await expect(fields).toHaveCount(6);
  const first = await fields.nth(0).boundingBox();
  const last = await fields.nth(5).boundingBox();
  expect(first).not.toBeNull();
  expect(last).not.toBeNull();
  await page.screenshot({ path: testInfo.outputPath('dialog-lg.png') });

  if (isPhone) {
    // Both sizes fill the phone width minus the gutter; six fields fold to two per row.
    expect(
      Math.abs((readingBox?.width ?? 0) - (wideBox?.width ?? 0)),
    ).toBeLessThan(2);
    expect(last?.y ?? 0).toBeGreaterThan(first?.y ?? 0);
  } else {
    expect(readingBox?.width ?? 0).toBeLessThanOrEqual(32 * rem + 1);
    expect(wideBox?.width ?? 0).toBeGreaterThan(32 * rem + 1);
    expect(wideBox?.width ?? 0).toBeLessThanOrEqual(56 * rem + 1);
    // The six fields share one row at the large size.
    expect(Math.abs((last?.y ?? 0) - (first?.y ?? 0))).toBeLessThan(2);
  }
  await wide.getByRole('button', { name: 'Cancel' }).click();
  await expect(wide).toBeHidden();
});
