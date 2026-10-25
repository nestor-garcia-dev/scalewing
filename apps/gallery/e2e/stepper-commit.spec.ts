import { expect, test } from '@playwright/test';

test('Stepper onCommit saves once per finished entry', async ({ page }) => {
  await page.goto('/#stepper');
  const section = page.locator('#stepper');
  const name = 'Feeding time, saved as you go';
  const count = section.getByRole('spinbutton', { name });
  const group = section.getByRole('group', { name });
  const more = group.getByRole('button', { name: 'One more' });
  const status = section.getByRole('status').filter({ hasText: /saved/i });
  await expect(status).toHaveText('Nothing saved yet');

  // Three quick presses save once, after they settle.
  await more.click();
  await more.click();
  await more.click();
  await expect(count).toHaveValue('33');
  await expect(status).toHaveText('Nothing saved yet');
  await expect(status).toHaveText('Saved 1 time, last 33 min');

  // Typing saves on Enter, never per digit.
  await count.fill('');
  await count.pressSequentially('45');
  await page.waitForTimeout(800);
  await expect(status).toHaveText('Saved 1 time, last 33 min');
  await count.press('Enter');
  await expect(status).toHaveText('Saved 2 times, last 45 min');

  // Blur after the same count saves nothing; a new count saves on blur.
  await count.press('Tab');
  await expect(status).toHaveText('Saved 2 times, last 45 min');
  await count.fill('50');
  await count.press('Tab');
  await expect(status).toHaveText('Saved 3 times, last 50 min');

  // A step key settles like a press; blur before it settles saves at once.
  await count.focus();
  await count.press('ArrowDown');
  await count.press('Tab');
  await expect(status).toHaveText('Saved 4 times, last 49 min');
  await page.waitForTimeout(800);
  await expect(status).toHaveText('Saved 4 times, last 49 min');
});
