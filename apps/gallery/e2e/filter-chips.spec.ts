import { expect, test } from '@playwright/test';

import { textContrast } from './contrast.js';

test('FilterChips wraps long labels and supports native single-choice keyboard behavior', async ({
  page,
}, testInfo) => {
  await page.goto('/#filter-chips');
  if (testInfo.project.name === 'forced-colors') {
    await page.emulateMedia({ forcedColors: 'active' });
    expect(
      await page.evaluate(() => matchMedia('(forced-colors: active)').matches),
    ).toBe(true);
  }
  const section = page.locator('#filter-chips');
  const group = section.getByRole('group', { name: 'Sighting filters' });
  const all = group.getByRole('radio', { name: 'All sightings 42' });
  const forest = group.getByRole('radio', {
    name: 'Forest canopy records 18',
  });
  const desert = group.getByRole('radio', { name: 'Desert scrub 0' });
  const tundra = group.getByRole('radio', { name: 'Tundra transects 0' });
  const wetland = group.getByRole('radio', {
    name: 'Wetland observations across the migration season 12',
  });
  const selva = group.getByRole('radio', {
    name: 'Observaciones de selva tropical 8',
  });
  await expect(all).toBeChecked();
  await expect(desert).toBeDisabled();
  const quietFace = tundra.locator('xpath=..').locator('.sw-filter-chip-face');
  const plainFace = forest.locator('xpath=..').locator('.sw-filter-chip-face');
  // A zero-count chip is quiet in color, never faded (Teisoro NSF-1).
  await expect(quietFace).toHaveCSS('opacity', '1');
  expect(await textContrast(quietFace)).toBeGreaterThanOrEqual(4.5);
  if (testInfo.project.name !== 'forced-colors') {
    const colorOf = (face: typeof quietFace) =>
      face.evaluate((node) => getComputedStyle(node).color);
    expect(await colorOf(quietFace)).not.toBe(await colorOf(plainFace));
  }
  await expect(group.locator('.sw-filter-chip-count').first()).toHaveCSS(
    'font-variant-numeric',
    'tabular-nums',
  );
  await expect(group.locator('.sw-filter-chips-options')).toHaveCSS(
    'flex-wrap',
    'wrap',
  );
  const bounds = await selva.boundingBox();
  const groupBounds = await group.boundingBox();
  expect(bounds).not.toBeNull();
  expect(groupBounds).not.toBeNull();
  expect((bounds?.x ?? 0) + (bounds?.width ?? 0)).toBeLessThanOrEqual(
    (groupBounds?.x ?? 0) + (groupBounds?.width ?? 0) + 1,
  );
  await section.screenshot({ path: testInfo.outputPath('filter-chips.png') });

  await forest.click();
  await expect(forest).toBeChecked();
  await expect(
    section.getByText('Selected filter: forest. Callbacks: 1.'),
  ).toBeVisible();
  await forest.press('ArrowRight');
  await expect(desert).not.toBeChecked();
  await expect(tundra).toBeChecked();
  await expect(quietFace).toHaveCSS('opacity', '1');
  expect(await textContrast(quietFace)).toBeGreaterThanOrEqual(4.5);
  await expect(
    section.getByText('Selected filter: tundra. Callbacks: 2.'),
  ).toBeVisible();
  await tundra.press('ArrowRight');
  await expect(wetland).toBeChecked();
  await expect(
    section.getByText('Selected filter: wetland. Callbacks: 3.'),
  ).toBeVisible();
  await selva.focus();
  await selva.press('Space');
  await expect(selva).toBeChecked();
  await expect(
    section.getByText('Selected filter: selva. Callbacks: 4.'),
  ).toBeVisible();
  await section.getByRole('button', { name: 'Add sighting' }).click();
  await expect(
    group.getByRole('radio', { name: 'All sightings 43' }),
  ).toBeVisible();
  await expect(selva).toBeChecked();
});

test('FilterChips required with an error marks the group and clears on a choice', async ({
  page,
}, testInfo) => {
  await page.goto('/#filter-chips');
  const forced = testInfo.project.name === 'forced-colors';
  if (forced) await page.emulateMedia({ forcedColors: 'active' });
  const group = page.getByRole('group', { name: /Why remove this sighting/ });
  await expect(group.getByRole('radio', { checked: true })).toHaveCount(0);
  for (const radio of await group.getByRole('radio').all())
    await expect(radio).toHaveJSProperty('required', true);
  await expect(group).toHaveAccessibleDescription(
    'The reason goes on the census record.',
  );
  await page.getByRole('button', { name: 'Remove sighting' }).click();
  await expect(group).toHaveAttribute('aria-invalid', 'true');
  await expect(group).toHaveAccessibleDescription(
    'The reason goes on the census record. Pick a reason to remove the sighting.',
  );
  const face = group.locator('.sw-filter-chip-face').first();
  // Danger in normal colours, Mark in forced colours.
  const [edge, expected] = await face.evaluate(
    (node, colour) => {
      const probe = document.createElement('span');
      probe.style.color = colour;
      node.append(probe);
      const value = getComputedStyle(probe).color;
      probe.remove();
      return [getComputedStyle(node).borderTopColor, value];
    },
    forced ? 'Mark' : 'var(--sw-color-danger)',
  );
  expect(edge).toBe(expected);
  await group.screenshot({
    path: testInfo.outputPath('filter-chips-error.png'),
  });
  // From the keyboard: Tab into the group with nothing checked, then an
  // arrow key chooses and clears the error.
  await page.getByRole('button', { name: 'Remove sighting' }).focus();
  await page.keyboard.press('Shift+Tab');
  await expect(group.getByRole('radio').last()).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(
    group.getByRole('radio', { name: 'Wrong species' }),
  ).toBeChecked();
  await expect(group).not.toHaveAttribute('aria-invalid', 'true');
  await group.getByRole('radio', { name: 'Counted twice' }).check();
  await page.getByRole('button', { name: 'Remove sighting' }).click();
  await expect(page.getByTestId('filter-chips-saved')).toHaveText(
    'Removed: duplicate',
  );
});
