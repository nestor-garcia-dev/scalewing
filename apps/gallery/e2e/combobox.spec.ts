import { expect, test } from '@playwright/test';

test('Combobox suggests, filters, chooses and adds from the keyboard and the pointer', async ({
  page,
}, testInfo) => {
  await page.goto('/#combobox');
  const forced = testInfo.project.name === 'forced-colors';
  if (forced) await page.emulateMedia({ forcedColors: 'active' });
  const box = page.getByRole('combobox', { name: 'Station' });
  const chosen = page.getByTestId('combobox-chosen');
  await expect(box).toHaveAttribute('aria-expanded', 'false');

  // A press opens the suggestions under the input, at least as wide.
  await box.click();
  const list = page.getByRole('listbox', { name: 'Stations' });
  const live = page.locator('#combobox .sw-combobox > [role="status"]').first();
  await expect(live).toHaveText('2 stations');
  await expect(list).toBeVisible();
  await expect(box).toHaveAttribute('aria-expanded', 'true');
  await expect(
    page.getByRole('group', { name: "Kim's stations" }),
  ).toBeVisible();
  await expect(
    page.getByText('Not here? Type the name to search every station.'),
  ).toBeVisible();
  const inputBox = (await box.boundingBox())!;
  const popup = page.locator('.sw-combobox-popup');
  const popupBox = (await popup.boundingBox())!;
  expect(popupBox.y).toBeGreaterThanOrEqual(inputBox.y + inputBox.height - 1);
  expect(popupBox.width).toBeGreaterThanOrEqual(inputBox.width - 1);
  // Options are md (44) rows.
  const lagoon = list.getByRole('option', { name: /Blue Lagoon/ });
  expect((await lagoon.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  await popup.screenshot({ path: testInfo.outputPath('combobox.png') });

  // The keyboard moves the active option; focus stays in the input.
  await page.keyboard.press('ArrowDown');
  await expect(box).toBeFocused();
  const firstId = await lagoon.getAttribute('id');
  await expect(box).toHaveAttribute('aria-activedescendant', firstId!);
  await expect(lagoon).toHaveAttribute('aria-selected', 'true');
  if (forced) {
    // The active row takes the system Highlight.
    const highlight = await page.evaluate(() => {
      const probe = document.createElement('div');
      probe.style.background = 'Highlight';
      document.body.append(probe);
      const colour = getComputedStyle(probe).backgroundColor;
      probe.remove();
      return colour;
    });
    await expect(lagoon).toHaveCSS('background-color', highlight);
  } else
    await expect(lagoon).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  // The pointer moves the active option too.
  const delta = list.getByRole('option', { name: /Delta hide/ });
  await delta.hover();
  await expect(box).toHaveAttribute(
    'aria-activedescendant',
    (await delta.getAttribute('id'))!,
  );
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('Enter');
  await expect(box).toHaveValue('Blue Lagoon');
  await expect(chosen).toHaveText('Chosen: Blue Lagoon');
  await expect(list).toBeHidden();

  // Typing filters; the disabled option is shown and never chosen.
  await box.fill('o');
  await expect(page.getByRole('group', { name: 'All stations' })).toBeVisible();
  const quarry = list.getByRole('option', { name: /Old quarry/ });
  await expect(quarry).toHaveAttribute('aria-disabled', 'true');
  await quarry.click({ force: true });
  await expect(chosen).toHaveText('Chosen: Blue Lagoon');
  await expect(box).toBeFocused();
  // A press on an option chooses it.
  await list.getByRole('option', { name: /Weir pool/ }).click();
  await expect(chosen).toHaveText('Chosen: Weir pool');
  await expect(box).toBeFocused();

  // Nothing matches: the empty text and the action; Enter on the action.
  await box.fill('heronry');
  await expect(page.locator('.sw-combobox-empty')).toHaveText(
    'No station matches.',
  );
  await expect(live).toHaveText('No station matches.');
  const add = list.getByRole('option', { name: /New station “heronry”/ });
  await page.keyboard.press('ArrowDown');
  await expect(box).toHaveAttribute(
    'aria-activedescendant',
    (await add.getAttribute('id'))!,
  );
  await page.keyboard.press('Enter');
  await expect(chosen).toHaveText('Chosen: New station: heronry');

  // Escape closes, a second Escape empties; a press outside closes.
  await box.fill('del');
  await expect(list).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(list).toBeHidden();
  await page.keyboard.press('Escape');
  await expect(box).toHaveValue('');
  await box.click();
  await expect(list).toBeVisible();
  await page.mouse.click(5, 5);
  await expect(list).toBeHidden();
});

test('Combobox carries a Field error and a compact disabled size', async ({
  page,
}) => {
  await page.goto('/#combobox');
  await page.getByRole('button', { name: 'Check the station' }).click();
  const box = page.getByRole('combobox', { name: 'Station' });
  await expect(box).toHaveAttribute('aria-invalid', 'true');
  await expect(box).toHaveAccessibleDescription('Pick a station.');
  const ring = page.getByRole('combobox', { name: 'Ring number' });
  await expect(ring).toBeDisabled();
  await ring.click({ force: true });
  await expect(page.getByRole('listbox', { name: 'Ring number' })).toHaveCount(
    0,
  );
});
