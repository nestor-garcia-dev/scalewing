import { expect, test } from '@playwright/test';

import { colorContrast } from './contrast.js';

test('a trailing success Switch ends its row with the control, green while on', async ({
  page,
}, testInfo) => {
  await page.goto('/#switch');
  const logged = page.getByRole('switch', { name: 'Who logged it' });
  const row = logged.locator('xpath=ancestor::label[1]');
  const label = row.locator('.sw-switch-label');
  const track = row.locator('.sw-switch-track');
  const [rowBox, labelBox, trackBox] = await Promise.all([
    row.boundingBox(),
    label.boundingBox(),
    track.boundingBox(),
  ]);
  // The words first, the control at the row's end.
  expect(labelBox!.x).toBeLessThan(trackBox!.x);
  expect(
    Math.round(rowBox!.x + rowBox!.width - (trackBox!.x + trackBox!.width)),
  ).toBeLessThanOrEqual(1);
  const forced = testInfo.project.name === 'forced-colors';
  const fillOf = () =>
    track.evaluate((node) => getComputedStyle(node).backgroundColor);
  const success = await fillOf();
  // "Number the observers" starts off: toggling it on turns its track from the
  // off fill to the success fill (Highlight in forced colours).
  const numbered = page.getByRole('switch', { name: 'Number the observers' });
  const numberedTrack = numbered.locator(
    'xpath=following-sibling::*[contains(@class,"sw-switch-track")][1]',
  );
  const numberedFill = () =>
    numberedTrack.evaluate((node) => getComputedStyle(node).backgroundColor);
  const offFill = await numberedFill();
  await numbered.focus();
  await page.keyboard.press('Space');
  await expect(numbered).toBeChecked();
  const onFill = await numberedFill();
  expect(onFill).not.toBe(offFill);
  if (!forced) expect(onFill).toBe(success);
  const card = row.locator('xpath=ancestor::*[contains(@class,"sw-card")][1]');
  const surfaceOf = () =>
    card.evaluate((node) => getComputedStyle(node).backgroundColor);
  if (!forced) {
    expect(colorContrast(success, await surfaceOf())).toBeGreaterThanOrEqual(3);
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await card.screenshot({ path: testInfo.outputPath('switch-trailing.png') });
  if (forced) return;
  await page.getByRole('radio', { name: 'Dark' }).check();
  await expect(page.getByRole('radio', { name: 'Dark' })).toBeChecked();
  const darkSuccess = await fillOf();
  expect(darkSuccess).not.toBe(success);
  expect(colorContrast(darkSuccess, await surfaceOf())).toBeGreaterThanOrEqual(
    3,
  );
  await card.screenshot({
    path: testInfo.outputPath('switch-trailing-dark.png'),
  });
});
