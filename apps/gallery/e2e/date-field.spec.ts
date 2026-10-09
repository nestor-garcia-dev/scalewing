import { expect, test, type Locator, type Page } from '@playwright/test';

import { textContrast } from './contrast.js';

function field(section: Locator, label: string) {
  return section.locator('.sw-date-field', {
    has: section.page().getByRole('textbox', { name: label, exact: true }),
  });
}

function pageOverflow(page: Page) {
  return page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
}

test('DateField types a date in the locale order and keeps it date-only', async ({
  page,
}) => {
  await page.goto('/#date-field');
  const section = page.locator('#date-field');
  const sighting = section.getByRole('textbox', { name: 'Sighting date' });

  await expect(sighting).toHaveValue('03/10/2024');
  await sighting.fill('11/03/2024');
  await expect(
    section.getByText('Serialized sighting date: 2024-11-03.'),
  ).toBeVisible();
  await sighting.fill('2024-11-04');
  await expect(
    section.getByText('Serialized sighting date: 2024-11-04.'),
  ).toBeVisible();
  // Typed key by key, ISO commits only once the day has both digits.
  await sighting.fill('');
  await sighting.pressSequentially('2024-11-1');
  await expect(
    section.getByText('Serialized sighting date: empty.'),
  ).toBeVisible();
  await sighting.press('5');
  await expect(
    section.getByText('Serialized sighting date: 2024-11-15.'),
  ).toBeVisible();
  await sighting.fill('13/45/2024');
  await sighting.blur();
  await expect(sighting).toHaveAttribute('aria-invalid', 'true');
  await expect(section.getByText('Enter a valid date.')).toBeVisible();
  await expect(
    section.getByText('Serialized sighting date: 2024-11-15.'),
  ).toBeVisible();
  // Like the native date input, text that is not a date blocks a form.
  expect(
    await sighting.evaluate(
      (input: HTMLInputElement) => input.validationMessage,
    ),
  ).toBe('Enter a valid date.');
  await expect(
    section.getByRole('textbox', { name: 'Review date' }),
  ).toHaveAttribute('aria-invalid', 'true');
  await expect(
    section.getByRole('textbox', { name: 'Fecha del avistamiento' }),
  ).toHaveValue('03/11/2024');
});

