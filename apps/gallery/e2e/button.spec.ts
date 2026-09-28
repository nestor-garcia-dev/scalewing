import { expect, test } from '@playwright/test';

import { textContrast } from './contrast.js';

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
  const accent = await page.evaluate(() => {
    const probe = document.createElement('span');
    probe.style.color = 'var(--sw-color-accent)';
    document.querySelector('[data-theme]')?.append(probe);
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
  });
  if (forced) {
    // Box shadows drop in forced colors; the system highlight fills it.
    await expect(forest).toHaveCSS(
      'background-color',
      await page.evaluate(() => {
        const probe = document.createElement('span');
        probe.style.color = 'Highlight';
        document.body.append(probe);
        const color = getComputedStyle(probe).color;
        probe.remove();
        return color;
      }),
    );
    await expect(ocean).not.toHaveCSS(
      'background-color',
      await forest.evaluate((node) => getComputedStyle(node).backgroundColor),
    );
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
