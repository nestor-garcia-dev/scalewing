import { expect, test } from '@playwright/test';

test('DateField preserves date-only values across native interaction and presentation', async ({
  page,
}, testInfo) => {
  await page.goto('/#date-field');
  const section = page.locator('#date-field');
  const sighting = section.getByLabel('Sighting date');

  await expect(sighting).toHaveValue('2024-03-10');
  await sighting.fill('2024-11-03');
  await expect(sighting).toHaveValue('2024-11-03');
  await expect(
    section.getByText('Serialized sighting date: 2024-11-03.'),
  ).toBeVisible();
  await expect(section.getByLabel('Review date')).toHaveAttribute(
    'aria-invalid',
    'true',
  );

  await section.screenshot({ path: testInfo.outputPath('date-field.png') });

  await sighting.click({ position: { x: 20, y: 20 } });
  await expect(sighting).toBeFocused();
  await sighting.press('ArrowUp');
  const keyboardValue = await sighting.inputValue();
  expect(keyboardValue).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  expect(keyboardValue).not.toBe('2024-11-03');
  await expect(
    section.getByText(`Serialized sighting date: ${keyboardValue}.`),
  ).toBeVisible();
});
