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
  await page.goto('/#command-palette');
  await expect(page.locator('#command-palette')).toBeVisible();
}

const trigger = (page: Page) =>
  page.getByRole('button', { name: 'Search', exact: true });

test('CommandPalette opens from its trigger, filters, moves and chooses', async ({
  page,
}, testInfo) => {
  await openSection(page);
  const button = trigger(page);
  await expect(button).toContainText('Search species and sites');
  await expect(button.locator('.sw-command-palette-key')).toHaveText('⌘K');
  const box = (await button.boundingBox())!;
  expect(box.height).toBeGreaterThanOrEqual(
    testInfo.project.name === 'mobile-es' ? 44 : 32,
  );
  await button.click();
  const dialog = page.getByRole('dialog', { name: 'Search' });
  await expect(dialog).toBeVisible();
  const field = dialog.getByRole('combobox', { name: 'Search' });
  await expect(field).toBeFocused();
  await expect(dialog.getByRole('group', { name: 'Species' })).toBeVisible();
  await expect(
    dialog.getByRole('option', {
      name: 'Grey heron Heron Marsh · 12 sightings',
    }),
  ).toBeVisible();
  // It fits the window, near its top.
  await expect(dialog).toBeInViewport({ ratio: 1 });
  await page.screenshot({ path: testInfo.outputPath('command-palette.png') });
  await field.fill('marsh');
  await expect(dialog.getByRole('status')).toHaveText('4 results');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  const third = dialog.getByRole('option', { name: /^Marsh harrier/ });
  await expect(third).toHaveAttribute('aria-selected', 'true');
  await expect(third.locator('.sw-command-palette-key')).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(dialog).toBeHidden();
  await expect(page.getByText('Last opened: Marsh harrier')).toBeVisible();
  await expect(button).toBeFocused();
});

test('CommandPalette opens on the shortcut, not from another text field, and closes with Escape', async ({
  page,
}) => {
  await openSection(page);
  const dialog = page.getByRole('dialog', { name: 'Search' });
  await trigger(page).focus();
  await page.keyboard.press('ControlOrMeta+k');
  await expect(dialog).toBeVisible();
  // The shortcut again, from its own field, closes it.
  await page.keyboard.press('ControlOrMeta+k');
  await expect(dialog).toBeHidden();
  await expect(trigger(page)).toBeFocused();
  // Another text field keeps the keys.
  await page.evaluate(() => {
    const notes = document.createElement('input');
    notes.setAttribute('aria-label', 'Scratch palette notes');
    document.querySelector('#command-palette')?.append(notes);
  });
  await page.getByRole('textbox', { name: 'Scratch palette notes' }).focus();
  await page.keyboard.press('ControlOrMeta+k');
  await expect(dialog).toBeHidden();
  await trigger(page).click();
  await page.keyboard.type('zebra');
  await expect(dialog.getByRole('status')).toHaveText(
    'No species or sites match',
  );
  await expect(
    dialog.getByText('No species or sites match').first(),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger(page)).toBeFocused();
});

test('CommandPalette keeps focus in its field after a press on a caption, and a press outside closes it', async ({
  page,
}) => {
  await openSection(page);
  await trigger(page).click();
  const dialog = page.getByRole('dialog', { name: 'Search' });
  await dialog.getByText('Species', { exact: true }).click();
  await expect(dialog.getByRole('combobox')).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(
    dialog.getByRole('option', { name: /^Grey heron/ }),
  ).toHaveAttribute('aria-selected', 'true');
  await page.mouse.click(5, 5);
  await expect(dialog).toBeHidden();
});

test('CommandPalette compact trigger is a 44 px glyph on touch', async ({
  page,
}, testInfo) => {
  await openSection(page);
  const compact = page.getByRole('button', { name: 'Search, compact' });
  const box = (await compact.boundingBox())!;
  const size = testInfo.project.name === 'mobile-es' ? 44 : 32;
  expect(Math.round(box.width)).toBe(size);
  expect(Math.round(box.height)).toBe(size);
});

for (const colorScheme of ['light', 'dark'] as const)
  test(`CommandPalette passes axe with its active row's detail (${colorScheme})`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme });
    await openSection(page);
    await trigger(page).click();
    await page.keyboard.press('ArrowDown');
    await expect(
      page.getByRole('option', { name: /^Grey heron/ }),
    ).toHaveAttribute('aria-selected', 'true');
    await page.addScriptTag({ path: require.resolve('axe-core') });
    const violations = await page.evaluate(() =>
      (window as Window & { axe: Axe }).axe
        .run(
          {
            include: [['.sw-command-palette'], ['.sw-command-palette-trigger']],
          },
          { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] } },
        )
        .then((result) => result.violations.map((violation) => violation.id)),
    );
    expect(violations).toEqual([]);
  });

test('CommandPalette starts on the first row each time it opens', async ({
  page,
}) => {
  await openSection(page);
  await trigger(page).click();
  const dialog = page.getByRole('dialog', { name: 'Search' });
  await page.keyboard.press('ArrowUp');
  await expect(
    dialog.getByRole('option', { name: 'Report a sighting' }),
  ).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('Escape');
  await trigger(page).click();
  await expect(
    dialog.getByRole('option', { name: /^Eurasian otter/ }),
  ).toHaveAttribute('aria-selected', 'true');
  // The status is filled once open, so its words are announced.
  await expect(dialog.getByRole('status')).toHaveText('7 results');
});
