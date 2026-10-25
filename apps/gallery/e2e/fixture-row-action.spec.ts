import { expect, test } from '@playwright/test';

import { axeViolations } from './axe-scan.js';

test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.project.name === 'forced-colors')
    await page.emulateMedia({ forcedColors: 'active' });
});

test('FixtureRow reads its flag first and keeps its action outside the row', async ({
  page,
}, testInfo) => {
  const project = testInfo.project.name;
  await page.goto('/#fixture-row');
  const section = page.locator('#fixture-row');
  const list = section.getByRole('list', {
    name: 'Monday 26 October · Reed bed',
  });
  const flagged = list.getByRole('listitem').nth(0);

  // The flag's words come first in the row; its mark is a 16 px round
  // tooltip-bearing shape at the row's start, the home name still at the centre.
  await expect(flagged).toHaveText(/^Tide clash Heron Marsh 8:00 Pine Ridge/);
  const mark = flagged.locator('.sw-fixture-flag-mark');
  await expect(mark).toHaveAttribute('title', 'Tide clash');
  await expect(mark).toHaveAttribute('aria-hidden', 'true');
  const markBox = (await mark.boundingBox())!;
  expect(Math.round(markBox.width)).toBe(16);
  expect(Math.round(markBox.height)).toBe(16);
  await expect(mark).toHaveCSS('border-top-style', 'solid');
  const name = (await flagged
    .locator('.sw-fixture-team-home .sw-fixture-name')
    .boundingBox())!;
  const centre = (await flagged.locator('.sw-fixture-center').boundingBox())!;
  if (project === 'mobile-es') {
    // On a phone the flag leads the details' line, under the home name.
    const end = (await flagged.locator('.sw-fixture-meta').boundingBox())!;
    expect(markBox.y).toBeGreaterThanOrEqual(name.y + name.height - 1);
    expect(markBox.x + markBox.width).toBeLessThanOrEqual(end.x + 1);
  } else expect(markBox.x + markBox.width).toBeLessThan(name.x);
  expect(name.x + name.width).toBeLessThanOrEqual(centre.x);

  // A danger flag is drawn in the danger tone.
  await expect(
    list.getByRole('listitem').nth(2).locator('.sw-fixture-flag'),
  ).toHaveClass(/sw-fixture-flag-danger/);

  // The pressable row keeps its own name; Move is a separate button after it.
  const row = list.getByRole('button', {
    name: 'Otter Pool vs Bittern Fen, 9:15, Hide 2',
  });
  const move = list.getByRole('button', {
    name: 'Move Otter Pool vs Bittern Fen',
  });
  const rowBox = (await row.boundingBox())!;
  const moveBox = (await move.boundingBox())!;
  expect(moveBox.x).toBeGreaterThanOrEqual(rowBox.x + rowBox.width - 1);
  expect(moveBox.y).toBeGreaterThanOrEqual(rowBox.y - 1);
  expect(moveBox.y + moveBox.height).toBeLessThanOrEqual(
    rowBox.y + rowBox.height + 1,
  );
  if (project === 'mobile-es')
    expect(moveBox.height).toBeGreaterThanOrEqual(44);

  // Both actions share one column down the run.
  const other = (await list
    .getByRole('button', { name: 'Move Heron Marsh vs Pine Ridge' })
    .boundingBox())!;
  expect(
    Math.abs(other.x + other.width - (moveBox.x + moveBox.width)),
  ).toBeLessThanOrEqual(1);

  await move.click();
  await expect(
    section.getByText('Last moved: Otter Pool vs Bittern Fen'),
  ).toBeVisible();
  await expect(section.getByText('Last opened: None yet')).toBeVisible();
  await row.click();
  await expect(
    section.getByText('Last opened: Otter Pool with Bittern Fen'),
  ).toBeVisible();

  // Scan at rest, with no row under the pointer.
  await page.mouse.move(0, 0);
  expect(await axeViolations(page, '#fixture-row .sw-fixture-group')).toEqual(
    [],
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: testInfo.outputPath('fixture-row-action.png'),
  });
});
