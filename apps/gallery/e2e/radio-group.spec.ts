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

test('RadioGroup options show a glyph beside the label, named by the label', async ({
  page,
}, testInfo) => {
  const forced = testInfo.project.name === 'forced-colors';
  if (forced) await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/#radio-group');
  const group = page
    .locator('#radio-group')
    .getByRole('group', { name: 'Sighting source' });
  // Teisoro CHK-13: a real radio group with a glyph per option, each
  // option still named by its text alone.
  const observer = group.getByRole('radio', {
    name: 'Field observer',
    exact: true,
  });
  const camera = group.getByRole('radio', { name: 'Camera trap', exact: true });
  await expect(observer).toBeChecked();
  const option = camera.locator('xpath=ancestor::label[1]');
  const icon = option.locator('.sw-radio-group-icon');
  const text = option.locator('.sw-radio-group-text');
  await expect(icon).toHaveAttribute('aria-hidden', 'true');
  await expect(icon.locator('svg')).toBeVisible();
  const mark = option.locator('.sw-radio-group-mark');
  const [markBox, iconBox, textBox] = await Promise.all([
    mark.boundingBox(),
    icon.boundingBox(),
    text.boundingBox(),
  ]);
  expect(markBox!.x + markBox!.width).toBeLessThanOrEqual(iconBox!.x);
  expect(iconBox!.x + iconBox!.width).toBeLessThanOrEqual(textBox!.x);
  // Vertically centred on the label line.
  expect(
    Math.abs(
      iconBox!.y + iconBox!.height / 2 - (textBox!.y + textBox!.height / 2),
    ),
  ).toBeLessThan(2);
  // Drawn in the label's color, so it reads as part of it.
  const color = (element: Element) => getComputedStyle(element).color;
  expect(await icon.evaluate(color)).toBe(await text.evaluate(color));
  await icon.click();
  await expect(camera).toBeChecked();
  await page.locator('#radio-group').screenshot({
    path: testInfo.outputPath('radio-group-icons.png'),
  });
});
