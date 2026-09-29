import { expect, test, type Locator } from '@playwright/test';

test('Select in a glass card opens over the card below it', async ({
  page,
}, testInfo) => {
  await page.goto('/#select');
  const section = page.locator('#select');
  const trigger = section.getByRole('combobox', { name: 'Den range' });
  await trigger.click();
  const last = section.getByRole('option', { name: 'Ocean' });
  await expect(last).toBeVisible();
  await section.screenshot({ path: testInfo.outputPath('select-in-card.png') });
  // A plain click lands on whatever paints on top; an option under the next
  // card would send it to that card's field instead.
  await last.click();
  await expect(trigger).toHaveText('Ocean');
  await expect(section.getByRole('listbox')).toHaveCount(0);
});

test('Select keeps its width when the value changes and centres its text', async ({
  page,
}, testInfo) => {
  await page.goto('/#select');
  if (testInfo.project.name === 'forced-colors') {
    await page.emulateMedia({ forcedColors: 'active' });
  }
  const section = page.locator('#select');
  const trigger = section.getByRole('combobox', { name: 'Survey reason' });
  await expect(trigger).toHaveText('Nest check');
  const before = await trigger.boundingBox();

  // Teisoro DRW-12: the text sat near the top of a 44 px box.
  const text = trigger.locator('.sw-select-value-text');
  const textBox = await text.boundingBox();
  const middle = (box: { y: number; height: number } | null) =>
    (box?.y ?? 0) + (box?.height ?? 0) / 2;
  expect(Math.abs(middle(textBox) - middle(before))).toBeLessThanOrEqual(1);

  // The caret is the stroked Accordion chevron, not a gradient triangle.
  const chevron = await trigger.evaluate((node) => {
    const style = getComputedStyle(node, '::after');
    return {
      image: getComputedStyle(node).backgroundImage,
      right: style.borderRightWidth,
      bottom: style.borderBottomWidth,
    };
  });
  expect(chevron.image).toBe('none');
  expect(chevron.right).toBe('2px');
  expect(chevron.bottom).toBe('2px');

  // Teisoro DRW-12: the box grew from about 183 to 343 px once chosen.
  await trigger.click();
  await section
    .getByRole('option', { name: 'Migration count across the wetland reserve' })
    .click();
  await expect(trigger).toHaveText(
    'Migration count across the wetland reserve',
  );
  const after = await trigger.boundingBox();
  expect(Math.abs((after?.width ?? 0) - (before?.width ?? 0))).toBeLessThan(1);
  // Only the chosen label is the trigger's text and value.
  await expect(trigger).toHaveAccessibleName('Survey reason');
  const sectionBox = await section.boundingBox();
  expect((after?.x ?? 0) + (after?.width ?? 0)).toBeLessThanOrEqual(
    (sectionBox?.x ?? 0) + (sectionBox?.width ?? 0) + 1,
  );
  await trigger.screenshot({ path: testInfo.outputPath('select-trigger.png') });
});

