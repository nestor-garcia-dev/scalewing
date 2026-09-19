import { expect, test } from '@playwright/test';

test('RadioGroup uses native arrow navigation and preserves long labels and disabled choices', async ({
  page,
}, testInfo) => {
  await page.goto('/#radio-group');
  const section = page.locator('#radio-group');
  const group = section.getByRole('group', { name: 'Habitat', exact: true });
  const forest = group.getByRole('radio', { name: 'Forest canopy' });
  const desert = group.getByRole('radio', { name: 'Desert scrub' });
  const wetland = group.getByRole('radio', {
    name: 'Seasonal wetland with long migration observations',
  });

  await expect(group).toHaveAttribute('aria-invalid', 'true');
  await expect(forest).not.toBeChecked();
  await expect(desert).toBeDisabled();
  const label = group.getByText(
    'Seasonal wetland with long migration observations',
  );
  const labelBounds = await label.boundingBox();
  const groupBounds = await group.boundingBox();
  expect(labelBounds).not.toBeNull();
  expect(groupBounds).not.toBeNull();
  expect((labelBounds?.x ?? 0) + (labelBounds?.width ?? 0)).toBeLessThanOrEqual(
    (groupBounds?.x ?? 0) + (groupBounds?.width ?? 0) + 1,
  );
  await section.screenshot({
    path: testInfo.outputPath('radio-group-invalid.png'),
  });

  await forest.click();
  await expect(forest).toBeChecked();
  await expect(
    section.getByText('Selected habitat: forest. Callbacks: 1.'),
  ).toBeVisible();
  await forest.press('ArrowDown');
  await expect(desert).not.toBeChecked();
  await expect(wetland).toBeChecked();
  await expect(
    section.getByText('Selected habitat: wetland. Callbacks: 2.'),
  ).toBeVisible();
  await expect(group).toHaveAttribute('aria-invalid', 'false');
});
