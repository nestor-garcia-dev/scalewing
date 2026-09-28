import { expect, test, type Locator, type Page } from '@playwright/test';

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

test('DateField types in the entry locale and names in the locale', async ({
  page,
}) => {
  await page.goto('/#date-field');
  const section = page.locator('#date-field');
  const release = field(section, 'Fecha de liberación');
  const input = release.getByRole('textbox', { name: 'Fecha de liberación' });

  await expect(input).toHaveValue('11/03/2024');
  await expect(input).toHaveAttribute('placeholder', 'MM/DD/AAAA');
  await input.fill('03/10/2024');
  await expect(
    section.getByText('Serialized release date: 2024-03-10.'),
  ).toBeVisible();
  await release.getByRole('button', { name: 'Elegir fecha' }).click();
  const calendar = page.getByRole('dialog', { name: 'Fecha de liberación' });
  await expect(
    calendar.getByRole('grid', { name: 'marzo de 2024' }),
  ).toBeVisible();
  await expect(
    calendar.getByRole('gridcell', { name: 'domingo, 10 de marzo de 2024' }),
  ).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(calendar).toBeHidden();
});
