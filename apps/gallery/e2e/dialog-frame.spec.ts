import { expect, test } from '@playwright/test';

test('a wide Dialog has a header with icon and description and a pinned footer with a live figure', async ({
  page,
}, testInfo) => {
  await page.goto('/#dialog');
  if (testInfo.project.name === 'forced-colors')
    await page.emulateMedia({ forcedColors: 'active' });
  await page
    .locator('#dialog')
    .getByRole('button', { name: 'Move herons to the lake' })
    .click();
  const dialog = page.getByRole('dialog', { name: 'Move herons to the lake' });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAccessibleDescription(
    'The same herons leave the river count.',
  );
  await expect(dialog.locator('.sw-dialog-icon')).toHaveAttribute(
    'aria-hidden',
    'true',
  );

  const box = (await dialog.boundingBox())!;
  const viewport = page.viewportSize()!;
  if (testInfo.project.name === 'mobile-es') {
    // A bottom sheet below md.
    expect(Math.round(box.width)).toBe(viewport.width);
  } else {
    // xl: 65rem, or the viewport less its gutters.
    expect(Math.round(box.width)).toBe(Math.min(1040, viewport.width - 64));
  }

  // The footer is the dialog's last row, flush with its edges.
  const footer = dialog.locator('.sw-dialog-footer');
  const footerBox = (await footer.boundingBox())!;
  expect(Math.abs(footerBox.x - box.x)).toBeLessThanOrEqual(1);
  expect(
    Math.abs(footerBox.x + footerBox.width - (box.x + box.width)),
  ).toBeLessThanOrEqual(1);

  const status = footer.getByRole('status');
  await expect(status).toHaveText('Lake +12 river says 14');
  const move = footer.getByRole('button', { name: 'Move 12 herons' });
  await expect(move).toBeDisabled();

  // Content scrolls under the pinned footer: squeeze the viewport so it must.
  await page.setViewportSize({ width: viewport.width, height: 360 });
  await dialog
    .getByRole('button', { name: 'Count two more' })
    .scrollIntoViewIfNeeded();
  const pinned = (await footer.boundingBox())!;
  const squeezed = (await dialog.boundingBox())!;
  expect(
    Math.abs(pinned.y + pinned.height - (squeezed.y + squeezed.height)),
  ).toBeLessThanOrEqual(2);
  await dialog.getByRole('button', { name: 'Count two more' }).click();
  await expect(status).toHaveText('Lake +14 matches the river');
  await expect(
    footer.getByRole('button', { name: 'Move 14 herons' }),
  ).toBeEnabled();
  await dialog.screenshot({ path: testInfo.outputPath('dialog-frame.png') });
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await page.setViewportSize(viewport);

  await page
    .locator('#dialog')
    .getByRole('button', { name: 'Pause the count' })
    .click();
  const alert = page.getByRole('alertdialog', {
    name: 'Are you still counting?',
  });
  await expect(alert).toBeVisible();
  await alert.getByRole('button', { name: 'Keep counting' }).click();
  await expect(alert).toBeHidden();
});
