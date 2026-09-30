import { expect, test } from '@playwright/test';

import { tokenColor } from './contrast.js';

test('a toned Toast tints its border and icon and announces danger as an alert', async ({
  page,
}, testInfo) => {
  await page.goto('/#toast');
  const forced = testInfo.project.name === 'forced-colors';
  if (forced) await page.emulateMedia({ forcedColors: 'active' });
  const section = page.locator('#toast');
  const colorOf = (token: string) => tokenColor(page, token);

  // Teisoro DRW-14: every toast was the same neutral glass pill.
  await section.getByRole('button', { name: 'Save survey' }).click();
  const saved = page.getByRole('status').filter({ hasText: 'Survey saved.' });
  await expect(saved).toBeVisible();
  await expect(saved).toHaveClass(/sw-toast-success/);
  const icon = saved.locator('.sw-toast-icon');
  await expect(icon).toHaveAttribute('aria-hidden', 'true');
  if (!forced) {
    const success = await colorOf('success');
    await expect(saved).toHaveCSS('border-top-color', success);
    await expect(icon).toHaveCSS('color', success);
    // The message keeps the text color.
    await expect(saved.getByText('Survey saved.')).toHaveCSS(
      'color',
      await colorOf('text'),
    );
  }
  await saved.screenshot({ path: testInfo.outputPath('toast-success.png') });

  await section.getByRole('button', { name: 'Close the reserve log' }).click();
  const closed = page
    .getByRole('alert')
    .filter({ hasText: 'The reserve log is already closed.' });
  await expect(closed).toBeVisible();
  await expect(closed).toHaveClass(/sw-toast-danger/);
  // Past the 800 ms default: a danger toast stays 6000 ms to be read.
  await page.waitForTimeout(1500);
  await expect(closed).toBeVisible();
  if (!forced) {
    await expect(closed).toHaveCSS('border-top-color', await colorOf('danger'));
  }
  await closed.screenshot({ path: testInfo.outputPath('toast-danger.png') });
});

test('a long Toast keeps the page gutter on each side and wraps its message', async ({
  page,
}, testInfo) => {
  await page.goto('/#toast');
  if (testInfo.project.name === 'forced-colors')
    await page.emulateMedia({ forcedColors: 'active' });
  const section = page.locator('#toast');

  // Teisoro DRW-29: at 390 px the toast ran from x 1 to x 388.
  await section.getByRole('button', { name: 'Share field notes' }).click();
  const toast = page
    .getByRole('status')
    .filter({ hasText: 'Field notes from the northern wetland transect' });
  await expect(toast).toBeVisible();
  const width = await page.evaluate(() => document.documentElement.clientWidth);
  const gutter = 16;
  const box = await toast.boundingBox();
  if (!box) throw new Error('the toast has no box');
  expect(box.x).toBeGreaterThanOrEqual(gutter - 0.5);
  expect(box.x + box.width).toBeLessThanOrEqual(width - gutter + 0.5);
  // Centred: the same gutter on both sides, give or take a pixel.
  expect(Math.abs(box.x - (width - box.x - box.width))).toBeLessThanOrEqual(1);

  const message = toast.getByText('Field notes from the northern wetland');
  const lineHeight = await message.evaluate((node) =>
    Number.parseFloat(getComputedStyle(node).lineHeight),
  );
  const lines = Math.round(
    ((await message.boundingBox())?.height ?? 0) / lineHeight,
  );
  if (width < 768) {
    // On a phone the message is wider than the screen, so it wraps and the
    // toast fills the width between the gutters.
    expect(lines).toBeGreaterThan(1);
    expect(box.width).toBeCloseTo(width - 2 * gutter, 0);
  } else {
    // On a desktop it fits on one line, as wide as its words.
    expect(lines).toBe(1);
    expect(box.width).toBeLessThan(width - 2 * gutter);
  }
  await toast.screenshot({ path: testInfo.outputPath('toast-long.png') });
});
