import { expect, test } from '@playwright/test';

import { colorContrast } from './contrast.js';

test('DateField entry="calendar" picks a day from a button that shows it', async ({
  page,
}, testInfo) => {
  await page.goto('/#date-field');
  const section = page.locator('#date-field');
  const banding = section.locator('.sw-date-field-calendar-entry').first();
  await expect(banding).toHaveAccessibleName(/^Banding day Choose a day/);
  await expect(banding).toBeVisible();
  // A field's control: radius sm, not a pill, at the column's start.
  const radius = await banding.evaluate(
    (node) => getComputedStyle(node).borderTopLeftRadius,
  );
  expect(parseFloat(radius)).toBeLessThan(20);
  // Check with no day: the error is said and the danger edge drawn.
  await section.getByRole('button', { name: 'Check banding' }).click();
  await expect(banding).toHaveAccessibleDescription(
    /Required.*Choose the banding day/,
  );
  await expect(banding).toHaveClass(/sw-date-field-calendar-entry-invalid/);
  const edge = await banding.evaluate(
    (node) => getComputedStyle(node).borderTopColor,
  );
  const neutral = await section
    .locator('.sw-date-field-calendar-entry')
    .nth(1)
    .evaluate((node) => getComputedStyle(node).borderTopColor);
  expect(edge).not.toBe(neutral);
  await banding
    .locator('xpath=ancestor::*[contains(@class, "sw-grid")][1]')
    .screenshot({ path: testInfo.outputPath('date-field-calendar-error.png') });
  await banding.click();
  const dialog = page.getByRole('dialog', { name: 'Banding day' });
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(dialog).toBeHidden();
  await expect(banding).toBeFocused();
  await expect(banding).not.toHaveAccessibleName(/Choose a day/);
  await expect(
    section.getByRole('button', { name: /^Release day/ }),
  ).toContainText('2024');

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await banding
    .locator('xpath=ancestor::*[contains(@class, "sw-grid")][1]')
    .screenshot({ path: testInfo.outputPath('date-field-calendar.png') });

  if (testInfo.project.name === 'forced-colors') return;
  await page.getByRole('radio', { name: 'Dark' }).check();
  await expect(page.getByRole('radio', { name: 'Dark' })).toBeChecked();
  const [ink, fill] = await banding.evaluate((node) => {
    const style = getComputedStyle(node);
    return [style.color, style.backgroundColor];
  });
  // A smoke check: the neutral fill is translucent over the black page, and
  // its words stay the text colour, readable against that page.
  expect(ink).not.toBe(fill);
  expect(colorContrast(ink, 'rgb(0, 0, 0)')).toBeGreaterThanOrEqual(4.5);
  await banding
    .locator('xpath=ancestor::*[contains(@class, "sw-grid")][1]')
    .screenshot({ path: testInfo.outputPath('date-field-calendar-dark.png') });
});
