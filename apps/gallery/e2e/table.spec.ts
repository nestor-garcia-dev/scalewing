import { expect, test } from '@playwright/test';

test('Table scroll wrappers are keyboard stops named after their table', async ({
  page,
}) => {
  await page.goto('/#table');
  const section = page.locator('#table');
  const census = section.getByRole('group', { name: 'Example census' });
  await expect(census).toHaveAttribute('tabindex', '0');
  await expect(
    census.getByRole('table', { name: 'Example census' }),
  ).toBeVisible();
  await census.focus();
  await expect(census).toBeFocused();
  const ring = await census.evaluate(
    (element) => getComputedStyle(element).outlineStyle,
  );
  expect(ring).toBe('solid');
  await expect(
    section.getByRole('group', { name: 'Watch list' }),
  ).toHaveAttribute('tabindex', '0');
});
