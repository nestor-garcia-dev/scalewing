import { expect, test } from '@playwright/test';

const fitsWidth = (page: import('@playwright/test').Page) =>
  page.evaluate(
    () => document.documentElement.scrollWidth <= window.innerWidth,
  );

test('a tile Checkbox is one press target, edged while chosen', async ({
  page,
}, testInfo) => {
  await page.goto('/#checkbox');
  const tiles = page.getByTestId('checkbox-tiles');
  const meadow = tiles.getByRole('checkbox', { name: 'Meadow' });
  const tile = meadow.locator(
    'xpath=ancestor::div[contains(@class,"sw-checkbox-tile")][1]',
  );
  const edgeOf = () =>
    tile.evaluate((node) => getComputedStyle(node).borderTopColor);
  const before = await edgeOf();
  // A press on the tile's far end, away from the words, chooses it.
  await tile.scrollIntoViewIfNeeded();
  const box = (await tile.boundingBox())!;
  await page.mouse.click(box.x + box.width - 8, box.y + box.height / 2);
  await expect(meadow).toBeChecked();
  await expect(tile).toHaveClass(/sw-checkbox-tile-checked/);
  expect(await edgeOf()).not.toBe(before);
  // A press on the description chooses too.
  const hides = tiles.getByRole('checkbox', { name: 'Bird hides' });
  const words = tiles.getByText('Count the birds from each hide at dawn.');
  await words.scrollIntoViewIfNeeded();
  const wordsBox = (await words.boundingBox())!;
  await page.mouse.click(wordsBox.x + 4, wordsBox.y + wordsBox.height / 2);
  await expect(hides).not.toBeChecked();
  expect(box.height).toBeGreaterThanOrEqual(44);
  expect(await fitsWidth(page)).toBe(true);
  await tiles.screenshot({ path: testInfo.outputPath('checkbox-tiles.png') });
});

test('a stacked RadioGroup puts each description under its label', async ({
  page,
}, testInfo) => {
  await page.goto('/#radio-group');
  const group = page.getByRole('group', { name: 'Volunteer role' });
  const label = group.getByText('Group leader', { exact: true });
  const description = group.getByText(/Everything a counter does/);
  const [labelBox, descriptionBox] = await Promise.all([
    label.boundingBox(),
    description.boundingBox(),
  ]);
  expect(descriptionBox!.y).toBeGreaterThanOrEqual(
    labelBox!.y + labelBox!.height - 1,
  );
  expect(Math.abs(descriptionBox!.x - labelBox!.x)).toBeLessThanOrEqual(1);
  await description.click();
  await expect(
    group.getByRole('radio', { name: 'Group leader' }),
  ).toBeChecked();
  expect(await fitsWidth(page)).toBe(true);
  await group.screenshot({ path: testInfo.outputPath('radio-stacked.png') });
});

test('a read-only Field reads apart from an editable one and stays focusable', async ({
  page,
}, testInfo) => {
  await page.goto('/#field');
  const email = page.getByRole('textbox', { name: 'Volunteer email' });
  await expect(email).toHaveAttribute('readonly', '');
  await email.focus();
  await expect(email).toBeFocused();
  const editable = page.getByRole('textbox').first();
  const look = (node: HTMLElement) => {
    const style = getComputedStyle(node);
    return `${style.backgroundColor} ${style.borderTopColor} ${style.borderTopStyle}`;
  };
  // Forced colours replace the fill and the edge; the unit test holds that rule.
  if (testInfo.project.name !== 'forced-colors')
    expect(await email.evaluate(look)).not.toBe(await editable.evaluate(look));
  await email.screenshot({ path: testInfo.outputPath('field-read-only.png') });
});

test('a numbered TaskList numbers its open tasks and, on a phone, puts each action under the words', async ({
  page,
}, testInfo) => {
  await page.goto('/#task-list');
  const card = page.getByTestId('task-list-numbered');
  const list = card.getByRole('list', { name: 'Set up the hide' });
  await expect(list.locator('.sw-task-list-marker')).toHaveText([
    '',
    '2',
    '3',
    '4',
  ]);
  const row = list.getByRole('listitem').nth(1);
  const [title, action, rowBox] = await Promise.all([
    row.locator('.sw-task-list-title').boundingBox(),
    row.getByRole('button', { name: 'Open' }).boundingBox(),
    row.boundingBox(),
  ]);
  if (testInfo.project.name === 'mobile-es') {
    // Under the words, from where they start to the row's end.
    expect(action!.y).toBeGreaterThan(title!.y + title!.height - 1);
    expect(Math.abs(action!.x - title!.x)).toBeLessThanOrEqual(1);
    expect(
      Math.abs(action!.x + action!.width - (rowBox!.x + rowBox!.width)),
    ).toBeLessThanOrEqual(1);
    expect(action!.height).toBeGreaterThanOrEqual(44);
  } else {
    // At the row's end, on the words' line.
    expect(action!.x).toBeGreaterThan(title!.x + title!.width);
  }
  expect(await fitsWidth(page)).toBe(true);
  await card.screenshot({
    path: testInfo.outputPath('task-list-numbered.png'),
  });
});
