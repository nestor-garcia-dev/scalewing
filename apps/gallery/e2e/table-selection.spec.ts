import { expect, test } from '@playwright/test';

import { axeViolations } from './axe-scan.js';

test('a table select column names each box, mixes Select all and keeps 44 px boxes on touch', async ({
  page,
}, testInfo) => {
  const project = testInfo.project.name;
  await page.goto('/#table-selection');
  const card = page.getByTestId('table-selection-card');
  const table = card.getByRole('table', { name: 'Wetland birds' });
  await expect(table).toBeVisible();

  const all = table.getByRole('checkbox', { name: 'Select all' });
  const heron = table.getByRole('checkbox', { name: 'Select Grey heron' });
  await expect(all).toBeChecked({ indeterminate: true });
  await expect(all).toHaveAttribute('aria-checked', 'mixed');
  await expect(heron).toBeChecked();
  await expect(card.getByRole('status')).toHaveText('1 selected');
  expect(
    await axeViolations(page, '[data-testid="table-selection-card"]'),
  ).toEqual([]);
  await expect(table.locator('tbody tr').nth(1)).toHaveClass(
    /sw-table-row-selected/,
  );

  // Each box is its own target: 24 px on a fine pointer, 44 × 44 on touch.
  for (const label of await table.locator('.sw-checkbox-label').all()) {
    const box = (await label.boundingBox())!;
    if (project === 'mobile-es') {
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);
    } else {
      expect(Math.round(box.width)).toBe(24);
      expect(Math.round(box.height)).toBe(24);
    }
  }
  if (project === 'forced-colors') {
    await expect(table.locator('th .sw-checkbox-mark')).toHaveCSS(
      'background-color',
      /.+/,
    );
  } else {
    // The mixed mark is the accent fill.
    const mark = table.locator('th .sw-checkbox-mark');
    const accent = await page.evaluate(() =>
      getComputedStyle(document.querySelector('[data-theme]')!)
        .getPropertyValue('--sw-color-accent')
        .trim(),
    );
    expect(accent).not.toBe('');
    await expect(mark).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  }

  // A press on the mixed box chooses every row; again chooses none.
  await all.click();
  await expect(all).toBeChecked();
  await expect(card.getByRole('status')).toHaveText('4 selected');
  await all.click();
  await expect(all).not.toBeChecked();
  await expect(all).toBeChecked({ checked: false, indeterminate: false });
  await expect(card.getByRole('status')).toHaveText('0 selected');

  // Space on a row box chooses it; Select all is mixed again.
  await table.getByRole('checkbox', { name: 'Select Teal' }).focus();
  await page.keyboard.press('Space');
  await expect(all).toBeChecked({ indeterminate: true });

  // The hidden-label checkbox outside the table keeps its name.
  await expect(card.getByRole('checkbox', { name: 'Ringed' })).toBeVisible();
  await expect(
    card.getByRole('checkbox', { name: 'Some nests checked' }),
  ).toBeChecked({ indeterminate: true });

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
