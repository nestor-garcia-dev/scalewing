import { expect, test } from '@playwright/test';

import { tokenColor } from './contrast.js';

test('a programmatic focus target takes the accent ring round the whole card', async ({
  page,
}, testInfo) => {
  await page.goto('/#canvas');
  const forced = testInfo.project.name === 'forced-colors';
  if (forced) await page.emulateMedia({ forcedColors: 'active' });
  const section = page.locator('#canvas');
  const save = section.getByRole('button', { name: 'Save den notes' });
  const notice = section.getByRole('status').filter({
    hasText: 'Den notes saved for the red fox burrow.',
  });

  // From the keyboard, as in Teisoro's journeys: the notice takes focus and
  // shows a ring, as the browser's own heuristic decides (:focus-visible).
  await save.focus();
  await page.keyboard.press('Enter');
  await expect(notice).toBeFocused();
  // Teisoro NSF-34 (and ENT-29, DRW-30): the browser's 0,95,204 outline,
  // not the accent ring every other focused control shows.
  await expect(notice).toHaveCSS('outline-style', 'solid');
  await expect(notice).toHaveCSS('outline-width', '2px');
  await expect(notice).toHaveCSS('outline-offset', '2px');
  if (!forced) {
    await expect(notice).toHaveCSS(
      'outline-color',
      await tokenColor(page, 'accent'),
    );
  }
  // The ring goes round the whole card, following its radius.
  const card = notice.locator('.sw-card');
  const [noticeBox, cardBox] = await Promise.all([
    notice.boundingBox(),
    card.boundingBox(),
  ]);
  expect(noticeBox).toEqual(cardBox);
  const [noticeRadius, cardRadius] = await Promise.all([
    notice.evaluate((node) => getComputedStyle(node).borderTopLeftRadius),
    card.evaluate((node) => getComputedStyle(node).borderTopLeftRadius),
  ]);
  expect(noticeRadius).toBe(cardRadius);
  await section.screenshot({
    path: testInfo.outputPath('focus-target-keyboard.png'),
  });

  // From a mouse press the browser shows no ring, and neither does the canvas.
  await section.getByRole('button', { name: 'Clear' }).click();
  await expect(notice).toHaveCount(0);
  await save.click();
  await expect(notice).toBeFocused();
  await expect(notice).toHaveCSS('outline-style', 'none');
});
