import { expect, test } from '@playwright/test';

test('Select in a glass card opens over the card below it', async ({
  page,
}, testInfo) => {
  await page.goto('/#select');
  const section = page.locator('#select');
  const trigger = section.getByRole('combobox', { name: 'Den range' });
  await trigger.click();
  const last = section.getByRole('option', { name: 'Ocean' });
  await expect(last).toBeVisible();
  await section.screenshot({ path: testInfo.outputPath('select-in-card.png') });
  // A plain click lands on whatever paints on top; an option under the next
  // card would send it to that card's field instead.
  await last.click();
  await expect(trigger).toHaveText('Ocean');
  await expect(section.getByRole('listbox')).toHaveCount(0);
});
