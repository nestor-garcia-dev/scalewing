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
