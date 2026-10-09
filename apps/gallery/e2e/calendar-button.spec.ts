import { expect, test, type Locator, type Page } from '@playwright/test';

function pageOverflow(page: Page) {
  return page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
}

async function expectInsideViewport(page: Page, locator: Locator) {
  const box = await locator.boundingBox();
  const viewport = page.viewportSize();
  expect(box && viewport).toBeTruthy();
  if (box && viewport) {
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
  }
}

// The project's forcedColors option alone does not reach the page's media
// queries, so the forced-colors project emulates it as the other specs do.
test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.project.name !== 'forced-colors') return;
  await page.emulateMedia({ forcedColors: 'active' });
  expect(
    await page.evaluate(() => matchMedia('(forced-colors: active)').matches),
  ).toBe(true);
});

test('CalendarButton picks the day of a heading from the keyboard', async ({
  page,
}, testInfo) => {
  await page.goto('/#calendar-button');
  const section = page.locator('#calendar-button');
  const heading = section.getByRole('heading', { level: 3 }).first();
  const button = section.getByRole('button', {
    name: 'Choose survey day, Tuesday, September 22, 2026',
  });

  await expect(heading).toHaveText('Tuesday, September 22, 2026');
  await expect(button).toHaveAttribute('aria-haspopup', 'dialog');
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  const target = await button.boundingBox();
  expect(target?.width).toBeGreaterThanOrEqual(44);
  expect(target?.height).toBeGreaterThanOrEqual(44);
  await section.screenshot({
    path: testInfo.outputPath('calendar-button.png'),
  });

  // Other gallery demos may already widen the page; the calendar must not.
  const overflowBefore = await pageOverflow(page);
  await button.focus();
  await page.keyboard.press('Enter');
  const calendar = page.getByRole('dialog', { name: 'Choose survey day' });
  await expect(calendar).toBeVisible();
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await expect(
    calendar.getByRole('grid', { name: 'September 2026' }),
  ).toBeVisible();
  await expect(
    calendar.getByRole('gridcell', { name: 'Tuesday, September 22, 2026' }),
  ).toBeFocused();
  await expect(
    calendar.getByRole('gridcell', { name: 'Thursday, October 1, 2026' }),
  ).toHaveAttribute('aria-disabled', 'true');
  expect(await pageOverflow(page)).toBeLessThanOrEqual(overflowBefore);
  await expectInsideViewport(page, calendar);
  await page.screenshot({
    path: testInfo.outputPath('calendar-button-open.png'),
  });

  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowDown');
  await expect(
    calendar.getByRole('gridcell', { name: 'Wednesday, September 30, 2026' }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(calendar).toBeHidden();
  await expect(heading).toHaveText('Wednesday, September 30, 2026');
  await expect(
    section.getByText('Serialized survey day: 2026-09-30.'),
  ).toBeVisible();
  const moved = section.getByRole('button', {
    name: 'Choose survey day, Wednesday, September 30, 2026',
  });
  await expect(moved).toBeFocused();
  await expect(
    section.getByRole('button', { name: 'Next day' }),
  ).toBeDisabled();

  await section.getByRole('button', { name: 'Previous day' }).click();
  await expect(heading).toHaveText('Tuesday, September 29, 2026');
});

test('CalendarButton closes without a change on Escape and a press outside', async ({
  page,
}) => {
  await page.goto('/#calendar-button');
  const section = page.locator('#calendar-button');
  const heading = section.getByRole('heading', { level: 3 }).first();
  const button = section.getByRole('button', {
    name: 'Choose survey day, Tuesday, September 22, 2026',
  });
  const calendar = page.getByRole('dialog', { name: 'Choose survey day' });

  await button.click();
  await expect(calendar).toBeVisible();
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('Escape');
  await expect(calendar).toBeHidden();
  await expect(button).toBeFocused();
  await expect(heading).toHaveText('Tuesday, September 22, 2026');

  await button.click();
  await expect(calendar).toBeVisible();
  await section.getByRole('heading', { name: 'CalendarButton' }).click();
  await expect(calendar).toBeHidden();
  await expect(heading).toHaveText('Tuesday, September 22, 2026');
  await expect(
    section.getByText('Serialized survey day: 2026-09-22.'),
  ).toBeVisible();
});

test('CalendarButton speaks Spanish and keeps the day row inside a phone', async ({
  page,
}, testInfo) => {
  await page.goto('/#calendar-button');
  const section = page.locator('#calendar-button');
  const heading = section.getByRole('heading', { level: 3 }).nth(1);
  const button = section.getByRole('button', {
    name: 'Elegir día del censo, martes, 22 de septiembre de 2026',
  });

  await expect(heading).toHaveText('martes, 22 de septiembre de 2026');
  await expectInsideViewport(page, button);
  await expectInsideViewport(
    page,
    section.getByRole('button', { name: 'Día siguiente' }),
  );
  await button.click();
  const calendar = page.getByRole('dialog', { name: 'Elegir día del censo' });
  await expect(
    calendar.getByRole('grid', { name: 'septiembre de 2026' }),
  ).toBeVisible();
  await expect(calendar.getByRole('columnheader').first()).toHaveAttribute(
    'abbr',
    'lunes',
  );
  await expectInsideViewport(page, calendar);
  await page.screenshot({
    path: testInfo.outputPath('calendar-button-es-open.png'),
  });
  await calendar
    .getByRole('gridcell', { name: 'jueves, 24 de septiembre de 2026' })
    .click();
  await expect(calendar).toBeHidden();
  await expect(heading).toHaveText('jueves, 24 de septiembre de 2026');
  await expect(
    section.getByRole('button', {
      name: 'Elegir día del censo, jueves, 24 de septiembre de 2026',
    }),
  ).toBeFocused();
});

test('CalendarButton keeps a square target, 44 px on a coarse pointer', async ({
  page,
}, testInfo) => {
  await page.goto('/#calendar-button');
  const section = page.locator('#calendar-button');
  const coarse = await page.evaluate(
    () => window.matchMedia('(pointer: coarse)').matches,
  );
  // The touch project exercises the coarse-pointer target.
  expect(coarse).toBe(testInfo.project.name === 'mobile-es');
  const release = section.getByRole('button', {
    name: /^Choose release day, /,
  });
  await expect(release).toHaveCount(2);
  for (const [index, size] of [
    [0, 32],
    [1, 28],
  ] as const) {
    const box = await release.nth(index).boundingBox();
    const expected = coarse ? 44 : size;
    expect(box?.width).toBe(expected);
    expect(box?.height).toBe(expected);
  }
  const archived = section.getByRole('button', {
    name: 'Choose archived day, Friday, August 14, 2026',
  });
  await expect(archived).toBeDisabled();
  // Forced colors paint Button's transparent hairline in a system colour,
  // so the icon-only button keeps visible bounds with no rule of its own.
  const border = await section
    .getByRole('button', { name: /^Choose survey day, / })
    .evaluate((node) => getComputedStyle(node).borderTopColor);
  if (testInfo.project.name === 'forced-colors')
    expect(border).not.toBe('rgba(0, 0, 0, 0)');
  else expect(border).toBe('rgba(0, 0, 0, 0)');
});

test("CalendarButton marks and picks a given today, not the device's", async ({
  page,
}) => {
  // 08:00 UTC on Sep 30 is still 10 PM on Sep 29 at the Honolulu station;
  // the device reads Sep 30 in every project's zone.
  await page.clock.setFixedTime(new Date('2026-09-30T08:00:00Z'));
  await page.goto('/#calendar-button');
  const section = page.locator('#calendar-button');
  const button = section.getByRole('button', {
    name: 'Choose reef day, Sunday, September 27, 2026',
  });
  await button.click();
  const calendar = page.getByRole('dialog', { name: 'Choose reef day' });
  const stationDay = calendar.getByRole('gridcell', {
    name: 'Tuesday, September 29, 2026',
  });
  await expect(stationDay).toHaveAttribute('aria-current', 'date');
  const deviceDay = calendar.getByRole('gridcell', {
    name: 'Wednesday, September 30, 2026',
  });
  await expect(deviceDay).not.toHaveAttribute('aria-current', /.*/);
  await expect(deviceDay).toHaveAttribute('aria-disabled', 'true');

  await calendar.getByRole('button', { name: 'Today' }).click();
  await expect(calendar).toBeHidden();
  await expect(
    section.getByText('Serialized reef day: 2026-09-29.'),
  ).toBeVisible();
  await expect(
    section.getByRole('button', {
      name: 'Choose reef day, Tuesday, September 29, 2026',
    }),
  ).toBeFocused();
});

test('CalendarButton tints the week it shows and keeps the value selected', async ({
  page,
}, testInfo) => {
  const forced = testInfo.project.name === 'forced-colors';
  if (forced) await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/#calendar-button');
  await page.getByRole('button', { name: /^Choose watch week, / }).click();
  const calendar = page.getByRole('dialog', { name: 'Choose watch week' });
  const inRange = calendar.locator('.sw-date-field-day-in-range');
  await expect(inRange).toHaveCount(7);
  const start = calendar.getByRole('gridcell', {
    name: 'Sunday, September 27, 2026',
  });
  await expect(start).toHaveAttribute('aria-selected', 'true');
  const middle = calendar.getByRole('gridcell', {
    name: 'Wednesday, September 30, 2026',
  });
  const outside = calendar.getByRole('gridcell', {
    name: 'Saturday, September 26, 2026',
  });
  const background = (element: HTMLElement) =>
    getComputedStyle(element).backgroundColor;
  // The week's days share a tint that the days outside it do not have.
  expect(await middle.evaluate(background)).not.toBe(
    await outside.evaluate(background),
  );
  // The band is one piece in its row: square inside, rounded at its ends.
  expect(
    await middle.evaluate((element) => getComputedStyle(element).borderRadius),
  ).toBe('0px');
  const end = calendar.getByRole('gridcell', {
    name: 'Saturday, October 3, 2026',
  });
  expect(
    await end.evaluate(
      (element) => getComputedStyle(element).borderStartStartRadius,
    ),
  ).toBe('0px');
  expect(
    await end.evaluate(
      (element) => getComputedStyle(element).borderStartEndRadius,
    ),
  ).not.toBe('0px');
  // October's days on the band take the band's text color, not muted, so
  // they keep AA on the tint; August's days off the band stay muted.
  const color = (element: HTMLElement) => getComputedStyle(element).color;
  expect(await end.evaluate(color)).toBe(await middle.evaluate(color));
  if (!forced)
    expect(
      await calendar
        .getByRole('gridcell', { name: 'Monday, August 31, 2026' })
        .evaluate(color),
    ).not.toBe(await end.evaluate(color));
  await calendar.screenshot({ path: testInfo.outputPath('range.png') });

  // Picking a day of another week moves the period to that week.
  await calendar
    .getByRole('gridcell', { name: 'Tuesday, September 15, 2026' })
    .click();
  await expect(
    page.getByRole('heading', {
      name: 'Watch week 2026-09-13 to 2026-09-19',
    }),
  ).toBeVisible();
});
