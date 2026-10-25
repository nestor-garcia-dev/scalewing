import { expect, test } from '@playwright/test';

import { axeViolations } from './axe-scan.js';

test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.project.name === 'forced-colors')
    await page.emulateMedia({ forcedColors: 'active' });
});

test('FixtureRow score takes a typed score in two named boxes; detail sits under the row', async ({
  page,
}, testInfo) => {
  const project = testInfo.project.name;
  await page.goto('/#fixture-row-score');
  const section = page.locator('#fixture-row-score');
  const list = section.getByRole('list', {
    name: 'Thursday 29 October · Tally sheet',
  });
  await list.scrollIntoViewIfNeeded();
  const group = list.getByRole('group', {
    name: 'Count, Heron Marsh v Otter Pool',
  });
  const home = group.getByRole('textbox', { name: 'Heron Marsh' });
  const away = group.getByRole('textbox', { name: 'Otter Pool' });
  await expect(home).toHaveAttribute('inputmode', 'numeric');
  await expect(away).toHaveAttribute('maxlength', '2');
  await list.screenshot({
    path: testInfo.outputPath('fixture-row-score-list.png'),
  });

  // 32 px squares on a fine pointer, 44 px on a coarse one.
  const size = project === 'mobile-es' ? 44 : 32;
  for (const box of [home, away]) {
    const bounds = (await box.boundingBox())!;
    expect(Math.round(bounds.width)).toBe(size);
    expect(Math.round(bounds.height)).toBe(size);
  }

  // Home name, home box, away box, away name, left to right on one line.
  const item = list.getByRole('listitem').first();
  const homeName = (await item
    .locator('.sw-fixture-team-home .sw-fixture-name')
    .boundingBox())!;
  const awayName = (await item
    .locator('.sw-fixture-team-away .sw-fixture-name')
    .boundingBox())!;
  const homeBox = (await home.boundingBox())!;
  const awayBox = (await away.boundingBox())!;
  expect(homeName.x + homeName.width).toBeLessThanOrEqual(homeBox.x);
  expect(homeBox.x + homeBox.width).toBeLessThan(awayBox.x);
  expect(awayBox.x + awayBox.width).toBeLessThanOrEqual(awayName.x);
  // Names wrap by word, not by letter, even on a phone with the action.
  expect(homeName.height).toBeLessThanOrEqual(2 * 20 + 1);
  expect(awayName.height).toBeLessThanOrEqual(2 * 20 + 1);
  expect(Math.abs(homeBox.y - awayBox.y)).toBeLessThan(1);

  // The score groups share one column down the run.
  const groups = await list.locator('.sw-fixture-score').all();
  const starts = await Promise.all(
    groups.map(async (one) => Math.round((await one.boundingBox())!.x)),
  );
  expect(new Set(starts).size).toBe(1);

  // Typed by keyboard: digits only, Tab to the away box, Enter records.
  await home.click();
  await page.keyboard.type('3x');
  await expect(home).toHaveValue('3');
  await page.keyboard.press('Tab');
  await expect(away).toBeFocused();
  await page.keyboard.type('1');
  await page.keyboard.press('Enter');
  await expect(
    section.getByText('Last recorded: Heron Marsh 3–1 Otter Pool'),
  ).toBeVisible();

  // Focus selects the digits, so a typed score replaces them.
  await home.click();
  await page.keyboard.type('7');
  await expect(home).toHaveValue('7');

  // An error is said under the row, marking only the empty box.
  await away.focus();
  await page.keyboard.press('Backspace');
  await expect(away).toHaveValue('');
  await page.keyboard.press('Enter');
  const error = item.getByText('Type both counts.');
  await expect(error).toBeVisible();
  await expect(away).toHaveAttribute('aria-invalid', 'true');
  await expect(home).not.toHaveAttribute('aria-invalid', 'true');
  await expect(away).toHaveAccessibleDescription('Type both counts.');
  const errorBox = (await error.boundingBox())!;
  const rowBox = (await item.locator('.sw-fixture-row').boundingBox())!;
  expect(errorBox.y).toBeGreaterThanOrEqual(rowBox.y + rowBox.height - 1);
  if (project !== 'forced-colors')
    expect(
      await away.evaluate((node) => getComputedStyle(node).borderTopColor),
    ).not.toBe(
      await home.evaluate((node) => getComputedStyle(node).borderTopColor),
    );
  await item.screenshot({
    path: testInfo.outputPath('fixture-row-score-error.png'),
  });
  // Escape puts the boxes back and clears the message.
  await page.keyboard.press('Escape');
  await expect(away).toHaveValue('');
  await expect(home).toHaveValue('');
  await expect(error).toHaveCount(0);

  // A counted row: changing it shows the reason field under the row,
  // from the home side's start; Escape takes it away again.
  const counted = list.getByRole('listitem').nth(1);
  const countedHome = counted.getByRole('textbox', { name: 'Pine Ridge' });
  await expect(countedHome).toHaveValue('4');
  await expect(counted.getByText('Counted')).toBeVisible();
  await countedHome.focus();
  await page.keyboard.type('5');
  const reason = counted.getByRole('textbox', { name: 'Reason' });
  await expect(reason).toBeVisible();
  await expect(counted.getByText('Changing the counted 4–2')).toBeVisible();
  const countedRow = (await counted.locator('.sw-fixture-row').boundingBox())!;
  const reasonBox = (await reason.boundingBox())!;
  expect(reasonBox.y).toBeGreaterThanOrEqual(
    countedRow.y + countedRow.height - 1,
  );
  expect(Math.abs(reasonBox.x - (countedRow.x + 8))).toBeLessThanOrEqual(1);
  expect(
    await counted
      .locator('.sw-fixture-row')
      .evaluate(
        (row, field) => row.contains(field),
        await reason.elementHandle(),
      ),
  ).toBe(false);
  await counted.screenshot({
    path: testInfo.outputPath('fixture-row-score-detail.png'),
  });
  await reason.fill('Recount at dusk');
  await reason.press('Enter');
  await expect(
    section.getByText('Last recorded: Pine Ridge 5–2 Bittern Fen'),
  ).toBeVisible();
  await countedHome.focus();
  await page.keyboard.press('Escape');
  await expect(countedHome).toHaveValue('4');
  await expect(reason).toHaveCount(0);

  // With a select, a flag and an action, all on the row's first line.
  const flagged = section
    .getByRole('list', { name: 'Friday 30 October · Tally sheet' })
    .getByRole('listitem')
    .first();
  const select = flagged.getByRole('checkbox', {
    name: 'Select Elm Row vs Reed Bed',
  });
  const flaggedHome = flagged.getByRole('textbox', { name: 'Elm Row' });
  const record = flagged.getByRole('button', {
    name: 'Record Elm Row vs Reed Bed',
  });
  const selectBox = (await select
    .locator('xpath=ancestor::label[1]')
    .boundingBox())!;
  const flaggedBox = (await flaggedHome.boundingBox())!;
  const recordBox = (await record.boundingBox())!;
  expect(selectBox.x + selectBox.width).toBeLessThanOrEqual(flaggedBox.x);
  expect(flaggedBox.x + flaggedBox.width).toBeLessThanOrEqual(recordBox.x);
  await select.focus();
  await page.keyboard.press('Tab');
  await expect(flaggedHome).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(
    flagged.getByRole('textbox', { name: 'Reed Bed' }),
  ).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(record).toBeFocused();

  // A locked row keeps its boxes shown and disabled.
  const locked = list.getByRole('listitem').nth(2);
  await expect(
    locked.getByRole('textbox', { name: 'Bayside Dunes' }),
  ).toBeDisabled();

  if (project === 'forced-colors') {
    await expect(home).toHaveCSS('border-top-style', 'solid');
    await home.focus();
    await page.keyboard.type('2');
    await page.keyboard.press('Enter');
    await expect(away).toHaveAttribute('aria-invalid', 'true');
    const [invalidEdge, plainEdge] = await Promise.all([
      away.evaluate((node) => getComputedStyle(node).borderTopColor),
      home.evaluate((node) => getComputedStyle(node).borderTopColor),
    ]);
    expect(invalidEdge).not.toBe(plainEdge);
    await page.keyboard.press('Escape');
  }

  await page.mouse.move(0, 0);
  expect(
    await axeViolations(page, '#fixture-row-score .sw-fixture-group'),
  ).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: testInfo.outputPath('fixture-row-score.png'),
  });
});
