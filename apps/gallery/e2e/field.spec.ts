import { expect, test } from '@playwright/test';

test('Field associates hint, required state, and replaceable validation error', async ({
  page,
}, testInfo) => {
  await page.goto('/#field');
  if (testInfo.project.name === 'forced-colors') {
    await page.emulateMedia({ forcedColors: 'active' });
    expect(
      await page.evaluate(() => matchMedia('(forced-colors: active)').matches),
    ).toBe(true);
  }
  const section = page.locator('#field');
  const input = section.getByRole('textbox', { name: 'Sighting name' });
  const hint = section.getByText('Use the name printed on the sighting card');
  await expect(input).toHaveAttribute('required', '');
  const hintId = await hint.getAttribute('id');
  expect(hintId).toBeTruthy();
  await expect(input).toHaveAttribute('aria-describedby', hintId ?? '');
  // The error region exists before any error, empty and polite, so a new
  // error is announced once when it appears (review of PR #73).
  const region = input
    .locator('xpath=ancestor::*[contains(@class, "sw-field")][1]')
    .locator('.sw-field-error');
  await expect(region).toHaveAttribute('aria-live', 'polite');
  await expect(region).toHaveText('');
  const regionId = await region.getAttribute('id');
  const validate = section.getByRole('button', { name: 'Validate sighting' });
  const spacing = async () =>
    ((await validate.boundingBox())?.y ?? 0) -
    ((await input.boundingBox())?.y ?? 0);
  const before = await spacing();
  await section.getByText('Sighting name').click();
  await expect(input).toBeFocused();
  const normalBorder = await input.evaluate(
    (element) => getComputedStyle(element).borderTopColor,
  );
  await section.screenshot({ path: testInfo.outputPath('field-hint.png') });

  await section.getByRole('button', { name: 'Validate sighting' }).click();
  const error = section.getByText('Enter a sighting name');
  // Swapped into the same region, which replaces the hint on screen.
  await expect(error).toHaveAttribute('id', regionId ?? '');
  await expect(region).toHaveText('Enter a sighting name');
  await expect(hint).toHaveCount(0);
  await expect(input).toHaveAttribute('aria-invalid', 'true');
  await expect(input).toHaveAccessibleDescription('Enter a sighting name');
  // Tied to the input, not an alert of its own, so a form with several
  // errors does not fire several alerts at once (Teisoro CHK-3).
  await expect(section.getByRole('alert')).toHaveCount(0);
  const invalidBorder = await input.evaluate(
    (element) => getComputedStyle(element).borderTopColor,
  );
  expect(invalidBorder).not.toBe(normalBorder);
  await expect(input).toHaveAttribute('aria-describedby', regionId ?? '');
  await section.screenshot({ path: testInfo.outputPath('field-error.png') });

  await input.fill('Red fox');
  await expect(error).toHaveCount(0);
  await expect(region).toHaveText('');
  // Empty, the region takes no room: the layout is as before the error.
  expect(Math.abs((await spacing()) - before)).toBeLessThan(1);
  await expect(input).not.toHaveAttribute('aria-invalid', 'true');
  await expect(hint).toBeVisible();
  await expect(input).toHaveAttribute('aria-describedby', hintId ?? '');
});

test('Field prefix and suffix sit inside the frame and join the name', async ({
  page,
}, testInfo) => {
  await page.goto('/#field');
  const section = page.locator('#field');
  const fee = section.getByRole('textbox', { name: 'Reserve entry fee $' });
  const wingspan = section.getByRole('textbox', { name: 'Wingspan cm' });
  await expect(fee).toHaveValue('12.50');
  await expect(wingspan).toHaveValue('38');
  await expect(
    section.getByRole('textbox', { name: 'Canopy cover %' }),
  ).toBeVisible();

  const frame = fee.locator('xpath=..');
  const prefix = frame.locator('.sw-field-prefix');
  const frameBox = await frame.boundingBox();
  const prefixBox = await prefix.boundingBox();
  const inputBox = await fee.boundingBox();
  expect(frameBox && prefixBox && inputBox).toBeTruthy();
  if (!frameBox || !prefixBox || !inputBox) return;
  expect(prefixBox.x).toBeGreaterThan(frameBox.x);
  expect(prefixBox.x + prefixBox.width).toBeLessThanOrEqual(inputBox.x);
  expect(inputBox.x + inputBox.width).toBeLessThanOrEqual(
    frameBox.x + frameBox.width,
  );
  expect(
    await fee.evaluate((element) => getComputedStyle(element).borderTopWidth),
  ).toBe('0px');
  expect(
    await frame.evaluate((element) => getComputedStyle(element).borderTopWidth),
  ).toBe('1px');

  // A press on the adornment focuses the input, as the text cursor promises.
  await wingspan.locator('xpath=..').locator('.sw-field-suffix').click();
  await expect(wingspan).toBeFocused();
  await prefix.click();
  await expect(fee).toBeFocused();
  expect(
    await frame.evaluate((element) => getComputedStyle(element).outlineStyle),
  ).toBe('solid');
  await fee.fill('20.00');
  await expect(fee).toHaveValue('20.00');
  await section.screenshot({ path: testInfo.outputPath('field-adorned.png') });
});
