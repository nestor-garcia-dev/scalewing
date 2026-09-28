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
  await section.getByText('Sighting name').click();
  await expect(input).toBeFocused();
  const normalBorder = await input.evaluate(
    (element) => getComputedStyle(element).borderTopColor,
  );
  await section.screenshot({ path: testInfo.outputPath('field-hint.png') });

  await section.getByRole('button', { name: 'Validate sighting' }).click();
  const error = section.getByRole('alert');
  await expect(error).toHaveText('Enter a sighting name');
  await expect(error).toHaveAttribute('id', hintId ?? '');
  await expect(input).toHaveAttribute('aria-invalid', 'true');
  const invalidBorder = await input.evaluate(
    (element) => getComputedStyle(element).borderTopColor,
  );
  expect(invalidBorder).not.toBe(normalBorder);
  await expect(input).toHaveAttribute('aria-describedby', hintId ?? '');
  await section.screenshot({ path: testInfo.outputPath('field-error.png') });

  await input.fill('Red fox');
  await expect(section.getByRole('alert')).toHaveCount(0);
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

  await fee.focus();
  expect(
    await frame.evaluate((element) => getComputedStyle(element).outlineStyle),
  ).toBe('solid');
  await fee.fill('20.00');
  await expect(fee).toHaveValue('20.00');
  await section.screenshot({ path: testInfo.outputPath('field-adorned.png') });
});
