import { expect, type Locator, test } from '@playwright/test';

import { systemColor, textContrast, tokenColor } from './contrast.js';

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

type Box = { x: number; y: number; width: number; height: number };

/** The boxes of one option's mark, label text, description and whole row. */
async function optionBoxes(radio: Locator) {
  const option = radio.locator('xpath=ancestor::label[1]');
  const description = option.locator('.sw-radio-group-option-description');
  const [mark, text, described, row] = await Promise.all([
    option.locator('.sw-radio-group-mark').boundingBox(),
    option.locator('.sw-radio-group-text').boundingBox(),
    description.boundingBox(),
    option.boundingBox(),
  ]);
  return {
    description,
    option,
    mark: mark as Box,
    text: text as Box,
    described: described as Box,
    row: row as Box,
  };
}

const end = (box: Box) => box.x + box.width;
const bottom = (box: Box) => box.y + box.height;

/** The description shares the label's line, at the row's inline end. */
function expectSameRow(
  { text, described, row }: Awaited<ReturnType<typeof optionBoxes>>,
  rtl = false,
) {
  expect(described.y).toBeLessThan(bottom(text));
  expect(bottom(described)).toBeGreaterThan(text.y);
  if (rtl) {
    expect(Math.abs(described.x - row.x)).toBeLessThan(1);
    expect(end(described)).toBeLessThanOrEqual(text.x + 0.5);
  } else {
    expect(Math.abs(end(described) - end(row))).toBeLessThan(1);
    expect(described.x).toBeGreaterThanOrEqual(end(text) - 0.5);
  }
}

/** The description is a second line that starts under the label text. */
function expectSecondLine(
  { mark, text, described }: Awaited<ReturnType<typeof optionBoxes>>,
  rtl = false,
) {
  expect(described.y).toBeGreaterThanOrEqual(bottom(text) - 0.5);
  if (rtl) {
    expect(Math.abs(end(described) - end(text))).toBeLessThan(1);
    expect(end(described)).toBeLessThan(mark.x);
  } else {
    expect(Math.abs(described.x - text.x)).toBeLessThan(1);
    expect(described.x).toBeGreaterThan(end(mark));
  }
}

test('RadioGroup option descriptions sit on their own option, describe its radio and choose it', async ({
  page,
}, testInfo) => {
  const forced = testInfo.project.name === 'forced-colors';
  const phone = testInfo.project.name === 'mobile-es';
  if (forced) await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/#radio-group');
  const section = page.locator('#radio-group');
  const group = section.getByRole('group', {
    name: 'Sighting source',
    exact: true,
  });
  // Teisoro F-007-S05 task 1365: each company's history is on its own row,
  // not under the group, where it read as the last option's.
  const observer = group.getByRole('radio', {
    name: 'Field observer',
    exact: true,
  });
  const camera = group.getByRole('radio', { name: 'Camera trap', exact: true });
  const acoustic = group.getByRole('radio', {
    name: 'Acoustic monitor',
    exact: true,
  });
  await expect(camera).toHaveAccessibleName('Camera trap');
  await expect(camera).toHaveAccessibleDescription(
    '2 sightings · last Sep 13, 2026',
  );
  await expect(observer).toHaveAccessibleName('Field observer');
  await expect(observer).toHaveAccessibleDescription('Most recent');
  await expect(
    group.getByRole('radio', { name: /sightings|Most recent|Offline/ }),
  ).toHaveCount(0);

  const cameraRow = await optionBoxes(camera);
  const observerRow = await optionBoxes(observer);
  if (phone) {
    expectSecondLine(cameraRow);
    expectSecondLine(observerRow);
  } else {
    expectSameRow(cameraRow);
    expectSameRow(observerRow);
  }

  // Muted, and readable on the page.
  const color = (element: Element) => getComputedStyle(element).color;
  expect(await cameraRow.description.evaluate(color)).toBe(
    forced
      ? await systemColor(page, 'CanvasText')
      : await tokenColor(page, 'muted'),
  );
  expect(await textContrast(cameraRow.description)).toBeGreaterThanOrEqual(4.5);
  const badge = observerRow.description.locator('.sw-badge');
  expect(await textContrast(badge)).toBeGreaterThanOrEqual(4.5);

  // A press on the description chooses its option, as the label does.
  await cameraRow.description.click();
  await expect(camera).toBeChecked();
  await badge.click();
  await expect(observer).toBeChecked();

  // A disabled option fades its description with it, and ignores a press.
  const acousticRow = await optionBoxes(acoustic);
  await expect(acoustic).toHaveAccessibleDescription(
    'Offline since Aug 2, 2026',
  );
  const opacity = (element: Element) =>
    Number(getComputedStyle(element).opacity);
  expect(await acousticRow.option.evaluate(opacity)).toBeLessThan(1);
  await acousticRow.description.click({ force: true });
  await expect(acoustic).not.toBeChecked();
  await expect(observer).toBeChecked();

  // A narrow column: the description does not fit and wraps under the text.
  const den = section.getByRole('group', { name: 'Den survey source' });
  expectSecondLine(
    await optionBoxes(den.getByRole('radio', { name: 'Camera trap' })),
  );

  // Right to left: at the left end, or on a second line under the text.
  const arabic = section.getByRole('group', { name: 'مصدر المشاهدة' });
  const arabicCamera = arabic.getByRole('radio', {
    name: 'مصيدة كاميرا',
    exact: true,
  });
  await expect(arabicCamera).toHaveAccessibleDescription(
    'مشاهدتان · آخرها ١٣ سبتمبر ٢٠٢٦',
  );
  const arabicRow = await optionBoxes(arabicCamera);
  if (phone) expectSecondLine(arabicRow, true);
  else expectSameRow(arabicRow, true);
  await arabicRow.description.click();
  await expect(arabicCamera).toBeChecked();

  await section.screenshot({
    path: testInfo.outputPath('radio-group-descriptions.png'),
  });
});
