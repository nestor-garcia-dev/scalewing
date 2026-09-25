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

test('Numeric table cells align to the end, labels to the start', async ({
  page,
}) => {
  await page.goto('/#table');
  const table = page
    .locator('#table')
    .getByRole('table', { name: 'Example census' });
  const alignment = (name: string) =>
    table
      .getByRole('columnheader', { name })
      .evaluate((element) => getComputedStyle(element).textAlign);
  expect(await alignment('Species')).toBe('start');
  expect(await alignment('Sightings')).toBe('end');
  const firstRow = table.getByRole('row').nth(1);
  const cellAlignment = (index: number) =>
    firstRow
      .getByRole('cell')
      .nth(index)
      .evaluate((element) => getComputedStyle(element).textAlign);
  expect(await cellAlignment(0)).toBe('start');
  expect(await cellAlignment(2)).toBe('end');
});
