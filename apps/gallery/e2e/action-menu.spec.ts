import { expect, test } from '@playwright/test';

// The project's forcedColors option alone does not reach the page's media
// queries, so the forced-colors project emulates it as the other specs do.
test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.project.name !== 'forced-colors') return;
  await page.emulateMedia({ forcedColors: 'active' });
  expect(
    await page.evaluate(() => matchMedia('(forced-colors: active)').matches),
  ).toBe(true);
});

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

test('ActionMenu gives its trigger and commands a 44 px target on a coarse pointer', async ({
  page,
}, testInfo) => {
  await page.goto('/#action-menu');
  const section = page.locator('#action-menu');
  const coarse = await page.evaluate(
    () => window.matchMedia('(pointer: coarse)').matches,
  );
  // The touch project exercises the coarse-pointer target.
  expect(coarse).toBe(testInfo.project.name === 'mobile-es');

  const glyph = section.getByRole('button', {
    name: 'More actions for Snow leopard',
  });
  const named = section.getByRole('button', { name: 'Observation actions' });
  for (const trigger of [glyph, named]) {
    const box = await trigger.boundingBox();
    if (coarse) {
      expect(box?.height).toBeGreaterThanOrEqual(44);
      expect(box?.width).toBeGreaterThanOrEqual(44);
    } else {
      // A fine pointer keeps the compact xs control height.
      expect(box?.height).toBeGreaterThanOrEqual(28);
      expect(box?.height).toBeLessThan(32);
    }
  }

  await glyph.evaluate((node) => node.scrollIntoView({ block: 'center' }));
  await glyph.click();
  const menu = page.getByRole('menu', {
    name: 'More actions for Snow leopard',
  });
  await expect(menu).toBeVisible();
  for (const item of await menu.getByRole('menuitem').all()) {
    const box = await item.boundingBox();
    if (coarse) expect(box?.height).toBeGreaterThanOrEqual(44);
    else expect(box?.height).toBeLessThan(32);
  }
  await page.screenshot({
    path: testInfo.outputPath('action-menu-touch-target.png'),
  });
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
});
