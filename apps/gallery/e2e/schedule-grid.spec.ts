import { expect, test, type Page } from '@playwright/test';

import { axeViolations } from './axe-scan.js';

async function openGrid(page: Page) {
  await page.goto('/#schedule-grid');
  const grid = page.getByRole('grid', { name: 'Sunday talks by habitat' });
  await expect(grid).toBeVisible();
  return grid;
}

const announcement = (page: Page) =>
  page.locator('#schedule-grid [role="status"]');

test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.project.name === 'forced-colors')
    await page.emulateMedia({ forcedColors: 'active' });
});

test('ScheduleGrid moves an item with keys and announces each step', async ({
  page,
}, testInfo) => {
  const grid = await openGrid(page);
  const herons = grid.getByRole('gridcell', { name: 'Heron count' });
  await herons.focus();
  await page.keyboard.press('m');
  await expect(announcement(page)).toHaveText(/^Picked up Heron count\./);
  await expect(
    grid.getByRole('gridcell', { name: 'Heron count, Moving from here' }),
  ).toBeVisible();
  await page.keyboard.press('ArrowDown');
  const target = grid
    .getByRole('row', { name: /^10:30/ })
    .getByRole('gridcell')
    .nth(1);
  await expect(target).toHaveAccessibleName('Open, Release to move here');
  await expect(target).toBeFocused();
  await expect(target).toContainText('Release to move here');
  await expect(target).toHaveClass(/sw-schedule-grid-cell-target/);
  expect(await axeViolations(page, '#schedule-grid .sw-schedule-grid')).toEqual(
    [],
  );
  await page.keyboard.press('Enter');
  await expect(announcement(page)).toHaveText(
    'Moved Heron count to 10:30, Heron Marsh.',
  );
  const row = grid.getByRole('row', { name: /^10:30/ });
  await expect(
    row.getByRole('gridcell', { name: 'Heron count' }),
  ).toBeFocused();
  await expect(page.locator('#schedule-grid')).toContainText(
    'Last change: moved Heron count',
  );

  // Every cell is at least the 44 px target high.
  for (const cell of await grid.getByRole('gridcell').all()) {
    const box = (await cell.boundingBox())!;
    expect(box.height).toBeGreaterThanOrEqual(44);
  }
  await page.screenshot({
    path: testInfo.outputPath('schedule-grid-keys.png'),
  });
});

test('ScheduleGrid shows a blocked cell’s reason, refuses it, and cancels with Escape', async ({
  page,
}, testInfo) => {
  const grid = await openGrid(page);
  await grid.getByRole('gridcell', { name: 'Otter feeding' }).focus();
  await page.keyboard.press(' ');
  const blocked = grid.getByRole('gridcell', {
    name: 'Open, Otters nap before 10:30',
  });
  await expect(blocked).toContainText('Otters nap before 10:30');
  await expect(blocked).toHaveClass(/sw-schedule-grid-cell-blocked/);
  // Swapping the feeding into 9:00 is blocked too: the grid asks canDrop for swaps.
  await expect(
    grid.getByRole('gridcell', {
      name: 'Heron count, Otters nap before 10:30',
    }),
  ).toBeVisible();
  const slot = blocked.locator('.sw-schedule-grid-slot');
  if (testInfo.project.name === 'forced-colors')
    await expect(slot).toHaveCSS('border-top-style', 'dotted');
  else await expect(slot).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  // The disabled cell never takes an item, and says why.
  await expect(
    grid.getByRole('gridcell', { name: 'Closed for mowing' }),
  ).toBeVisible();

  await page.keyboard.press('ArrowUp');
  await expect(blocked).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(announcement(page)).toHaveText('Otters nap before 10:30');
  await expect(
    grid.getByRole('gridcell', { name: /Moving from here/ }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(announcement(page)).toHaveText(
    'Cancelled. Otter feeding stays where it was.',
  );
  await expect(
    grid.getByRole('gridcell', { name: 'Otter feeding' }),
  ).toBeFocused();
  expect(await axeViolations(page, '#schedule-grid .sw-schedule-grid')).toEqual(
    [],
  );
});

test('ScheduleGrid drags with a mouse: one hover target, then a swap', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === 'mobile-es', 'Touch never drags.');
  const grid = await openGrid(page);
  const martens = grid.getByRole('gridcell', { name: 'Pine marten walk' });
  const herons = grid.getByRole('gridcell', { name: 'Heron count' });
  await grid.scrollIntoViewIfNeeded();
  const from = (await martens.boundingBox())!;
  const to = (await herons.boundingBox())!;
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
  await page.mouse.down();
  await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, {
    steps: 8,
  });
  await expect(page.locator('.sw-schedule-grid-dragging')).toHaveCount(1);
  const hovered = grid.getByRole('gridcell', {
    name: 'Heron count, Release to swap',
  });
  await expect(hovered).toHaveClass(/sw-schedule-grid-cell-target/);
  await expect(hovered).toContainText('Release to swap');
  await expect(grid.locator('.sw-schedule-grid-cell-target')).toHaveCount(1);
  await expect(
    grid.getByRole('gridcell', { name: 'Pine marten walk, Moving from here' }),
  ).toContainText('Moving from here');
  await page.screenshot({
    path: testInfo.outputPath('schedule-grid-drag.png'),
  });
  await page.mouse.up();
  await expect(announcement(page)).toHaveText(
    'Swapped Pine marten walk with Heron count.',
  );
  const nine = grid.getByRole('row', { name: /^9:00/ });
  await expect(nine.getByRole('gridcell').nth(1)).toHaveAccessibleName(
    'Pine marten walk',
  );
  await expect(nine.getByRole('gridcell').nth(2)).toHaveAccessibleName(
    'Heron count',
  );
  // The release made no click: nothing is carried.
  await expect(
    grid.getByRole('gridcell', { name: /Moving from here/ }),
  ).toHaveCount(0);
});

test('ScheduleGrid on touch: tap an item, then tap where it goes', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-es', 'Touch only.');
  const grid = await openGrid(page);
  await grid.getByRole('gridcell', { name: 'Bittern listening' }).tap();
  await expect(announcement(page)).toHaveText(/^Picked up Bittern listening\./);
  const noon = grid.getByRole('row', { name: /^12:00/ });
  await noon.getByRole('gridcell').nth(0).tap();
  await expect(announcement(page)).toHaveText(
    'Moved Bittern listening to 12:00, Otter Pool.',
  );
  await expect(noon.getByRole('gridcell').nth(0)).toHaveAccessibleName(
    'Bittern listening',
  );
  // The grid scrolls sideways inside its own box; the page does not.
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: testInfo.outputPath('schedule-grid-touch.png'),
  });
});

test('ScheduleGrid picks nothing up while locked', async ({ page }) => {
  const grid = await openGrid(page);
  await page
    .locator('#schedule-grid')
    .getByRole('switch', { name: 'Lock the talks' })
    .click();
  const herons = grid.getByRole('gridcell', { name: 'Heron count' });
  await herons.focus();
  await page.keyboard.press('m');
  await herons.click();
  await expect(
    grid.getByRole('gridcell', { name: /Moving from here/ }),
  ).toHaveCount(0);
});
