import { expect, test } from '@playwright/test';

test('Stepper steps, types, stops at its bounds and keeps one tab stop', async ({
  page,
}, testInfo) => {
  await page.goto('/#stepper');
  if (testInfo.project.name === 'forced-colors') {
    await page.emulateMedia({ forcedColors: 'active' });
    expect(
      await page.evaluate(() => matchMedia('(forced-colors: active)').matches),
    ).toBe(true);
  }
  const section = page.locator('#stepper');
  const herons = section.getByRole('spinbutton', { name: 'Herons' });
  const group = section.getByRole('group', { name: 'Herons' });
  const less = group.getByRole('button', { name: 'One less' });
  const more = group.getByRole('button', { name: 'One more' });

  // An empty box counts as min: − is stopped, + gives one.
  await expect(herons).toHaveValue('');
  await expect(less).toBeDisabled();
  await more.click();
  await expect(herons).toHaveValue('1');

  // Typed entry, then arrow keys on the one tab stop.
  await herons.fill('12');
  await herons.press('ArrowUp');
  await expect(herons).toHaveValue('13');
  await herons.press('ArrowDown');
  await expect(herons).toHaveValue('12');
  await herons.pressSequentially('x.');
  await expect(herons).toHaveValue('12');

  // The buttons are not tab stops: Tab leaves Herons for the next count.
  await herons.focus();
  await page.keyboard.press('Tab');
  await expect(
    section.getByRole('spinbutton', { name: 'Egrets' }),
  ).toBeFocused();

  // + stops at max.
  const egrets = section.getByRole('group', { name: 'Egrets' });
  await expect(egrets.getByRole('button', { name: 'One more' })).toBeDisabled();

  // Every part is the md control height (44).
  for (const part of [herons, less, more]) {
    const box = (await part.boundingBox())!;
    expect(Math.round(box.height)).toBe(44);
  }
  // The count is fixed width: a longer count does not widen it.
  const width = (await herons.boundingBox())!.width;
  await herons.fill('4000');
  expect((await herons.boundingBox())!.width).toBe(width);

  // A count past the nests says why, in a polite message tied to the box.
  const nests = section.getByRole('spinbutton', { name: 'Nests with eggs' });
  await expect(nests).toHaveAttribute('aria-invalid', 'true');
  await expect(section.getByText('Only 12 nests on the island.')).toBeVisible();
  // A wider message or label never pulls + away from the count.
  const besideCount = async (name: string) => {
    const box = (await section
      .getByRole('spinbutton', { name })
      .boundingBox())!;
    const plus = (await section
      .getByRole('group', { name })
      .getByRole('button', { name: 'One more' })
      .boundingBox())!;
    expect(Math.round(plus.x - (box.x + box.width))).toBe(4);
  };
  await besideCount('Nests with eggs');
  await besideCount('Eggs counted in the far reed beds');
  await section
    .getByRole('group', { name: 'Nests with eggs' })
    .getByRole('button', { name: 'One less' })
    .click();
  await expect(nests).toHaveValue('12');
  await expect(nests).not.toHaveAttribute('aria-invalid', 'true');

  // Read-only keeps its buttons' room, so it lines up with an editable one.
  const counted = section.getByRole('spinbutton', {
    name: 'Pelicans, counted',
  });
  await expect(counted).toHaveAttribute('readonly', '');
  await expect(
    section
      .getByRole('group', { name: 'Pelicans, counted' })
      .getByRole('button'),
  ).toHaveCount(0);

  // A full-width stepper fills its column.
  const spoonbills = section.getByRole('spinbutton', { name: 'Spoonbills' });
  const full = (await spoonbills.boundingBox())!.width;
  expect(full).toBeGreaterThan(width);

  await section.screenshot({ path: testInfo.outputPath('stepper.png') });
});
