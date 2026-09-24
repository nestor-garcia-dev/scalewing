import { expect, test } from '@playwright/test';

test('ActionMenu returns focus to its trigger after a command dialog closes', async ({
  page,
}) => {
  await page.goto('/#action-menu');
  const section = page.locator('#action-menu');
  const trigger = section.getByRole('button', { name: 'Sighting actions' });

  await trigger.focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('End');
  await expect(
    page.getByRole('menuitem', { name: 'Delete sighting' }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  const confirm = page.getByRole('dialog', { name: 'Delete this sighting?' });
  await expect(confirm).toBeVisible();
  await expect(page.getByRole('menu')).toBeHidden();
  await page.keyboard.press('Escape');
  await expect(confirm).toBeHidden();
  await expect(trigger).toBeFocused();

  await trigger.click();
  await page.getByRole('menuitem', { name: 'Delete sighting' }).click();
  await expect(confirm).toBeVisible();
  await confirm.getByRole('button', { name: 'Keep sighting' }).click();
  await expect(confirm).toBeHidden();
  await expect(trigger).toBeFocused();
});