test('Select shows a placeholder, a required mark, and an error described on its trigger', async ({
  page,
}, testInfo) => {
  await page.goto('/#select');
  if (testInfo.project.name === 'forced-colors') {
    await page.emulateMedia({ forcedColors: 'active' });
  }
  const section = page.locator('#select');
  const trigger = section.getByRole('combobox', { name: 'Visit reason' });
  // Teisoro DRW-12: "Choose a reason" was the first option.
  await expect(trigger).toHaveText('Choose a reason');
  await expect(trigger).toHaveAttribute('aria-required', 'true');
  const label = section.locator('label', { hasText: 'Visit reason' });
  await expect(label.locator('.sw-field-required')).toHaveText('*');
  const before = await trigger.boundingBox();
  // The polite error region exists, empty, before the error.
  const region = trigger
    .locator(
      "xpath=ancestor::div[contains(concat(' ', @class, ' '), ' sw-select ')][1]",
    )
    .locator('.sw-field-error');
  await expect(region).toHaveAttribute('aria-live', 'polite');
  await expect(region).toHaveText('');

  await section.getByRole('button', { name: 'Log visit' }).click();
  await expect(region).toHaveText('Choose a reason for the visit.');
  await expect(trigger).toHaveAttribute('aria-invalid', 'true');
  await expect(trigger).toHaveAccessibleDescription(
    'Choose a reason for the visit.',
  );
  await expect(section.getByRole('alert')).toHaveCount(0);
  if (testInfo.project.name !== 'forced-colors') {
    const border = await trigger.evaluate(
      (node) => getComputedStyle(node).borderTopColor,
    );
    const danger = await section
      .getByText('Choose a reason for the visit.')
      .evaluate((node) => getComputedStyle(node).color);
    expect(border).toBe(danger);
  }
  await section.screenshot({ path: testInfo.outputPath('select-error.png') });

  await trigger.click();
  await expect(section.getByRole('option')).toHaveText([
    'Nest check',
    'Migration count across the wetland reserve',
    'Tagging',
  ]);
  await section.getByRole('option', { name: 'Tagging' }).click();
  await expect(trigger).toHaveText('Tagging');
  await expect(trigger).not.toHaveAttribute('aria-invalid', 'true');
  const after = await trigger.boundingBox();
  expect(Math.abs((after?.width ?? 0) - (before?.width ?? 0))).toBeLessThan(1);
});

test('a Select beside a Field lines up its label and control', async ({
  page,
}, testInfo) => {
  await page.goto('/#select');
  const section = page.locator('#select');
  const trigger = section.getByRole('combobox', { name: 'Survey plot' });
  const size = section.getByRole('textbox', { name: 'Plot size ha' });
  const frame = size.locator('xpath=..');
  const top = async (locator: typeof trigger) =>
    (await locator.boundingBox())?.y ?? Number.NaN;
  const label = (name: string) =>
    section.locator('label').filter({ hasText: name });
  const textTop = (name: string) =>
    label(name).evaluate((element) => {
      const range = document.createRange();
      range.selectNodeContents(element);
      return range.getBoundingClientRect().y;
    });
  // The Select's label row was 20 px against Field's 25 px, so its trigger
  // sat 5 px higher, as DateField's entry did (Teisoro NSF-35).
  expect(Math.abs((await top(trigger)) - (await top(frame)))).toBeLessThan(0.5);
  expect(
    Math.abs((await textTop('Survey plot')) - (await textTop('Plot size'))),
  ).toBeLessThan(0.5);
  const height = (name: string) =>
    label(name).evaluate((element) => element.getBoundingClientRect().height);
  expect(await height('Survey plot')).toBe(await height('Plot size'));
  // A visually hidden label still takes no row.
  const compact = section.getByRole('combobox', { name: 'Compact range' });
  await expect(compact).toBeVisible();
  expect(await height('Compact range')).toBeLessThanOrEqual(1);
  await trigger.scrollIntoViewIfNeeded();
  await section.screenshot({
    path: testInfo.outputPath('select-beside-field.png'),
  });
});

/**
 * A full-width Select's trigger, its grid track, and where its chevron ends:
 * the value takes the free space, so the chevron (the trigger's `::after`,
 * which has no box of its own) ends one gap and its own width past the value.
 */
async function fullWidthGeometry(trigger: Locator) {
  return trigger.evaluate((node) => {
    const grid = node.closest('.sw-grid');
    if (!(grid instanceof HTMLElement)) throw new Error('not in a Grid');
    const cell = [...grid.children].find((child) => child.contains(node));
    // Each cell is one column here; below md the grid is one column.
    const tracks = getComputedStyle(grid)
      .gridTemplateColumns.split(' ')
      .map(Number.parseFloat);
    const track =
      tracks[[...grid.children].indexOf(cell!) % tracks.length] ?? Number.NaN;
    const style = getComputedStyle(node);
    const box = node.getBoundingClientRect();
    const value = node.querySelector('.sw-select-value')!;
    const valueBox = value.getBoundingClientRect();
    const chevron = Number.parseFloat(getComputedStyle(node, '::after').width);
    const gap = Number.parseFloat(style.columnGap);
    const rtl = style.direction === 'rtl';
    const contentEnd = rtl
      ? box.left +
        Number.parseFloat(style.borderLeftWidth) +
        Number.parseFloat(style.paddingLeft)
      : box.right -
        Number.parseFloat(style.borderRightWidth) -
        Number.parseFloat(style.paddingRight);
    const chevronEnd = rtl
      ? valueBox.left - gap - chevron
      : valueBox.right + gap + chevron;
    const text = node.querySelector('.sw-select-value-text')!;
    return {
      box: { left: box.left, right: box.right, width: box.width },
      chevronEnd,
      contentEnd,
      rtl,
      textClientWidth: text.clientWidth,
      textOverflow: getComputedStyle(text).textOverflow,
      textScrollWidth: text.scrollWidth,
      textRight: text.getBoundingClientRect().right,
      textLeft: text.getBoundingClientRect().left,
      track,
    };
  });
}

