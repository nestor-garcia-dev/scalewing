import { expect, test } from '@playwright/test';

import { axeViolations } from './axe-scan.js';

test('PasteRows counts pasted columns, maps each with a Select and leaves the preview to the page', async ({
  page,
}, testInfo) => {
  const project = testInfo.project.name;
  await page.goto('/#paste-rows');
  const card = page.getByTestId('paste-rows-card');
  const area = card.getByRole('textbox', { name: 'Paste here' });
  await expect(area).toHaveAccessibleDescription(
    'One bird per line. A second column sets the habitat.',
  );
  const count = card.getByRole('status').first();
  await expect(count).toHaveText('Found 3 columns');
  const selects = card.getByRole('combobox', { name: /^Column \d$/ });
  await expect(selects).toHaveCount(3);
  await expect(selects.nth(0)).toContainText('Bird');
  await expect(selects.nth(1)).toContainText('Habitat');
  await expect(selects.nth(2)).toContainText('Don’t use');

  expect(await axeViolations(page, '[data-testid="paste-rows-card"]')).toEqual(
    [],
  );

  const preview = card.getByRole('table', { name: 'Preview' });
  await expect(preview.locator('tbody tr')).toHaveCount(2);
  await expect(preview.locator('tbody tr').first()).toContainText('Pond');

  // Column 2 to Don’t use: the page's preview drops the habitat.
  await card.getByRole('combobox', { name: 'Column 2' }).click();
  await page.getByRole('option', { name: 'Don’t use' }).click();
  await expect(selects.nth(1)).toContainText('Don’t use');
  await expect(preview.locator('tbody tr').first()).toContainText('—');

  // A new paste with one column: one Select.
  await area.fill('Teal\nKingfisher\nMoorhen');
  await expect(count).toHaveText('Found 1 column');
  await expect(selects).toHaveCount(1);
  await expect(preview.locator('tbody tr')).toHaveCount(3);

  // Nothing pasted: no Selects and an empty status.
  await area.fill('');
  await expect(selects).toHaveCount(0);
  await expect(count).toHaveText('');

  // The column Selects stay inside the card at their size; nothing overflows.
  await area.fill('Teal\tPond\t3\tNorth marsh');
  await expect(selects).toHaveCount(4);
  const cardBox = (await card.boundingBox())!;
  for (const select of await selects.all()) {
    const box = (await select.boundingBox())!;
    expect(box.x + box.width).toBeLessThanOrEqual(cardBox.x + cardBox.width);
    // Select xs: 28 px on a fine pointer, the 44 px target on touch.
    if (project === 'mobile-es') expect(box.height).toBeGreaterThanOrEqual(44);
    else expect(Math.round(box.height)).toBe(28);
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
