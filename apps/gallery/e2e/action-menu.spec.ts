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

test('ActionMenu keeps its placed left in right-to-left text', async ({
  page,
}) => {
  await page.goto('/#action-menu');
  await page.evaluate(() => {
    document.documentElement.dir = 'rtl';
  });
  const section = page.locator('#action-menu');
  const width = await page.evaluate(() => document.documentElement.clientWidth);

  for (const name of ['Sighting actions', 'More actions for Snow leopard']) {
    const trigger = section.getByRole('button', { name });
    await trigger.evaluate((node) => node.scrollIntoView({ block: 'center' }));
    await trigger.click();
    const menu = page.getByRole('menu', { name });
    await expect(menu).toBeVisible();
    const box = await menu.boundingBox();
    const placed = await menu.evaluate((node) =>
      parseFloat((node as HTMLElement).style.left),
    );
    // The popover layer's inset: 0 must not override the placed left.
    expect(box?.x).toBeCloseTo(placed, 0);
    expect(box?.x).toBeGreaterThanOrEqual(inset);
    expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(
      width - inset,
    );
    if (name === 'Sighting actions') {
      // At the start of a right-to-left row the menu keeps the trigger's
      // right edge.
      const anchor = await trigger.boundingBox();
      expect((box?.x ?? 0) + (box?.width ?? 0)).toBeCloseTo(
        (anchor?.x ?? 0) + (anchor?.width ?? 0),
        0,
      );
    }
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
  }
});

test('ActionMenu wraps a long command inside the screen', async ({
  page,
}, testInfo) => {
  await page.goto('/#action-menu');
  const section = page.locator('#action-menu');
  const trigger = section.getByRole('button', {
    name: 'Acciones del avistamiento',
  });
  await trigger.evaluate((node) => node.scrollIntoView({ block: 'center' }));
  await trigger.click();
  const menu = page.getByRole('menu', { name: 'Acciones del avistamiento' });
  await expect(menu).toBeVisible();
  const width = await page.evaluate(() => document.documentElement.clientWidth);
  const box = await menu.boundingBox();
  expect(box?.x).toBeGreaterThanOrEqual(inset);
  expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(width - inset);
  // No command runs past the menu's own edge.
  expect(
    await menu.evaluate((node) => node.scrollWidth - node.clientWidth),
  ).toBe(0);

  const long = menu.getByRole('menuitem', { name: /^Mover este avistamiento/ });
  const short = menu.getByRole('menuitem', { name: 'Archivar avistamiento' });
  const lines = async (item: typeof long) =>
    item
      .locator('span')
      .last()
      .evaluate((node) => {
        const style = getComputedStyle(node);
        return Math.round(
          node.getBoundingClientRect().height / parseFloat(style.lineHeight),
        );
      });
  expect(await lines(short)).toBe(1);
  if (width < 600) expect(await lines(long)).toBeGreaterThan(1);
  else expect(await lines(long)).toBe(1);
  await page.screenshot({
    path: testInfo.outputPath('action-menu-long-command.png'),
  });
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
});

test('ActionMenu with align end stays over the card its trigger ends', async ({
  page,
}, testInfo) => {
  await page.goto('/#action-menu');
  const section = page.locator('#action-menu');
  // Teisoro ENT-13: from the first of two cards in a row, a start-aligned
  // menu hung past its card toward the next one.
  const trigger = section.getByRole('button', { name: 'Actions for Red fox' });
  await trigger.evaluate((node) => node.scrollIntoView({ block: 'center' }));
  const card = trigger.locator(
    'xpath=ancestor::*[contains(@class, "sw-card")][1]',
  );
  await trigger.click();
  const menu = page.getByRole('menu', { name: 'Actions for Red fox' });
  await expect(menu).toBeVisible();
  const triggerBox = await trigger.boundingBox();
  const menuBox = await menu.boundingBox();
  const cardBox = await card.boundingBox();
  const menuEnd = (menuBox?.x ?? 0) + (menuBox?.width ?? 0);
  expect(menuEnd).toBeCloseTo(
    (triggerBox?.x ?? 0) + (triggerBox?.width ?? 0),
    0,
  );
  expect(menuEnd).toBeLessThanOrEqual(
    (cardBox?.x ?? 0) + (cardBox?.width ?? 0),
  );
  expect(menuBox?.x).toBeGreaterThanOrEqual(cardBox?.x ?? 0);
  expect(menuBox?.y).toBeCloseTo(
    (triggerBox?.y ?? 0) + (triggerBox?.height ?? 0) + gap,
    0,
  );
  await page.screenshot({
    path: testInfo.outputPath('action-menu-align-end.png'),
  });
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('ActionMenu header shows the station above the commands, outside the arrow keys', async ({
  page,
}, testInfo) => {
  await page.goto('/#action-menu');
  const trigger = page.getByRole('button', {
    name: 'Estación Laguna Azul · Aves acuáticas',
  });
  await trigger.focus();
  await page.keyboard.press('Enter');
  const menu = page.getByRole('menu', {
    name: 'Estación Laguna Azul · Aves acuáticas',
  });
  await expect(menu).toBeVisible();
  const header = page.locator('.sw-action-menu-header');
  await expect(header).toContainText('Estación Laguna Azul');
  await expect(header).toContainText('42 avistamientos');
  // The menu is described by the header, which is above every command.
  await expect(menu).toHaveAttribute(
    'aria-describedby',
    (await header.getAttribute('id'))!,
  );
  const headerBox = await header.boundingBox();
  const firstBox = await menu.getByRole('menuitem').first().boundingBox();
  expect(headerBox!.y + headerBox!.height).toBeLessThanOrEqual(firstBox!.y);
  // The first command has focus, and the arrow keys stay on the commands.
  const english = menu.getByRole('menuitem', { name: 'English' });
  await expect(english).toBeFocused();
  await page.keyboard.press('ArrowUp');
  await expect(
    menu.getByRole('menuitem', { name: 'Cambiar de estación' }),
  ).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(english).toBeFocused();
  // English is marked as English on the Spanish row.
  await expect(english.locator('[lang="en"]')).toHaveText('English');
  // The popover holding both stays inside the screen.
  const popover = page.locator('.sw-action-menu-list');
  const box = await popover.boundingBox();
  const width = await page.evaluate(() => document.documentElement.clientWidth);
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(width);
  await popover.screenshot({ path: testInfo.outputPath('menu-header.png') });
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await expect(trigger).toBeFocused();
});
