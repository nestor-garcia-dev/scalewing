import { expect, test, type Page } from '@playwright/test';

async function flightTime(page: Page) {
  await page.goto('/#stepper');
  const section = page.locator('#stepper');
  await expect(section).toBeVisible();
  const count = section.getByRole('spinbutton', { name: 'Flight time' });
  const group = section.getByRole('group', { name: 'Flight time' });
  return {
    section,
    count,
    group,
    frame: group.locator('.sw-stepper-count'),
    unit: group.locator('.sw-stepper-unit'),
  };
}

test('Stepper unit sits after the count in one frame and is read with it', async ({
  page,
}, testInfo) => {
  if (testInfo.project.name === 'forced-colors')
    await page.emulateMedia({ forcedColors: 'active' });
  const { section, count, group, frame, unit } = await flightTime(page);

  await expect(unit).toHaveText('min');
  await expect(unit).toHaveAttribute('aria-hidden', 'true');
  await expect(count).toHaveAttribute('aria-valuetext', '90 min');
  await group.getByRole('button', { name: 'One more' }).click();
  await expect(count).toHaveValue('95');
  await expect(count).toHaveAttribute('aria-valuetext', '95 min');

  // The unit follows the digits inside the frame, at the md control height.
  const digits = (await count.boundingBox())!;
  const word = (await unit.boundingBox())!;
  const outer = (await frame.boundingBox())!;
  expect(word.x).toBeGreaterThanOrEqual(digits.x + digits.width);
  expect(word.x + word.width).toBeLessThanOrEqual(outer.x + outer.width);
  expect(Math.round(outer.height)).toBe(44);
  for (const button of await group.getByRole('button').all())
    expect(Math.round((await button.boundingBox())!.height)).toBe(44);

  // The frame never follows the count.
  await count.fill('1');
  expect((await frame.boundingBox())!.width).toBe(outer.width);
  await count.fill('2400');
  expect((await frame.boundingBox())!.width).toBe(outer.width);

  // A press on the unit focuses the count; the frame draws the ring.
  await count.blur();
  await unit.click();
  await expect(count).toBeFocused();
  await expect(frame).toHaveCSS('outline-style', 'solid');

  // An empty count with a unit has no value words.
  const chicks = section.getByRole('spinbutton', { name: 'Chicks' });
  await expect(chicks).toHaveValue('');
  await expect(chicks).not.toHaveAttribute('aria-valuetext', /.*/);

  // The error and disabled states land on the frame.
  const nest = section.getByRole('group', { name: 'Time off the nest' });
  await expect(nest.getByRole('spinbutton')).toHaveAttribute(
    'aria-invalid',
    'true',
  );
  await expect(
    section
      .getByRole('group', { name: 'Roost, locked' })
      .locator('.sw-stepper-count'),
  ).toHaveCSS('border-top-style', 'dashed');

  // A full-width stepper with a unit fills its column, the pair centred.
  const wide = section
    .getByRole('group', { name: 'Spoonbill feeding time' })
    .locator('.sw-stepper-count');
  expect((await wide.boundingBox())!.width).toBeGreaterThan(outer.width);

  await section.screenshot({ path: testInfo.outputPath('stepper-unit.png') });
});

test('Stepper unit follows the count in right-to-left', async ({ page }) => {
  const { count, unit } = await flightTime(page);
  await page.evaluate(() =>
    document.documentElement.setAttribute('dir', 'rtl'),
  );
  const digits = (await count.boundingBox())!;
  const word = (await unit.boundingBox())!;
  expect(word.x + word.width).toBeLessThanOrEqual(digits.x);
});
