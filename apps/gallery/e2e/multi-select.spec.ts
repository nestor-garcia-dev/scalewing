import { expect, test } from '@playwright/test';

test('MultiSelect discloses checkboxes under its trigger, filters, and returns focus', async ({
  page,
}, testInfo) => {
  await page.goto('/#multi-select');
  if (testInfo.project.name === 'forced-colors')
    await page.emulateMedia({ forcedColors: 'active' });
  const section = page.locator('#multi-select');
  const trigger = section.getByRole('button', { name: 'Show All sightings' });
  const shown = section.getByTestId('multi-select-shown');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');

  await trigger.click();
  const panel = page.getByRole('group', { name: 'Show' });
  await expect(panel).toBeVisible();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(panel.getByRole('checkbox', { name: 'Forest' })).toBeFocused();
  // The panel opens under the trigger, lined up with its start.
  const triggerBox = (await trigger.boundingBox())!;
  const panelBox = (await panel.boundingBox())!;
  expect(panelBox.y).toBeGreaterThanOrEqual(triggerBox.y + triggerBox.height);
  expect(Math.abs(panelBox.x - triggerBox.x)).toBeLessThanOrEqual(1);
  // Rows are md (44) targets; marks are hidden.
  const row = panel.locator('.sw-multi-select-option').first();
  expect((await row.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  await expect(panel.locator('.sw-multi-select-icon').first()).toHaveAttribute(
    'aria-hidden',
    'true',
  );
  await panel.screenshot({ path: testInfo.outputPath('multi-select.png') });

  await panel.getByRole('checkbox', { name: 'Lake' }).click();
  await expect(shown).toHaveText('Showing: forest, savanna, reef, station');
  await expect(
    section.getByRole('button', { name: 'Show 4 kinds' }),
  ).toBeVisible();
  await panel.getByRole('button', { name: 'Clear' }).click();
  await expect(shown).toHaveText('Showing: nothing');
  await panel.getByRole('button', { name: 'All' }).click();
  await expect(shown).toHaveText(
    'Showing: forest, lake, savanna, reef, station',
  );

  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
  await expect(trigger).toBeFocused();

  // A press outside closes it.
  await trigger.click();
  await expect(panel).toBeVisible();
  await page.mouse.click(5, 5);
  await expect(panel).toBeHidden();
});

test('MultiSelect lines up with its end edge, mirrors in RTL, and stays shut while disabled', async ({
  page,
}) => {
  await page.goto('/#multi-select');
  const section = page.locator('#multi-select');
  await expect(
    section.getByRole('button', { name: 'Include Every habitat' }),
  ).toBeDisabled();

  const trigger = section.getByRole('button', { name: /^Filter/ });
  await trigger.click();
  const panel = page
    .locator('.sw-multi-select-panel')
    .and(page.getByRole('group', { name: 'Filter', exact: true }));
  await expect(panel).toBeVisible();
  let triggerBox = (await trigger.boundingBox())!;
  let panelBox = (await panel.boundingBox())!;
  // align="end": the panel's right edge meets the trigger's right edge.
  expect(
    Math.abs(panelBox.x + panelBox.width - (triggerBox.x + triggerBox.width)),
  ).toBeLessThanOrEqual(1);
  await page.keyboard.press('Escape');

  // In RTL the start edge is the right one, so the first trigger's panel
  // lines up with the trigger's right edge.
  await section.evaluate((node) => node.setAttribute('dir', 'rtl'));
  const first = section.getByRole('button', { name: /^Show/ });
  await first.click();
  const showPanel = page.getByRole('group', { name: 'Show' });
  await expect(showPanel).toBeVisible();
  triggerBox = (await first.boundingBox())!;
  panelBox = (await showPanel.boundingBox())!;
  const fits = triggerBox.x + triggerBox.width - panelBox.width >= 8;
  if (fits)
    expect(
      Math.abs(panelBox.x + panelBox.width - (triggerBox.x + triggerBox.width)),
    ).toBeLessThanOrEqual(1);
  else expect(panelBox.x).toBeGreaterThanOrEqual(0);
});