test('Select width full fills its column, its list and its chevron follow', async ({
  page,
}, testInfo) => {
  await page.goto('/#select');
  if (testInfo.project.name === 'forced-colors') {
    await page.emulateMedia({ forcedColors: 'active' });
  }
  const section = page.locator('#select');
  const viewport = page.viewportSize()!;
  // A Stack in a Grid cell, a bare Grid cell, and a right-to-left cell.
  const cases = [
    { name: 'Show', shot: 'stack' },
    { name: 'Cell habitat', shot: 'cell' },
    { name: 'الموطن', shot: 'rtl' },
  ];
  for (const { name, shot } of cases) {
    const trigger = section.getByRole('combobox', { name });
    await trigger.scrollIntoViewIfNeeded();
    const geometry = await fullWidthGeometry(trigger);
    // Teisoro F-007-S05: about 225 px beside full-width cards on a phone.
    expect(Math.abs(geometry.box.width - geometry.track)).toBeLessThan(0.5);
    if (testInfo.project.name === 'mobile-es') {
      const grid = await trigger
        .locator('xpath=ancestor::div[contains(@class, "sw-grid")][1]')
        .boundingBox();
      expect(Math.abs(geometry.box.width - (grid?.width ?? 0))).toBeLessThan(
        0.5,
      );
    }
    expect(geometry.rtl).toBe(name === 'الموطن');
    expect(Math.abs(geometry.chevronEnd - geometry.contentEnd)).toBeLessThan(1);

    await trigger.click();
    const list = section.getByRole('listbox', { name });
    const listBox = (await list.boundingBox())!;
    // Exactly the trigger's width: never narrower, and never wider.
    expect(listBox.width).toBeGreaterThanOrEqual(geometry.box.width - 0.5);
    expect(listBox.width).toBeLessThanOrEqual(geometry.box.width + 0.5);
    // It opens from the trigger's inline start and stays on screen.
    if (geometry.rtl) {
      expect(
        Math.abs(listBox.x + listBox.width - geometry.box.right),
      ).toBeLessThan(0.5);
    } else {
      expect(Math.abs(listBox.x - geometry.box.left)).toBeLessThan(0.5);
    }
    expect(listBox.x).toBeGreaterThanOrEqual(0);
    expect(listBox.x + listBox.width).toBeLessThanOrEqual(viewport.width);
    await page.screenshot({
      path: testInfo.outputPath(`select-full-${shot}.png`),
    });
    await page.keyboard.press('Escape');
    await expect(list).toHaveCount(0);
  }

  // The longest filter keeps the width and ellipsizes inside the trigger.
  const longest =
    'Migration counts across the wetland reserve and the tidal flats';
  const show = section.getByRole('combobox', { name: 'Show' });
  const before = await fullWidthGeometry(show);
  await show.click();
  await section.getByRole('option', { name: longest }).click();
  await expect(show).toHaveText(longest);
  const after = await fullWidthGeometry(show);
  expect(Math.abs(after.box.width - before.box.width)).toBeLessThan(0.5);
  expect(after.textOverflow).toBe('ellipsis');
  // The label is cut, not merely allowed to be: it overflows its box.
  expect(after.textScrollWidth).toBeGreaterThan(after.textClientWidth);
  expect(after.textRight).toBeLessThanOrEqual(after.contentEnd + 0.5);
  expect(Math.abs(after.chevronEnd - after.contentEnd)).toBeLessThan(1);

  // Opened again, the chosen long option wraps inside the trigger's width.
  await show.click();
  const list = section.getByRole('listbox', { name: 'Show' });
  const listBox = (await list.boundingBox())!;
  expect(listBox.width).toBeLessThanOrEqual(after.box.width + 0.5);
  const oneLine = (await section
    .getByRole('option', { name: 'Nests' })
    .boundingBox())!.height;
  const wrapped = (await section
    .getByRole('option', { name: longest })
    .boundingBox())!.height;
  expect(wrapped).toBeGreaterThan(oneLine + 1);
  await page.screenshot({
    path: testInfo.outputPath('select-full-wrapped.png'),
  });
  await page.keyboard.press('Escape');
});

