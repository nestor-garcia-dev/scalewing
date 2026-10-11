import { expect, test } from '@playwright/test';

import { systemColor, tokenColor } from './contrast.js';

test('a banded Dialog draws its title row and footer as bands on the solid surface', async ({
  page,
}, testInfo) => {
  await page.goto('/#dialog');
  const forced = testInfo.project.name === 'forced-colors';
  if (forced) await page.emulateMedia({ forcedColors: 'active' });
  await page
    .locator('#dialog')
    .getByRole('button', { name: 'Move herons to the pond' })
    .click();
  const dialog = page.getByRole('dialog', { name: 'Move herons to the pond' });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAccessibleDescription(
    'The same herons leave the river count.',
  );

  if (!forced) {
    await expect(dialog).toHaveCSS(
      'background-color',
      await tokenColor(page, 'surface'),
    );
    await expect(dialog).toHaveCSS('backdrop-filter', 'none');
  }

  // A phone's sheet slides up: measure where it comes to rest.
  await dialog.evaluate((node) =>
    Promise.all(node.getAnimations().map((animation) => animation.finished)),
  );

  // The title row is a band flush with the dialog's top and side edges,
  // ruled off by a hairline; the footer is one at the bottom.
  const box = (await dialog.boundingBox())!;
  const header = dialog.locator('.sw-dialog-header');
  const band = (await header.boundingBox())!;
  const edge = forced ? 1 : 0;
  expect(Math.abs(band.x - box.x)).toBeLessThanOrEqual(edge + 1);
  expect(
    Math.abs(band.x + band.width - (box.x + box.width)),
  ).toBeLessThanOrEqual(edge + 1);
  expect(Math.abs(band.y - box.y)).toBeLessThanOrEqual(edge + 1);
  await expect(header).toHaveCSS('border-bottom-width', '1px');
  await expect(header).toHaveCSS(
    'border-bottom-color',
    forced
      ? await systemColor(page, 'CanvasText')
      : await tokenColor(page, 'border'),
  );
  const footer = dialog.locator('.sw-dialog-footer');
  await expect(footer).toHaveCSS('border-top-width', '1px');

  // The close button: a circle on a quiet fill, still the named first control.
  const close = dialog.getByRole('button', { name: 'Close' });
  const circle = (await close.boundingBox())!;
  expect(Math.round(circle.width)).toBe(Math.round(circle.height));
  if (!forced)
    expect(
      await close.evaluate((node) => {
        const probe = document.createElement('span');
        probe.style.backgroundColor =
          'color-mix(in srgb, var(--sw-color-muted) 16%, transparent)';
        node.parentElement!.append(probe);
        const fill = getComputedStyle(probe).backgroundColor;
        probe.remove();
        return getComputedStyle(node).backgroundColor === fill;
      }),
    ).toBe(true);
  // The circle sits inside the band.
  expect(circle.y).toBeGreaterThanOrEqual(band.y);
  expect(circle.y + circle.height).toBeLessThanOrEqual(band.y + band.height);

  // The band stays at the top while the content scrolls under it.
  await page.setViewportSize({
    width: page.viewportSize()!.width,
    height: 360,
  });
  await dialog.evaluate((node) => {
    node.scrollTop = node.scrollHeight;
  });
  expect(await dialog.evaluate((node) => node.scrollTop)).toBeGreaterThan(0);
  const scrolled = (await dialog.boundingBox())!;
  const stuck = (await header.boundingBox())!;
  expect(Math.abs(stuck.y - scrolled.y)).toBeLessThanOrEqual(edge + 1);

  await close.click();
  await expect(dialog).toBeHidden();
});

test('a banded Dialog keeps its bands on the surface in the dark scheme', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === 'forced-colors');
  await page.goto('/#dialog');
  await page
    .getByRole('radiogroup', { name: 'Color scheme' })
    .getByRole('radio', { name: 'Dark' })
    .check();
  await page
    .locator('#dialog')
    .getByRole('button', { name: 'Move herons to the pond' })
    .click();
  const dialog = page.getByRole('dialog', { name: 'Move herons to the pond' });
  await expect(dialog).toBeVisible();
  const surface = await tokenColor(page, 'surface');
  await expect(dialog).toHaveCSS('background-color', surface);
  await expect(dialog.locator('.sw-dialog-header')).toHaveCSS(
    'background-color',
    surface,
  );
});
