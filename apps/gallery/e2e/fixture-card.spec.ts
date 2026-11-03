import { expect, test } from '@playwright/test';

import { axeViolations } from './axe-scan.js';
import { colorContrast } from './contrast.js';

const groupName = 'Count, Heron Marsh v Otter Pool';

test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.project.name === 'forced-colors')
    await page.emulateMedia({ forcedColors: 'active' });
});

test('FixtureCard stacks the sides with their boxes in one column and takes a typed score', async ({
  page,
}, testInfo) => {
  const project = testInfo.project.name;
  await page.goto('/#fixture-card');
  const section = page.locator('#fixture-card');
  const group = section.getByRole('group', { name: groupName, exact: true });
  await group.scrollIntoViewIfNeeded();
  const home = group.getByRole('textbox', { name: 'Heron Marsh count' });
  const away = group.getByRole('textbox', { name: 'Otter Pool count' });
  await expect(home).toHaveAttribute('inputmode', 'numeric');
  await expect(away).toHaveAttribute('maxlength', '2');

  // 32 px squares on a fine pointer, 44 px on a coarse one.
  const size = project === 'mobile-es' ? 44 : 32;
  for (const box of [home, away]) {
    const bounds = (await box.boundingBox())!;
    expect(Math.round(bounds.width)).toBe(size);
    expect(Math.round(bounds.height)).toBe(size);
  }

  // Boxes in one column at the end, home above away, centred on their rows.
  const homeBox = (await home.boundingBox())!;
  const awayBox = (await away.boundingBox())!;
  const card = (await group.boundingBox())!;
  expect(Math.abs(homeBox.x - awayBox.x)).toBeLessThan(1);
  expect(homeBox.y + homeBox.height).toBeLessThanOrEqual(awayBox.y);
  expect(
    Math.abs(homeBox.x + homeBox.width - (card.x + card.width)),
  ).toBeLessThan(1);
  const rows = group.locator('.sw-fixture-card-side');
  const homeRow = (await rows.first().boundingBox())!;
  expect(
    Math.abs(homeBox.y + homeBox.height / 2 - (homeRow.y + homeRow.height / 2)),
  ).toBeLessThan(1);

  // The name and its note come before the box, the note under the name.
  const name = (await group
    .locator('.sw-fixture-card-name')
    .first()
    .boundingBox())!;
  const note = (await group
    .locator('.sw-fixture-card-note')
    .first()
    .boundingBox())!;
  expect(name.x + name.width).toBeLessThanOrEqual(homeBox.x);
  expect(note.y).toBeGreaterThanOrEqual(name.y + name.height - 1);
  await expect(group.locator('.sw-fixture-card-name').first()).toHaveCSS(
    'font-weight',
    '500',
  );

  // A top line: meta at the start, the menu at the end, above the sides.
  const meta = (await group.locator('.sw-fixture-card-meta').boundingBox())!;
  const menu = (await group
    .getByRole('button', { name: `More for Heron Marsh v Otter Pool` })
    .boundingBox())!;
  expect(meta.x).toBeLessThan(menu.x);
  expect(meta.y + meta.height).toBeLessThanOrEqual(homeRow.y + 1);
  expect(Math.abs(menu.x + menu.width - (card.x + card.width))).toBeLessThan(1);

  // Long names wrap in full; nothing is cut and the column keeps its place.
  const long = section.getByRole('group', {
    name: 'Count, The Great Northern Bittern Fen and Reed Bed Reserve v Elm Row',
    exact: true,
  });
  const longName = long.locator('.sw-fixture-card-name').first();
  await expect(longName).toContainText('Reed Bed Reserve');
  expect(
    await longName.evaluate((node) => node.scrollWidth <= node.clientWidth),
  ).toBe(true);
  expect(await longName.evaluate((node) => node.clientHeight)).toBeGreaterThan(
    30,
  );
  const longBoxes = long.locator('.sw-fixture-score-box');
  const longHome = (await longBoxes.first().boundingBox())!;
  const longAway = (await longBoxes.last().boundingBox())!;
  expect(Math.abs(longHome.x - homeBox.x)).toBeLessThan(1);
  expect(Math.abs(longAway.x - homeBox.x)).toBeLessThan(1);

  // Typed by keyboard: digits only, Tab moves to the away box.
  await home.click();
  await page.keyboard.type('3x');
  await expect(home).toHaveValue('3');
  await page.keyboard.press('Tab');
  await expect(away).toBeFocused();

  // Enter with one box empty: the error, under the sides, marks the empty box.
  const error = group.locator('.sw-fixture-card-error');
  await expect(error).toHaveAttribute('aria-live', 'polite');
  await expect(error).toHaveText('');
  expect((await error.boundingBox())?.height ?? 0).toBe(0);
  await page.keyboard.press('Enter');
  await expect(error).toHaveText('Type both counts.');
  await expect(away).toHaveAttribute('aria-invalid', 'true');
  await expect(home).not.toHaveAttribute('aria-invalid', 'true');
  await expect(away).toHaveAccessibleDescription('Type both counts.');
  const errorBox = (await error.boundingBox())!;
  const awayNow = (await away.boundingBox())!;
  expect(errorBox.y).toBeGreaterThanOrEqual(awayNow.y + awayNow.height);
  const actions = (await group
    .locator('.sw-fixture-card-actions')
    .boundingBox())!;
  expect(actions.y).toBeGreaterThanOrEqual(errorBox.y + errorBox.height);
  await group.screenshot({
    path: testInfo.outputPath('fixture-card-error.png'),
  });
  if (project === 'forced-colors') {
    await expect(home).toHaveCSS('border-top-style', 'solid');
    const [invalidEdge, plainEdge] = await Promise.all([
      away.evaluate((node) => getComputedStyle(node).borderTopColor),
      home.evaluate((node) => getComputedStyle(node).borderTopColor),
    ]);
    expect(invalidEdge).not.toBe(plainEdge);
  }

  // Escape puts the boxes back and clears the message.
  await page.keyboard.press('Escape');
  await expect(home).toHaveValue('');
  await expect(error).toHaveText('');

  // Enter records, and the detail sits under the actions.
  await home.click();
  await page.keyboard.type('3');
  await away.click();
  await page.keyboard.type('1');
  await page.keyboard.press('Enter');
  const detail = group.locator('.sw-fixture-card-detail');
  await expect(detail).toHaveText('Recorded 3–1.');
  const actionsNow = (await group
    .locator('.sw-fixture-card-actions')
    .boundingBox())!;
  expect((await detail.boundingBox())!.y).toBeGreaterThanOrEqual(
    actionsNow.y + actionsNow.height,
  );

  // Select on focus: a typed digit replaces the box's.
  await home.click();
  await page.keyboard.type('7');
  await expect(home).toHaveValue('7');

  // Slots left out draw nothing, and a locked card keeps its boxes shown.
  const bare = section.getByRole('group', {
    name: 'Count, Elm Row v Reed Bed',
  });
  await expect(bare.locator('.sw-fixture-card-top')).toHaveCount(0);
  await expect(bare.locator('.sw-fixture-card-actions')).toHaveCount(0);
  await expect(bare.locator('.sw-fixture-card-detail')).toHaveCount(0);
  await expect(
    section
      .getByRole('group', { name: 'Count, Bayside Dunes v Otter Pool' })
      .getByRole('textbox', { name: 'Bayside Dunes count' }),
  ).toBeDisabled();

  // It draws no fill, edge or radius of its own.
  const own = await group.evaluate((node) => {
    const style = getComputedStyle(node);
    return [
      style.backgroundColor,
      style.borderTopStyle,
      style.borderTopLeftRadius,
    ];
  });
  // Transparent, whichever colour forced colours keep under the zero alpha.
  expect(own[0]).toMatch(/, 0\)$/);
  expect(own.slice(1)).toEqual(['none', '0px']);

  await page.mouse.move(0, 0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await section.screenshot({ path: testInfo.outputPath('fixture-card.png') });
});

