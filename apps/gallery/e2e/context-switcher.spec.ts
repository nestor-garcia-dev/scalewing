import { createRequire } from 'node:module';

import { expect, test, type Page } from '@playwright/test';

const require = createRequire(import.meta.url);

/** The part of axe-core's page API this check calls. */
type Axe = {
  run: (
    context: unknown,
    options: unknown,
  ) => Promise<{ violations: { id: string }[] }>;
};

async function openSection(page: Page) {
  await page.goto('/#context-switcher');
  await expect(page.locator('#context-switcher')).toBeVisible();
}

const station = (page: Page) =>
  page
    .locator('#context-switcher')
    .getByRole('button', { name: 'Station Heron Marsh Warden' });

test('ContextSwitcher opens a filtered, grouped listbox and switches the context', async ({
  page,
}, testInfo) => {
  await openSection(page);
  const trigger = station(page);
  const box = (await trigger.boundingBox())!;
  expect(Math.round(box.width)).toBe(240);
  expect(box.height).toBeGreaterThanOrEqual(
    testInfo.project.name === 'mobile-es' ? 44 : 32,
  );
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Station' });
  await expect(dialog).toBeVisible();
  const field = dialog.getByRole('combobox', { name: 'Find a station' });
  await expect(field).toBeFocused();
  // Every part is read in the option's name, spaces kept.
  await expect(
    dialog.getByRole('option', { name: 'All stations 7 need you' }),
  ).toBeVisible();
  const heron = dialog.getByRole('option', { name: 'Heron Marsh Warden' });
  await expect(heron).toHaveAttribute('aria-selected', 'true');
  await expect(
    dialog.getByRole('group', { name: 'Stations you run' }),
  ).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('context-switcher.png') });
  // The popup is in the viewport and at least as wide as the trigger.
  const popup = (await dialog.boundingBox())!;
  expect(popup.width).toBeGreaterThanOrEqual(box.width - 1);
  await expect(dialog).toBeInViewport({ ratio: 1 });
  // Typing narrows the options; the arrows and Enter choose.
  await field.fill('ran');
  await expect(dialog.getByRole('option')).toHaveCount(1);
  await page.keyboard.press('Enter');
  await expect(dialog).toBeHidden();
  await expect(
    page
      .locator('#context-switcher')
      .getByRole('button', { name: /^Station Pine Ridge/ })
      .first(),
  ).toBeFocused();
  await expect(page.getByText('Last choice: Pine Ridge')).toBeVisible();
});

test('ContextSwitcher announces when nothing matches and closes with Escape', async ({
  page,
}) => {
  await openSection(page);
  await station(page).click();
  const dialog = page.getByRole('dialog', { name: 'Station' });
  await dialog.getByRole('combobox').fill('otter');
  await expect(dialog.getByRole('status')).toHaveText('No station matches');
  await expect(dialog.getByText('No station matches').first()).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(station(page)).toBeFocused();
});

test('ContextSwitcher season pill: keys, typeahead, badges and a footer command', async ({
  page,
}) => {
  await openSection(page);
  const season = page.getByRole('button', { name: 'Season Autumn 2026' });
  await season.focus();
  await page.keyboard.press('ArrowDown');
  const list = page.getByRole('listbox', { name: 'Season' });
  await expect(list).toBeFocused();
  await expect(
    list.getByRole('option', { name: 'Autumn 2026 Current Live' }),
  ).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('Home');
  await expect(list).toHaveAttribute(
    'aria-activedescendant',
    (await list
      .getByRole('option', { name: /^Spring 2027/ })
      .getAttribute('id'))!,
  );
  await page.keyboard.press('End');
  await page.keyboard.press('a');
  await page.keyboard.press('Enter');
  await expect(page.getByText('Last choice: Autumn 2026')).toHaveCount(0);
  await expect(season).toBeFocused();
  // Choosing the current one changes nothing; a new one does.
  await season.click();
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('Enter');
  await expect(page.getByText('Last choice: Spring 2027')).toBeVisible();
  // Shift+Tab back to the trigger closes it.
  const again = page.getByRole('button', { name: 'Season Spring 2027' });
  await again.click();
  await page.keyboard.press('Shift+Tab');
  await expect(again).toBeFocused();
  await expect(page.getByRole('dialog', { name: 'Season' })).toBeHidden();
  // Tab reaches the footer command, which closes the popup and runs.
  await page.getByRole('button', { name: 'Season Spring 2027' }).click();
  await page.keyboard.press('Tab');
  const command = page.getByRole('button', { name: 'Start a new season' });
  await expect(command).toBeFocused();
  await command.press('Enter');
  await expect(page.getByText('Last choice: Start a new season')).toBeVisible();
  await expect(page.getByRole('dialog', { name: 'Season' })).toBeHidden();
});