test('Select width full wraps a long word in its list instead of scrolling it sideways', async ({
  page,
}, testInfo) => {
  await page.goto('/#select');
  if (testInfo.project.name === 'forced-colors') {
    await page.emulateMedia({ forcedColors: 'active' });
  }
  const section = page.locator('#select');
  const trigger = section.getByRole('combobox', { name: 'Cell habitat' });
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();
  const list = section.getByRole('listbox', { name: 'Cell habitat' });
  const word = 'Wattenmeernationalparkschutzgebietsvogelbestandserfassung';
  const option = section.getByRole('option', { name: word });
  await expect(option).toBeVisible();
  // One word longer than the column: it breaks across lines in the option.
  const oneLine = (await section
    .getByRole('option', { name: 'Forest' })
    .boundingBox())!.height;
  expect((await option.boundingBox())!.height).toBeGreaterThan(oneLine + 1);
  const overflow = await list.evaluate((node) => ({
    client: node.clientWidth,
    scroll: node.scrollWidth,
  }));
  expect(overflow.scroll).toBeLessThanOrEqual(overflow.client);
  const listBox = (await list.boundingBox())!;
  const triggerBox = (await trigger.boundingBox())!;
  expect(Math.abs(listBox.width - triggerBox.width)).toBeLessThan(0.5);
  await page.screenshot({
    path: testInfo.outputPath('select-full-long-word.png'),
  });
});

test('Select width full in an Inline takes the space a Button beside it leaves', async ({
  page,
}, testInfo) => {
  await page.goto('/#select');
  if (testInfo.project.name === 'forced-colors') {
    await page.emulateMedia({ forcedColors: 'active' });
  }
  const section = page.locator('#select');
  const trigger = section.getByRole('combobox', { name: 'Sighting filter' });
  const button = section.getByRole('button', { name: 'Log a new sighting' });
  await trigger.scrollIntoViewIfNeeded();
  const row = trigger.locator(
    "xpath=ancestor::div[contains(concat(' ', @class, ' '), ' sw-inline ')][1]",
  );
  const measure = await row.evaluate((node) => {
    const field = node.querySelector('.sw-select-full')!;
    const press = node.querySelector('button:not([role])')!;
    const range = document.createRange();
    range.selectNodeContents(press);
    const lineTops = new Set(
      [...range.getClientRects()].map((rect) => Math.round(rect.top)),
    );
    return {
      buttonLines: lineTops.size,
      buttonWidth: press.getBoundingClientRect().width,
      fieldWidth: field.getBoundingClientRect().width,
      gap: Number.parseFloat(getComputedStyle(node).columnGap),
      rowWidth: node.getBoundingClientRect().width,
    };
  });
  // A width: 100% field squeezed the button until its label wrapped.
  expect(measure.buttonLines).toBe(1);
  await expect(button).toBeVisible();
  // The field takes exactly what the button and the gap leave.
  expect(
    Math.abs(
      measure.fieldWidth + measure.gap + measure.buttonWidth - measure.rowWidth,
    ),
  ).toBeLessThan(1);
  const triggerBox = (await trigger.boundingBox())!;
  expect(Math.abs(triggerBox.width - measure.fieldWidth)).toBeLessThan(0.5);
  await row.screenshot({ path: testInfo.outputPath('select-full-inline.png') });
});
