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
  const wide = page.getByRole('dialog', { name: 'Log a transect' });
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

test('Dialog titles with an h3 by default and an h2 at titleLevel 2, in the same style', async ({
  page,
}) => {
  await page.goto('/#dialog');
  const section = page.locator('#dialog');

  await section.getByRole('button', { name: 'Open dialog' }).click();
  const reading = page.getByRole('dialog', { name: 'How we rank' });
  const readingTitle = reading.getByRole('heading', { name: 'How we rank' });
  await expect(readingTitle).toHaveJSProperty('tagName', 'H3');
  const readingFont = await readingTitle.evaluate((node) => {
    const style = getComputedStyle(node);
    return [
      style.fontFamily,
      style.fontSize,
      style.fontWeight,
      style.letterSpacing,
      style.lineHeight,
    ];
  });
  await reading.getByRole('button', { name: 'Close' }).click();

  await section.getByRole('button', { name: 'Open wide dialog' }).click();
  const wide = page.getByRole('dialog', { name: 'Log a transect' });
  const wideTitle = wide.getByRole('heading', { level: 2 });
  await expect(wideTitle).toHaveText('Log a transect');
  // The dialog's section label is one level under its title (Teisoro CHG-13).
  await expect(wide.getByRole('heading', { level: 3 })).toHaveText(
    'Sightings per habitat',
  );
  expect(
    await wideTitle.evaluate((node) => {
      const style = getComputedStyle(node);
      return [
        style.fontFamily,
        style.fontSize,
        style.fontWeight,
        style.letterSpacing,
        style.lineHeight,
      ];
    }),
  ).toEqual(readingFont);
  await wide.getByRole('button', { name: 'Cancel' }).click();
  await expect(wide).toBeHidden();
});

test('Dialog asks onClose on Escape and stays open while the consumer is busy', async ({
  page,
}) => {
  // The demo stays busy for 1.5 s; the test owns the clock so the busy window
  // lasts exactly as long as the assertions need.
  await page.clock.install();
  await page.goto('/#dialog');
  const section = page.locator('#dialog');

  await section.getByRole('button', { name: 'Open dialog' }).click();
  const reading = page.getByRole('dialog', { name: 'How we rank' });
  await expect(reading).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(reading).toBeHidden();

  await section.getByRole('button', { name: 'Open wide dialog' }).click();
  const wide = page.getByRole('dialog', { name: 'Log a transect' });
  await expect(wide).toBeVisible();
  await wide.getByRole('button', { name: 'Record transect' }).click();
  await expect(wide.getByRole('button', { name: 'Recording…' })).toBeFocused();
  await expect(wide.getByRole('button', { name: 'Cancel' })).toBeDisabled();
  // Chromium lets a page cancel one Escape per user activation; the dialog
  // must hold through repeated presses while open stays true.
  for (let press = 0; press < 3; press += 1) {
    await page.keyboard.press('Escape');
  }
  expect(await wide.evaluate((node: HTMLDialogElement) => node.open)).toBe(
    true,
  );
  await expect(wide).toBeVisible();
  await page.clock.runFor(1500);
  await expect(wide).toBeHidden();
});