test('DateField calendar follows the date picker dialog keyboard pattern', async ({
  page,
}, testInfo) => {
  await page.goto('/#date-field');
  const section = page.locator('#date-field');
  const sighting = field(section, 'Sighting date');
  const button = sighting.getByRole('button', { name: 'Choose date' });

  await section.screenshot({ path: testInfo.outputPath('date-field.png') });
  // Other gallery demos may already widen the page; the calendar must not.
  const overflowBefore = await pageOverflow(page);
  await button.click();
  const calendar = page.getByRole('dialog', { name: 'Sighting date' });
  await expect(calendar).toBeVisible();
  await expect(
    calendar.getByRole('grid', { name: 'March 2024' }),
  ).toBeVisible();
  await expect(
    calendar.getByRole('gridcell', { name: 'Sunday, March 10, 2024' }),
  ).toBeFocused();
  expect(await pageOverflow(page)).toBeLessThanOrEqual(overflowBefore);
  const fieldBox = await sighting.boundingBox();
  expect(fieldBox).toBeTruthy();
  if (fieldBox)
    expect(fieldBox.x + fieldBox.width).toBeLessThanOrEqual(
      page.viewportSize()?.width ?? 0,
    );
  const box = await calendar.boundingBox();
  const viewport = page.viewportSize();
  expect(box && viewport).toBeTruthy();
  if (box && viewport) {
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
  }
  await page.screenshot({ path: testInfo.outputPath('date-field-open.png') });

  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('PageDown');
  await expect(
    calendar.getByRole('gridcell', { name: 'Thursday, April 18, 2024' }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(calendar).toBeHidden();
  await expect(button).toBeFocused();
  await expect(
    section.getByText('Serialized sighting date: 2024-04-18.'),
  ).toBeVisible();

  await button.click();
  await page.keyboard.press('Escape');
  await expect(calendar).toBeHidden();
  await expect(button).toBeFocused();
});

test('DateField jumps decades with the year selector', async ({ page }) => {
  await page.goto('/#date-field');
  const section = page.locator('#date-field');
  const hatch = field(section, 'Hatch date');
  await hatch.getByRole('button', { name: 'Choose date' }).click();
  const calendar = page.getByRole('dialog', { name: 'Hatch date' });
  await calendar.getByRole('combobox', { name: 'Year' }).click();
  await calendar.getByRole('option', { name: '1948', exact: true }).click();
  await expect(calendar.getByRole('grid', { name: 'May 1948' })).toBeVisible();
  await calendar
    .getByRole('gridcell', { name: 'Thursday, May 20, 1948' })
    .click();
  await expect(calendar).toBeHidden();
  await expect(
    section.getByText('Serialized hatch date: 1948-05-20.'),
  ).toBeVisible();
});

test('DateField opens an out-of-range value on the nearest allowed day', async ({
  page,
}) => {
  await page.goto('/#date-field');
  const section = page.locator('#date-field');
  const review = field(section, 'Review date');
  expect(
    await review
      .getByRole('textbox', { name: 'Review date' })
      .evaluate((input: HTMLInputElement) => input.validationMessage),
  ).toBe('Choose a date in the allowed range.');
  await review.getByRole('button', { name: 'Choose date' }).click();
  const calendar = page.getByRole('dialog', { name: 'Review date' });
  await expect(
    calendar.getByRole('gridcell', { name: 'Friday, March 1, 2024' }),
  ).toBeFocused();
  const leapDay = calendar.getByRole('gridcell', {
    name: 'Thursday, February 29, 2024',
  });
  await expect(leapDay).toHaveAttribute('aria-disabled', 'true');
  await expect(leapDay).toHaveAttribute('aria-selected', 'true');
  await leapDay.click({ force: true });
  await expect(calendar).toBeVisible();
  // The month list starts at March, the first month inside the bounds.
  await calendar.getByRole('combobox', { name: 'Month' }).click();
  await expect(calendar.getByRole('option').first()).toHaveText('March');
  await expect(calendar.getByRole('option', { name: 'February' })).toHaveCount(
    0,
  );
  await page.keyboard.press('Escape');
  await expect(calendar).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(calendar).toBeHidden();
});

test('a required DateField marks its label as Field does', async ({
  page,
}, testInfo) => {
  await page.goto('/#date-field');
  const section = page.locator('#date-field');
  // Teisoro NSF-15: "Date reported" had no asterisk beside required fields.
  const hatch = section.getByRole('textbox', { name: 'Hatch date' });
  await expect(hatch).toHaveAttribute('required', '');
  const label = section.locator('label', { has: page.getByText('Hatch date') });
  const mark = label.locator('.sw-field-required');
  await expect(mark).toBeVisible();
  await expect(mark).toHaveText('*');
  await expect(mark).toHaveAttribute('aria-hidden', 'true');
  // The accessible name stays the label alone.
  await expect(hatch).toHaveAccessibleName('Hatch date');
  // An optional date has no mark.
  await expect(
    section
      .locator('label', { has: page.getByText('Tagging date') })
      .locator('.sw-field-required'),
  ).toHaveCount(0);
  if (testInfo.project.name !== 'forced-colors') {
    const danger = await mark.evaluate((node) => getComputedStyle(node).color);
    const text = await label.evaluate((node) => getComputedStyle(node).color);
    expect(danger).not.toBe(text);
  }
  await label.screenshot({
    path: testInfo.outputPath('date-field-required.png'),
  });
});

test('a disabled DateField entry looks locked as a disabled Field does', async ({
  page,
}, testInfo) => {
  const forced = testInfo.project.name === 'forced-colors';
  if (forced) await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/#date-field');
  const section = page.locator('#date-field');
  const archived = section.getByRole('textbox', { name: 'Archived date' });
  await expect(archived).toBeDisabled();
  const look = await archived.evaluate((element) => {
    const computed = getComputedStyle(element);
    return {
      borderStyle: computed.borderTopStyle,
      cursor: computed.cursor,
      opacity: computed.opacity,
    };
  });
  // Teisoro DRW-17: the same locked look as every text control, not faded.
  expect(look).toEqual({
    borderStyle: 'dashed',
    cursor: 'not-allowed',
    opacity: '1',
  });
  if (!forced) expect(await textContrast(archived)).toBeGreaterThanOrEqual(4.5);
});

test('a DateField beside a Field lines up its label and control', async ({
  page,
}, testInfo) => {
  await page.goto('/#date-field');
  const section = page.locator('#date-field');
  const date = section.getByRole('textbox', { name: 'Survey start' });
  const observers = section.getByRole('textbox', { name: 'Observers' });
  const top = async (locator: typeof date) =>
    (await locator.boundingBox())?.y ?? Number.NaN;
  const labelTop = (name: string) =>
    section
      .locator('label')
      .filter({ hasText: name })
      .evaluate((label) => {
        const range = document.createRange();
        range.selectNodeContents(label);
        return range.getBoundingClientRect().y;
      });
  // Teisoro NSF-35: the date's entry sat 5 px above the fee field's.
  expect(Math.abs((await top(date)) - (await top(observers)))).toBeLessThan(
    0.5,
  );
  expect(
    Math.abs((await labelTop('Survey start')) - (await labelTop('Observers'))),
  ).toBeLessThan(0.5);
  const height = (name: string) =>
    section
      .locator('label')
      .filter({ hasText: name })
      .evaluate((label) => label.getBoundingClientRect().height);
  expect(await height('Survey start')).toBe(await height('Observers'));
  await date.scrollIntoViewIfNeeded();
  await section.screenshot({
    path: testInfo.outputPath('date-field-beside-field.png'),
  });
});

test("DateField opens on, marks and picks a given today, not the device's", async ({
  page,
}) => {
  // 08:00 UTC on Sep 30 is still 10 PM on Sep 29 at the Honolulu station;
  // the device reads Sep 30 in every project's zone.
  await page.clock.setFixedTime(new Date('2026-09-30T08:00:00Z'));
  await page.goto('/#date-field');
  const section = page.locator('#date-field');
  const reef = field(section, 'Reef log date');
  await reef.getByRole('button', { name: 'Choose date' }).click();
  const calendar = page.getByRole('dialog', { name: 'Reef log date' });
  const stationDay = calendar.getByRole('gridcell', {
    name: 'Tuesday, September 29, 2026',
  });
  await expect(stationDay).toBeFocused();
  await expect(stationDay).toHaveAttribute('aria-current', 'date');
  const deviceDay = calendar.getByRole('gridcell', {
    name: 'Wednesday, September 30, 2026',
  });
  await expect(deviceDay).not.toHaveAttribute('aria-current', /.*/);
  await expect(deviceDay).toHaveAttribute('aria-disabled', 'true');

  await calendar.getByRole('button', { name: 'Today' }).click();
  await expect(calendar).toBeHidden();
  await expect(
    section.getByText('Serialized reef log date: 2026-09-29.'),
  ).toBeVisible();
});
