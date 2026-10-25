import { expect, test } from '@playwright/test';

import { axeViolations } from './axe-scan.js';

test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.project.name === 'forced-colors')
    await page.emulateMedia({ forcedColors: 'active' });
});

test('FixtureRow select is a named checkbox before the row, outside its press area', async ({
  page,
}, testInfo) => {
  const project = testInfo.project.name;
  await page.goto('/#fixture-row');
  const section = page.locator('#fixture-row');
  const list = section.getByRole('list', {
    name: 'Tuesday 27 October · Reed bed',
  });
  const first = list.getByRole('checkbox', {
    name: 'Select Heron Marsh vs Otter Pool',
  });
  const second = list.getByRole('checkbox', {
    name: 'Select Elm Row vs Pine Ridge',
  });
  const locked = list.getByRole('checkbox', {
    name: 'Select Bayside Dunes vs Otter Pool',
  });
  await expect(first).toBeChecked();
  await expect(second).not.toBeChecked();
  await expect(locked).toBeDisabled();
  await list.screenshot({
    path: testInfo.outputPath('fixture-row-select-list.png'),
  });

  // The box sits before the row, not inside its button, on the row's line.
  const row = list.getByRole('button', {
    name: 'Heron Marsh vs Otter Pool, 8:00',
  });
  const target = first.locator('xpath=ancestor::label[1]');
  const targetBox = (await target.boundingBox())!;
  const rowBox = (await row.boundingBox())!;
  expect(targetBox.x + targetBox.width).toBeLessThanOrEqual(rowBox.x + 1);
  expect(targetBox.y).toBeGreaterThanOrEqual(rowBox.y - 1);
  expect(targetBox.y + targetBox.height).toBeLessThanOrEqual(
    rowBox.y + rowBox.height + 1,
  );
  expect(await row.locator('input').count()).toBe(0);
  // A 44 px target on a coarse pointer; the drawn box is 24 px either way.
  if (project === 'mobile-es') {
    expect(targetBox.width).toBeGreaterThanOrEqual(44);
    expect(targetBox.height).toBeGreaterThanOrEqual(44);
  }
  const mark = (await list
    .locator('.sw-fixture-select .sw-checkbox-mark')
    .first()
    .boundingBox())!;
  expect(Math.round(mark.width)).toBe(24);

  // The boxes share one column down the run.
  const others = await list.locator('.sw-fixture-select').all();
  const starts = await Promise.all(
    others.map(async (one) => Math.round((await one.boundingBox())!.x)),
  );
  expect(new Set(starts).size).toBe(1);

  // Tab goes from the box to its row; the box toggles without opening the row.
  await first.focus();
  await page.keyboard.press('Tab');
  await expect(row).toBeFocused();
  await second.click();
  await expect(second).toBeChecked();
  await expect(
    section.getByText(
      'Chosen: Heron Marsh vs Otter Pool, Elm Row vs Pine Ridge',
    ),
  ).toBeVisible();
  await expect(section.getByText('Last opened: None yet')).toBeVisible();
  await first.press('Space');
  await expect(first).not.toBeChecked();
  await expect(
    section.getByText('Chosen: Elm Row vs Pine Ridge'),
  ).toBeVisible();
  await row.click();
  await expect(
    section.getByText('Last opened: Heron Marsh with Otter Pool'),
  ).toBeVisible();
  await expect(first).not.toBeChecked();
  await locked.click({ force: true });
  await expect(locked).not.toBeChecked();

  // The select works beside a flag and an action, all on one line.
  const flaggedItem = list.getByRole('listitem').nth(1);
  const move = flaggedItem.getByRole('button', {
    name: 'Move Elm Row vs Pine Ridge',
  });
  const flagMark = (await flaggedItem
    .locator('.sw-fixture-flag-mark')
    .boundingBox())!;
  const secondBox = (await second
    .locator('xpath=ancestor::label[1]')
    .boundingBox())!;
  const moveBox = (await move.boundingBox())!;
  expect(secondBox.x + secondBox.width).toBeLessThanOrEqual(flagMark.x + 1);
  expect(flagMark.x + flagMark.width).toBeLessThanOrEqual(moveBox.x);
  // With no details' line, the flag stays inline at every width: beside
  // the home name, not under it.
  const name = (await flaggedItem
    .locator('.sw-fixture-team-home .sw-fixture-name')
    .boundingBox())!;
  expect(flagMark.y).toBeLessThan(name.y + name.height);
  expect(flagMark.y + flagMark.height).toBeGreaterThan(name.y);
  expect(flagMark.x + flagMark.width).toBeLessThanOrEqual(name.x);
  // Names wrap by word, not by letter.
  expect(name.height).toBeLessThanOrEqual(2 * 20 + 1);

  if (project === 'forced-colors')
    await expect(
      list.locator('.sw-fixture-select .sw-checkbox-mark').first(),
    ).toHaveCSS('border-top-style', 'solid');

  await page.mouse.move(0, 0);
  expect(await axeViolations(page, '#fixture-row .sw-fixture-group')).toEqual(
    [],
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await list.scrollIntoViewIfNeeded();
  await page.screenshot({
    path: testInfo.outputPath('fixture-row-select.png'),
  });
});
