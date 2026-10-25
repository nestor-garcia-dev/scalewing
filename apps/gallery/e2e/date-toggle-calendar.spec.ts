import { expect, test } from '@playwright/test';

import { axeViolations } from './axe-scan.js';

test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.project.name === 'forced-colors')
    await page.emulateMedia({ forcedColors: 'active' });
});

test('DateToggleCalendar toggles days with a press and with keys', async ({
  page,
}, testInfo) => {
  const project = testInfo.project.name;
  await page.goto('/#date-toggle-calendar');
  const section = page.locator('#date-toggle-calendar');
  const group = section.getByRole('group', { name: 'Survey days off' });
  await expect(group.getByRole('grid')).toHaveCount(4);
  await expect(group.getByRole('grid', { name: 'June 2027' })).toBeVisible();

  const on = group.getByRole('button', {
    name: 'Sunday, April 18, 2027, day off',
  });
  await expect(on).toHaveAttribute('aria-pressed', 'true');
  const off = group.getByRole('button', { name: 'Sunday, April 4, 2027' });
  await expect(off).toHaveAttribute('aria-pressed', 'false');
  // Days that cannot be toggled are not controls.
  await expect(
    group.getByRole('gridcell', { name: 'Monday, April 5, 2027' }),
  ).toHaveAttribute('aria-disabled', 'true');

  // Each day is the 44 px square; on and off days look different, in forced colours too.
  const box = (await off.boundingBox())!;
  expect(Math.round(box.width)).toBe(44);
  expect(Math.round(box.height)).toBe(44);
  const fill = (locator: typeof on) =>
    locator.evaluate((element) => getComputedStyle(element).backgroundColor);
  expect(await fill(on)).not.toBe(await fill(off));
  if (project === 'forced-colors')
    await expect(on).toHaveCSS('forced-color-adjust', 'none');

  await off.click();
  await expect(
    group.getByRole('button', { name: 'Sunday, April 4, 2027, day off' }),
  ).toHaveAttribute('aria-pressed', 'true');
  await expect(
    section.getByText('Days off: 2027-04-04, 2027-04-18'),
  ).toBeVisible();

  // Keys move between Sundays only; Space toggles.
  const april4 = group.getByRole('button', { name: /April 4,/ });
  await april4.focus();
  await page.keyboard.press('ArrowRight');
  const april11 = group.getByRole('button', { name: /April 11,/ });
  await expect(april11).toBeFocused();
  await page.keyboard.press('Space');
  await expect(april11).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('PageDown');
  await expect(group.getByRole('button', { name: /May 2,/ })).toBeFocused();
  await expect(group.locator('button[tabindex="0"]')).toHaveCount(1);

  if (project === 'mobile-es') {
    // Months stack on a phone, inside the page's width.
    const march = (await group
      .getByRole('grid', { name: 'March 2027' })
      .boundingBox())!;
    const aprilGrid = (await group
      .getByRole('grid', { name: 'April 2027' })
      .boundingBox())!;
    expect(aprilGrid.y).toBeGreaterThan(march.y + march.height);
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  expect(
    await axeViolations(page, '#date-toggle-calendar .sw-date-toggle'),
  ).toEqual([]);
  await page.screenshot({
    path: testInfo.outputPath('date-toggle-calendar.png'),
  });
});

test('DateToggleCalendar fits a 320 px phone without widening the page', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/#date-toggle-calendar');
  const group = page
    .locator('#date-toggle-calendar')
    .getByRole('group', { name: 'Survey days off' });
  await expect(group.getByRole('grid', { name: 'April 2027' })).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  const grid = (await group
    .getByRole('grid', { name: 'April 2027' })
    .boundingBox())!;
  const groupBox = (await group.boundingBox())!;
  expect(grid.x + grid.width).toBeLessThanOrEqual(
    groupBox.x + groupBox.width + 1,
  );
});

test('DateToggleCalendar keeps days focusable but unchanged while locked', async ({
  page,
}) => {
  await page.goto('/#date-toggle-calendar');
  const section = page.locator('#date-toggle-calendar');
  await section.getByRole('switch', { name: 'Lock the days off' }).click();
  const day = section.getByRole('button', { name: 'Sunday, April 4, 2027' });
  await expect(day).toHaveAttribute('aria-disabled', 'true');
  await day.click({ force: true });
  await expect(day).toHaveAttribute('aria-pressed', 'false');
});
