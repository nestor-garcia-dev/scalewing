import { expect, test } from '@playwright/test';

import { systemColor, tokenColor } from './contrast.js';

test('ActionMenu text trigger: words and a chevron, no outline, the quiet fill while open', async ({
  page,
}, testInfo) => {
  await page.goto('/#action-menu');
  const forced = testInfo.project.name === 'forced-colors';
  if (forced) await page.emulateMedia({ forcedColors: 'active' });
  const trigger = page.getByRole('button', {
    name: 'Ranger account, Ada Okafor',
  });
  await expect(trigger).toHaveText('Ada Okafor');
  if (forced) {
    // The kept border is drawn, so the trigger still reads as a control.
    await expect(trigger).toHaveCSS('border-top-style', 'solid');
    await expect(trigger).not.toHaveCSS('border-top-color', 'rgba(0, 0, 0, 0)');
    expect(
      await trigger.evaluate(
        (node) => getComputedStyle(node, '::after').borderBottomColor,
      ),
    ).toBe(await systemColor(page, 'CanvasText'));
  } else {
    await expect(trigger).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await expect(trigger).toHaveCSS('border-top-color', 'rgba(0, 0, 0, 0)');
    await expect(trigger).toHaveCSS('color', await tokenColor(page, 'text'));
  }
  expect(
    await trigger.evaluate(
      (node) => getComputedStyle(node, '::after').borderBottomWidth,
    ),
  ).toBe('2px');
  const box = (await trigger.boundingBox())!;
  expect(Math.round(box.height)).toBeGreaterThanOrEqual(
    testInfo.project.name === 'mobile-es' ? 44 : 32,
  );
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  if (!forced)
    await expect(trigger).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await page.getByRole('menuitem', { name: 'Sign out of the station' }).click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(trigger).toBeFocused();
  // A keyboard focus draws the accent ring.
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Tab');
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveCSS('outline-style', 'solid');
  // A disabled text trigger is faded and inert.
  await expect(
    page.getByRole('button', { name: 'Ranger account, signed out' }),
  ).toBeDisabled();
});

test('ActionMenu icon trigger: the glyph alone in a round quiet button, no chevron', async ({
  page,
}, testInfo) => {
  await page.goto('/#action-menu');
  const forced = testInfo.project.name === 'forced-colors';
  if (forced) await page.emulateMedia({ forcedColors: 'active' });
  const trigger = page.getByRole('button', { name: 'More for Owl box 4' });
  await expect(trigger).toHaveText('');
  // No chevron: nothing is drawn after the glyph.
  expect(
    await trigger.evaluate((node) => getComputedStyle(node, '::after').content),
  ).toBe('none');
  const box = (await trigger.boundingBox())!;
  const side = testInfo.project.name === 'mobile-es' ? 44 : 32;
  expect(Math.round(box.width)).toBe(side);
  expect(Math.round(box.height)).toBe(side);
  if (forced) {
    // The kept border is drawn, so the trigger still reads as a control.
    await expect(trigger).toHaveCSS('border-top-style', 'solid');
    await expect(trigger).not.toHaveCSS('border-top-color', 'rgba(0, 0, 0, 0)');
  } else {
    await expect(trigger).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await expect(trigger).toHaveCSS('border-top-color', 'rgba(0, 0, 0, 0)');
    await expect(trigger).toHaveCSS('color', await tokenColor(page, 'muted'));
    // Round: the pill radius on a square.
    expect(
      Number.parseFloat(
        await trigger.evaluate(
          (node) => getComputedStyle(node).borderTopLeftRadius,
        ),
      ),
    ).toBeGreaterThanOrEqual(side / 2);
  }
  if (testInfo.project.name === 'desktop-en') {
    // A hovering pointer gets the quiet fill and the text colour.
    await trigger.hover();
    await expect(trigger).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await expect(trigger).toHaveCSS('color', await tokenColor(page, 'text'));
    await page.mouse.move(0, 0);
  }
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  if (!forced) {
    await expect(trigger).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await expect(trigger).toHaveCSS('color', await tokenColor(page, 'text'));
  }
  await trigger.screenshot({
    path: testInfo.outputPath('action-menu-icon-open.png'),
  });
  await page.getByRole('menuitem', { name: 'Open' }).click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(trigger).toBeFocused();
  await expect(page.locator('#action-menu')).toContainText('Open Owl box 4');

  // A disabled icon trigger is faded, inert and takes no fill under a pointer.
  const unavailable = page.getByRole('button', {
    name: 'More for Owl box 5, unavailable',
  });
  await expect(unavailable).toBeDisabled();
  await expect(unavailable).toHaveCSS('opacity', '0.5');
  if (testInfo.project.name === 'desktop-en') {
    await unavailable.hover({ force: true });
    await expect(unavailable).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  }
});
