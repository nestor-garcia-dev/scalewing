import { expect, test } from '@playwright/test';

test('ActionMenu returns focus to its trigger after a command dialog closes', async ({
  page,
}) => {
  await page.goto('/#action-menu');
  const section = page.locator('#action-menu');
  const trigger = section.getByRole('button', { name: 'Sighting actions' });

  await trigger.focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('End');
  await expect(
    page.getByRole('menuitem', { name: 'Delete sighting' }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  const confirm = page.getByRole('dialog', { name: 'Delete this sighting?' });
  await expect(confirm).toBeVisible();
  await expect(page.getByRole('menu')).toBeHidden();
  await page.keyboard.press('Escape');
  await expect(confirm).toBeHidden();
  await expect(trigger).toBeFocused();

  await trigger.click();
  await page.getByRole('menuitem', { name: 'Delete sighting' }).click();
  await expect(confirm).toBeVisible();
  await confirm.getByRole('button', { name: 'Keep sighting' }).click();
  await expect(confirm).toBeHidden();
  await expect(trigger).toBeFocused();
});

// space-1 between the trigger and the menu, space-2 from the viewport edges.
const gap = 4;
const inset = 8;

test('ActionMenu opens a gap below its trigger and clear of the screen edge', async ({
  page,
}, testInfo) => {
  await page.goto('/#action-menu');
  const section = page.locator('#action-menu');
  const viewport = page.viewportSize();
  expect(viewport).not.toBeNull();
  const width = viewport?.width ?? 0;

  // A trigger at the start of a row keeps the menu on its start.
  const start = section.getByRole('button', { name: 'Sighting actions' });
  await start.evaluate((node) => node.scrollIntoView({ block: 'center' }));
  await start.click();
  let menu = page.getByRole('menu', { name: 'Sighting actions' });
  await expect(menu).toBeVisible();
  let trigger = await start.boundingBox();
  let box = await menu.boundingBox();
  expect(box?.x).toBeCloseTo(trigger?.x ?? -1, 0);
  expect(box?.y).toBeCloseTo(
    (trigger?.y ?? 0) + (trigger?.height ?? 0) + gap,
    0,
  );
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();

  // A trigger at the end of a row lines the menu up with its end.
  const end = section.getByRole('button', {
    name: 'More actions for Snow leopard',
  });
  await end.evaluate((node) => node.scrollIntoView({ block: 'center' }));
  await end.click();
  menu = page.getByRole('menu', { name: 'More actions for Snow leopard' });
  await expect(menu).toBeVisible();
  trigger = await end.boundingBox();
  box = await menu.boundingBox();
  const menuEnd = (box?.x ?? 0) + (box?.width ?? 0);
  expect(menuEnd).toBeCloseTo((trigger?.x ?? 0) + (trigger?.width ?? 0), 0);
  expect(menuEnd).toBeLessThanOrEqual(width - inset);
  expect(box?.x).toBeGreaterThanOrEqual(inset);
  expect(box?.y).toBeCloseTo(
    (trigger?.y ?? 0) + (trigger?.height ?? 0) + gap,
    0,
  );
  await page.screenshot({
    path: testInfo.outputPath('action-menu-row-end.png'),
  });
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await expect(end).toBeFocused();
});