test('FixtureCard reads in light and dark', async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name === 'forced-colors',
    'forced colours draw system colours',
  );
  await page.goto('/#fixture-card');
  const section = page.locator('#fixture-card');
  const group = section.getByRole('group', { name: groupName, exact: true });
  await group.scrollIntoViewIfNeeded();
  const card = section.locator('.sw-card').first();
  const words = [
    group.locator('.sw-fixture-card-name').first(),
    group.locator('.sw-fixture-card-note').first(),
    group.locator('.sw-fixture-card-meta'),
  ];
  const home = group.getByRole('textbox', { name: 'Heron Marsh count' });
  const away = group.getByRole('textbox', { name: 'Otter Pool count' });
  const color = (node: Element) => getComputedStyle(node).color;
  const inks: string[] = [];
  for (const scheme of ['Light', 'Dark']) {
    await page.getByRole('radio', { name: scheme }).first().check();
    await expect(
      page.locator(`[data-theme='${scheme.toLowerCase()}']`).first(),
    ).toBeVisible();
    // Make the error show, so its ink is measured and drawn too.
    await home.focus();
    await page.keyboard.press('Enter');
    const error = group.locator('.sw-fixture-card-error');
    await expect(error).toHaveText('Type both counts.');
    const fill = await card.evaluate((node) => {
      const painted = getComputedStyle(node).backgroundColor;
      return painted === 'rgba(0, 0, 0, 0)'
        ? getComputedStyle(document.body).backgroundColor
        : painted;
    });
    for (const part of [...words, error])
      expect(colorContrast(await part.evaluate(color), fill)).toBeGreaterThan(
        4.5,
      );
    inks.push(await words[0]!.evaluate(color));
    await page.mouse.move(0, 0);
    expect(await axeViolations(page, '#fixture-card .sw-card')).toEqual([]);
    await section.screenshot({
      path: testInfo.outputPath(`fixture-card-${scheme}.png`),
    });
    await page.keyboard.press('Escape');
    await expect(away).toHaveValue('');
  }
  expect(inks[0]).not.toBe(inks[1]);
});

test('FixtureCard follows density compact on a fine pointer only', async ({
  page,
}, testInfo) => {
  await page.goto('/#fixture-card');
  const sample = page.getByTestId('fixture-card-compact');
  await sample.scrollIntoViewIfNeeded();
  const group = sample.getByRole('group', {
    name: `${groupName} (compact)`,
  });
  const box = group.getByRole('textbox', {
    name: 'Heron Marsh count (compact)',
  });
  const bounds = (await box.boundingBox())!;
  const coarse = testInfo.project.name === 'mobile-es';
  expect(Math.round(bounds.height)).toBe(coarse ? 44 : 28);
  expect(Math.round(bounds.width)).toBe(coarse ? 44 : 28);
  await expect(group.locator('.sw-fixture-card-name').first()).toHaveCSS(
    'font-size',
    coarse ? '17px' : '15px',
  );
  await sample.screenshot({
    path: testInfo.outputPath('fixture-card-compact.png'),
  });
});