test('ContextSwitcher icon trigger is named by its label and the current option', async ({
  page,
}, testInfo) => {
  await openSection(page);
  const icon = page
    .locator('#context-switcher')
    .getByRole('button', { name: 'Station Heron Marsh', exact: true });
  const box = (await icon.boundingBox())!;
  const size = testInfo.project.name === 'mobile-es' ? 44 : 32;
  expect(Math.round(box.width)).toBe(size);
  expect(Math.round(box.height)).toBe(size);
  await icon.click();
  await expect(page.getByRole('listbox', { name: 'Station' })).toBeFocused();
  await page.mouse.click(5, 5);
  await expect(page.getByRole('dialog', { name: 'Station' })).toBeHidden();
});

test('ContextSwitcher mirrors its popup in right-to-left', async ({ page }) => {
  // Wide enough for the popup to line up with the trigger's start.
  await page.setViewportSize({ width: 1280, height: 900 });
  await openSection(page);
  await page.evaluate(() =>
    document.documentElement.setAttribute('dir', 'rtl'),
  );
  const season = page.getByRole('button', { name: 'Season Autumn 2026' });
  await season.click();
  const trigger = (await season.boundingBox())!;
  const popup = (await page
    .getByRole('dialog', { name: 'Season' })
    .boundingBox())!;
  // Lined up with the trigger's start, its right edge in right-to-left.
  expect(Math.round(popup.x + popup.width)).toBeCloseTo(
    Math.round(trigger.x + trigger.width),
    -1,
  );
});

for (const colorScheme of ['light', 'dark'] as const)
  test(`ContextSwitcher keeps 4.5:1 on the active row's detail (${colorScheme})`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme });
    await openSection(page);
    await page.getByRole('button', { name: 'Season Autumn 2026' }).click();
    const active = page.getByRole('option', {
      name: 'Autumn 2026 Current Live',
    });
    await expect(active).toHaveAttribute('data-active', 'true');
    await page.addScriptTag({ path: require.resolve('axe-core') });
    const violations = await page.evaluate(() =>
      (window as Window & { axe: Axe }).axe
        .run(
          { include: [['.sw-context-switcher-popup']] },
          { runOnly: ['color-contrast'] },
        )
        .then((result) => result.violations.map((violation) => violation.id)),
    );
    expect(violations).toEqual([]);
  });

test('ContextSwitcher keeps focus after a press on a caption', async ({
  page,
}) => {
  await openSection(page);
  await station(page).click();
  const dialog = page.getByRole('dialog', { name: 'Station' });
  const field = dialog.getByRole('combobox');
  await dialog.getByText('Stations you run').click();
  await expect(field).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(field).toHaveAttribute(
    'aria-activedescendant',
    (await dialog
      .getByRole('option', { name: /^Pine Ridge/ })
      .getAttribute('id'))!,
  );
  // A press on a row's padding before releasing elsewhere keeps it too.
  await dialog
    .getByRole('option', { name: /^Pine Ridge/ })
    .dispatchEvent('mousedown');
  await expect(field).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(station(page)).toBeFocused();
});

test('ContextSwitcher keeps the keys’ row while the list scrolls under a still pointer', async ({
  page,
}) => {
  await openSection(page);
  await page.getByRole('button', { name: 'Season Autumn 2026' }).click();
  const list = page.getByRole('listbox', { name: 'Season' });
  await list.evaluate((node) => {
    (node as HTMLElement).style.maxHeight = '50px';
  });
  const box = (await list.boundingBox())!;
  await page.mouse.move(box.x + 20, box.y + 10);
  await list.focus();
  await page.keyboard.press('End');
  const last = (await list
    .getByRole('option', { name: /^Spring 2026/ })
    .getAttribute('id'))!;
  await expect(list).toHaveAttribute('aria-activedescendant', last);
  expect(await list.evaluate((node) => node.scrollTop)).toBeGreaterThan(0);
  await page.waitForTimeout(200);
  await expect(list).toHaveAttribute('aria-activedescendant', last);
});

test('ContextSwitcher passes axe with its popup open', async ({ page }) => {
  await openSection(page);
  await station(page).click();
  await expect(page.getByRole('dialog', { name: 'Station' })).toBeVisible();
  await page.addScriptTag({ path: require.resolve('axe-core') });
  const violations = await page.evaluate(() =>
    (window as Window & { axe: Axe }).axe
      .run(
        {
          include: [['.sw-context-switcher'], ['.sw-context-switcher-popup']],
        },
        { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] } },
      )
      .then((result) => result.violations.map((violation) => violation.id)),
  );
  expect(violations).toEqual([]);
});
