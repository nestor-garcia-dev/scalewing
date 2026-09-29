import { expect, test } from '@playwright/test';

import {
  paintedTextContrast,
  systemColor,
  textContrast,
  tokenColor,
} from './contrast.js';

test('a toggle Button shows pressed with an accent ring and keeps an unpressed label at full contrast', async ({
  page,
}, testInfo) => {
  await page.goto('/#button');
  const forced = testInfo.project.name === 'forced-colors';
  if (forced) await page.emulateMedia({ forcedColors: 'active' });
  const group = page
    .locator('#button')
    .getByRole('group', { name: 'Preferred habitat' });
  const forest = group.getByRole('button', { name: 'Forest' });
  const ocean = group.getByRole('button', { name: 'Ocean' });
  await expect(forest).toHaveAttribute('aria-pressed', 'true');
  await expect(ocean).toHaveAttribute('aria-pressed', 'false');

  // Teisoro NSF-1 (WCAG 1.4.3): no fade on the unpressed button.
  await expect(ocean).toHaveCSS('opacity', '1');
  expect(await textContrast(ocean)).toBeGreaterThanOrEqual(4.5);
  expect(await textContrast(forest)).toBeGreaterThanOrEqual(4.5);

  const shadowOf = (locator: typeof forest) =>
    locator.evaluate((node) => getComputedStyle(node).boxShadow);
  const accent = await tokenColor(page, 'accent');
  if (forced) {
    // Box shadows drop in forced colors. The pressed button keeps the
    // forced button colors and draws the same ring as a Highlight border on
    // its ::after; its own border turns Highlight too.
    const highlight = await systemColor(page, 'Highlight');
    const ringOf = (locator: typeof forest) =>
      locator.evaluate((node) => {
        const ring = getComputedStyle(node, '::after');
        return {
          content: ring.content,
          color: ring.borderTopColor,
          style: ring.borderTopStyle,
          width: ring.borderTopWidth,
        };
      });
    expect(await ringOf(forest)).toEqual({
      content: '""',
      color: highlight,
      style: 'solid',
      width: '2px',
    });
    expect((await ringOf(ocean)).content).toBe('none');
    await expect(forest).toHaveCSS('border-top-color', highlight);
    await expect(ocean).not.toHaveCSS('border-top-color', highlight);
  } else {
    // The ring sits outside the fill, past a gap: two outset shadows, the
    // outer one accent (review of PR #73: an inset ring vanished on fills).
    const pressed = await shadowOf(forest);
    expect(pressed).not.toContain('inset');
    expect(pressed).toContain(`${accent} 0px 0px 0px 4px`);
    expect(await shadowOf(ocean)).toBe('none');
    // On a primary fill too, where an inset ring could not be seen.
    const day = page
      .locator('#button')
      .getByRole('group', { name: 'Survey shift' })
      .getByRole('button', { name: 'Day' });
    await expect(day).toHaveAttribute('aria-pressed', 'true');
    await expect(day).toHaveClass(/sw-button-primary/);
    expect(await shadowOf(day)).toContain(`${accent} 0px 0px 0px 4px`);
  }

  // A focused pressed button keeps its focus outline clear of the ring.
  await forest.focus();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Tab');
  await expect(forest).toBeFocused();
  await expect(forest).toHaveCSS('outline-offset', '6px');
  await expect(ocean).not.toHaveCSS('outline-offset', '6px');

  await ocean.click();
  await expect(ocean).toHaveAttribute('aria-pressed', 'true');
  await expect(forest).toHaveAttribute('aria-pressed', 'false');
  await expect(forest).toHaveCSS('opacity', '1');
  await group.screenshot({ path: testInfo.outputPath('button-toggle.png') });
});

test('a pressed toggle Button keeps its label readable in forced colors', async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== 'forced-colors',
    'Forced colors only: the painted backplate exists only there.',
  );
  await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/#button');
  expect(
    await page.evaluate(() => matchMedia('(forced-colors: active)').matches),
  ).toBe(true);
  // 1.12.0 drew the label in HighlightText on a Highlight fill, and Chromium
  // paints the forced backplate behind a button's text in Canvas: the label
  // was invisible (1.00:1 measured on the pixels, 11:1 by computed colors).
  const section = page.locator('#button');
  const forest = section
    .getByRole('group', { name: 'Preferred habitat' })
    .getByRole('button', { name: 'Forest' });
  const day = section
    .getByRole('group', { name: 'Survey shift' })
    .getByRole('button', { name: 'Day' });
  for (const pressed of [forest, day]) {
    await expect(pressed).toHaveAttribute('aria-pressed', 'true');
    // Not transparent, not HighlightText on a Canvas backplate.
    expect(
      await pressed.evaluate((node) => getComputedStyle(node).color),
    ).not.toMatch(/rgba\(.*, 0\)|transparent/);
    expect(await paintedTextContrast(pressed)).toBeGreaterThanOrEqual(4.5);
  }
  // A label and badge in their own elements, as Teisoro's party rows are.
  await page.goto('/#badge');
  const marsh = page
    .locator('#badge')
    .getByRole('group', { name: 'Nesting site' })
    .locator("[aria-pressed='true']");
  expect(
    await paintedTextContrast(marsh.locator('span').first()),
  ).toBeGreaterThanOrEqual(4.5);
  expect(
    await paintedTextContrast(marsh.locator('.sw-badge')),
  ).toBeGreaterThanOrEqual(4.5);
  await section
    .page()
    .locator('#badge')
    .screenshot({
      path: testInfo.outputPath('button-pressed-forced-colors.png'),
    });
});
