import { expect, test } from '@playwright/test';

test('a sized Field caps its control at its width, never past the column', async ({
  page,
}, testInfo) => {
  await page.goto('/#field');
  const section = page.locator('#field');
  const bodyLength = section.locator('input[name="sized-body-length"]');
  const nests = section.locator('input[name="sized-nests"]');
  const habitat = section.locator('select[name="sized-habitat"]');
  const full = section.locator('input[name="sighting-name"]');
  const frame = bodyLength.locator('xpath=..');
  const remPx = 16;
  const widthOf = async (locator: typeof full) =>
    (await locator.boundingBox())?.width ?? 0;

  // An adorned input's frame takes the cap (sm, 6rem); an input and a
  // select take theirs (xs 4rem, lg 12rem, or the column on a narrow phone).
  const column = await widthOf(full);
  expect(Math.round(await widthOf(frame))).toBe(Math.min(6 * remPx, column));
  expect(Math.round(await widthOf(nests))).toBe(Math.min(4 * remPx, column));
  expect(Math.round(await widthOf(habitat))).toBe(
    Math.round(Math.min(12 * remPx, column)),
  );
  // The select keeps the md control height.
  const fieldHeight = await full.evaluate(
    (node) => node.getBoundingClientRect().height,
  );
  expect(
    Math.round(
      await habitat.evaluate((node) => node.getBoundingClientRect().height),
    ),
  ).toBe(Math.round(fieldHeight));
  // An xs sized select keeps the xs control height of the canopy field's frame.
  const region = section.locator('select[name="sized-region"]');
  const canopy = section
    .locator('input[name="canopy-cover"]')
    .locator('xpath=..');
  const heightOf = (locator: typeof full) =>
    locator.evaluate((node) => Math.round(node.getBoundingClientRect().height));
  expect(await heightOf(region)).toBe(await heightOf(canopy));
  expect(Math.round(await widthOf(region))).toBe(Math.min(8 * remPx, column));
  // The description keeps the column's width.
  const description = section.getByText('Measured from the bill to the tail');
  expect(Math.round(await widthOf(description))).toBe(Math.round(column));
  // The control starts at the column's start.
  expect(Math.round((await nests.boundingBox())?.x ?? 0)).toBe(
    Math.round((await full.boundingBox())?.x ?? 0),
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await section
    .locator('.sw-field-sized')
    .first()
    .locator('xpath=..')
    .screenshot({ path: testInfo.outputPath('field-width.png') });

  if (testInfo.project.name === 'forced-colors') return;
  await page.getByRole('radio', { name: 'Dark' }).check();
  await expect(page.getByRole('radio', { name: 'Dark' })).toBeChecked();
  expect(Math.round(await widthOf(nests))).toBe(Math.min(4 * remPx, column));
});
