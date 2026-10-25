import { expect, test } from '@playwright/test';

import { axeViolations } from './axe-scan.js';

test('Dialog placement end is a full-height side panel from md and the bottom sheet on a phone', async ({
  page,
}, testInfo) => {
  const project = testInfo.project.name;
  await page.goto('/#dialog-end');
  const opener = page
    .locator('#dialog-end')
    .getByRole('button', { name: 'Log a sighting', exact: true });
  await opener.click();
  const panel = page.getByRole('dialog', { name: 'Log a sighting' });
  await expect(panel).toBeVisible();
  await expect(panel).toHaveAccessibleDescription(
    'Note what you saw. You can edit it later.',
  );
  expect(await axeViolations(page, 'dialog[open]')).toEqual([]);
  // The close button is the first control and takes the focus.
  await expect(panel.getByRole('button', { name: 'Close' })).toBeFocused();

  const viewport = page.viewportSize()!;
  // Wait for the panel to settle where it docks.
  await expect
    .poll(async () => {
      const { x, y, width, height } = (await panel.boundingBox())!;
      return project === 'mobile-es'
        ? Math.round(y + height)
        : Math.round(x + width);
    })
    .toBe(project === 'mobile-es' ? viewport.height : viewport.width);
  const box = (await panel.boundingBox())!;
  const footer = (await panel.locator('.sw-dialog-footer').boundingBox())!;
  if (project === 'mobile-es') {
    // Below md: the bottom sheet, full width, on the bottom edge.
    expect(Math.round(box.width)).toBe(viewport.width);
    expect(Math.round(box.y + box.height)).toBe(viewport.height);
    expect(box.height).toBeLessThan(viewport.height);
  } else {
    // From md: the window's height at the inline end, md's 32rem wide.
    expect(Math.round(box.y)).toBe(0);
    expect(Math.round(box.height)).toBe(viewport.height);
    expect(Math.round(box.x + box.width)).toBe(viewport.width);
    expect(Math.round(box.width)).toBe(512);
    // The footer sits on the bottom edge though the content is short.
    expect(Math.round(footer.y + footer.height)).toBe(viewport.height);
    await expect(panel).toHaveCSS('border-top-left-radius', '0px');
    await expect(panel).toHaveCSS('border-left-width', '1px');
    if (project === 'forced-colors')
      await expect(panel).toHaveCSS('border-left-style', 'solid');
  }

  // Focus stays inside: Tab from the last control comes back round.
  const save = panel.getByRole('button', { name: 'Save sighting' });
  await panel.getByLabel('Species').fill('Grey heron');
  await save.focus();
  await page.keyboard.press('Tab');
  const inside = await panel.evaluate((node) =>
    node.contains(document.activeElement),
  );
  // Chromium may move focus to the browser chrome past the last control,
  // but never to the page behind the modal.
  if (!inside)
    expect(
      await page.evaluate(() => document.activeElement === document.body),
    ).toBe(true);

  // Escape asks onClose; focus goes back to the opener.
  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
  await expect(opener).toBeFocused();

  // The banded panel's edge is a hairline too, from md.
  await page
    .locator('#dialog-end')
    .getByRole('button', { name: 'Log a sighting (banded)' })
    .click();
  const banded = page.getByRole('dialog', { name: 'Log a sighting (banded)' });
  await expect(banded).toBeVisible();
  if (project !== 'mobile-es')
    await expect(banded).toHaveCSS('border-left-width', '1px');
  await banded.getByRole('button', { name: 'Close' }).click();
  await expect(banded).toBeHidden();
});
