import { expect, test } from '@playwright/test';

import { textContrast, tokenColor } from './contrast.js';

test('Field associates hint, required state, and replaceable validation error', async ({
  page,
}, testInfo) => {
  await page.goto('/#field');
  if (testInfo.project.name === 'forced-colors') {
    await page.emulateMedia({ forcedColors: 'active' });
    expect(
      await page.evaluate(() => matchMedia('(forced-colors: active)').matches),
    ).toBe(true);
  }
  const section = page.locator('#field');
  const input = section.getByRole('textbox', { name: 'Sighting name' });
  const hint = section.getByText('Use the name printed on the sighting card');
  await expect(input).toHaveAttribute('required', '');
  const hintId = await hint.getAttribute('id');
  expect(hintId).toBeTruthy();
  await expect(input).toHaveAttribute('aria-describedby', hintId ?? '');
  // The error region exists before any error, empty and polite, so a new
  // error is announced once when it appears (review of PR #73).
  const region = input
    .locator('xpath=ancestor::*[contains(@class, "sw-field")][1]')
    .locator('.sw-field-error');
  await expect(region).toHaveAttribute('aria-live', 'polite');
  await expect(region).toHaveText('');
  const regionId = await region.getAttribute('id');
  const validate = section.getByRole('button', { name: 'Validate sighting' });
  const spacing = async () =>
    ((await validate.boundingBox())?.y ?? 0) -
    ((await input.boundingBox())?.y ?? 0);
  const before = await spacing();
  await section.getByText('Sighting name').click();
  await expect(input).toBeFocused();
  const normalBorder = await input.evaluate(
    (element) => getComputedStyle(element).borderTopColor,
  );
  await section.screenshot({ path: testInfo.outputPath('field-hint.png') });

  await section.getByRole('button', { name: 'Validate sighting' }).click();
  const error = section.getByText('Enter a sighting name');
  // Swapped into the same region, which replaces the hint on screen.
  await expect(error).toHaveAttribute('id', regionId ?? '');
  await expect(region).toHaveText('Enter a sighting name');
  await expect(hint).toHaveCount(0);
  await expect(input).toHaveAttribute('aria-invalid', 'true');
  await expect(input).toHaveAccessibleDescription('Enter a sighting name');
  // Tied to the input, not an alert of its own, so a form with several
  // errors does not fire several alerts at once (Teisoro CHK-3).
  await expect(section.getByRole('alert')).toHaveCount(0);
  const invalidBorder = await input.evaluate(
    (element) => getComputedStyle(element).borderTopColor,
  );
  expect(invalidBorder).not.toBe(normalBorder);
  await expect(input).toHaveAttribute('aria-describedby', regionId ?? '');
  await section.screenshot({ path: testInfo.outputPath('field-error.png') });

  await input.fill('Red fox');
  await expect(error).toHaveCount(0);
  await expect(region).toHaveText('');
  // Empty, the region takes no room: the layout is as before the error.
  expect(Math.abs((await spacing()) - before)).toBeLessThan(1);
  await expect(input).not.toHaveAttribute('aria-invalid', 'true');
  await expect(hint).toBeVisible();
  await expect(input).toHaveAttribute('aria-describedby', hintId ?? '');
});

test('Field prefix and suffix sit inside the frame and join the name', async ({
  page,
}, testInfo) => {
  await page.goto('/#field');
  const section = page.locator('#field');
  const fee = section.getByRole('textbox', { name: 'Reserve entry fee $' });
  const wingspan = section.getByRole('textbox', { name: 'Wingspan cm' });
  await expect(fee).toHaveValue('12.50');
  await expect(wingspan).toHaveValue('38');
  await expect(
    section.getByRole('textbox', { name: 'Canopy cover %' }),
  ).toBeVisible();

  const frame = fee.locator('xpath=..');
  const prefix = frame.locator('.sw-field-prefix');
  const frameBox = await frame.boundingBox();
  const prefixBox = await prefix.boundingBox();
  const inputBox = await fee.boundingBox();
  expect(frameBox && prefixBox && inputBox).toBeTruthy();
  if (!frameBox || !prefixBox || !inputBox) return;
  expect(prefixBox.x).toBeGreaterThan(frameBox.x);
  expect(prefixBox.x + prefixBox.width).toBeLessThanOrEqual(inputBox.x);
  expect(inputBox.x + inputBox.width).toBeLessThanOrEqual(
    frameBox.x + frameBox.width,
  );
  expect(
    await fee.evaluate((element) => getComputedStyle(element).borderTopWidth),
  ).toBe('0px');
  expect(
    await frame.evaluate((element) => getComputedStyle(element).borderTopWidth),
  ).toBe('1px');

  // A press on the adornment focuses the input, as the text cursor promises.
  await wingspan.locator('xpath=..').locator('.sw-field-suffix').click();
  await expect(wingspan).toBeFocused();
  await prefix.click();
  await expect(fee).toBeFocused();
  expect(
    await frame.evaluate((element) => getComputedStyle(element).outlineStyle),
  ).toBe('solid');
  await fee.fill('20.00');
  await expect(fee).toHaveValue('20.00');
  await section.screenshot({ path: testInfo.outputPath('field-adorned.png') });
});

test('a disabled Field looks locked and keeps its value readable', async ({
  page,
}, testInfo) => {
  const forced = testInfo.project.name === 'forced-colors';
  if (forced) await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/#field');
  expect(
    await page.evaluate(() => matchMedia('(forced-colors: active)').matches),
  ).toBe(forced);
  const section = page.locator('#field');
  const editable = section.getByRole('textbox', { name: 'Species name' });
  const locked = section.getByRole('textbox', { name: 'Disabled control' });
  const style = (element: HTMLElement) => {
    const computed = getComputedStyle(element);
    return {
      background: computed.backgroundColor,
      borderColor: computed.borderTopColor,
      borderStyle: computed.borderTopStyle,
      cursor: computed.cursor,
      opacity: computed.opacity,
    };
  };
  await expect(locked).toBeDisabled();
  const lockedStyle = await locked.evaluate(style);
  const editableStyle = await editable.evaluate(style);
  // Teisoro DRW-17: a locked field was drawn exactly as an editable one.
  expect(lockedStyle.borderStyle).toBe('dashed');
  expect(editableStyle.borderStyle).toBe('solid');
  expect(lockedStyle.cursor).toBe('not-allowed');
  // Not faded as a disabled button is: the value keeps its contrast.
  expect(lockedStyle.opacity).toBe('1');
  if (forced) {
    // The system's disabled color draws the dashed border.
    expect(lockedStyle.borderColor).not.toBe(editableStyle.borderColor);
  } else {
    expect(await textContrast(locked)).toBeGreaterThanOrEqual(4.5);
    expect(lockedStyle.background).not.toBe(editableStyle.background);
  }

  // The same look on a disabled select and textarea.
  for (const control of [
    section.getByRole('combobox', { name: 'Recorded habitat' }),
    section.getByRole('textbox', { name: 'Survey notes' }),
  ]) {
    await expect(control).toBeDisabled();
    const look = await control.evaluate(style);
    expect(look).toMatchObject({
      borderStyle: 'dashed',
      cursor: 'not-allowed',
      opacity: '1',
    });
    if (forced) {
      expect(look.borderColor).not.toBe(editableStyle.borderColor);
    } else {
      expect(look.background).not.toBe(editableStyle.background);
      expect(await textContrast(control)).toBeGreaterThanOrEqual(4.5);
    }
  }

  // The placeholder is muted, which keeps 4.5:1 on the disabled fill.
  const placeholder = await section
    .getByRole('textbox', { name: 'Survey notes' })
    .evaluate((element) => getComputedStyle(element, '::placeholder').color);
  if (!forced) expect(placeholder).toBe(await tokenColor(page, 'muted'));

  // An adorned field draws the locked look on its frame.
  const nests = section.getByRole('textbox', { name: 'Counted nests nests' });
  await expect(nests).toBeDisabled();
  const frame = nests.locator('xpath=..');
  expect(await frame.evaluate(style)).toMatchObject({
    borderStyle: 'dashed',
    cursor: 'not-allowed',
    opacity: '1',
  });
  if (!forced) expect(await textContrast(nests)).toBeGreaterThanOrEqual(4.5);
  await locked.scrollIntoViewIfNeeded();
  await section.screenshot({ path: testInfo.outputPath('field-disabled.png') });
});

test('Field invalid marks a control without a message of its own', async ({
  page,
}, testInfo) => {
  await page.goto('/#field');
  const forced = testInfo.project.name === 'forced-colors';
  if (forced) await page.emulateMedia({ forcedColors: 'active' });
  const section = page.locator('#field');
  const group = section.getByRole('group', { name: 'Nest count' });
  const eggs = group.getByRole('textbox', { name: 'Eggs' });
  const chicks = group.getByRole('textbox', { name: 'Chicks' });
  const borderOf = (input: typeof eggs) =>
    input.evaluate((element) => getComputedStyle(element).borderTopColor);
  const normal = await borderOf(eggs);
  await expect(eggs).not.toHaveAttribute('aria-invalid', 'true');

  // Teisoro DRW-18: a count that adds up to nothing showed its one message
  // under the group, and the count fields got no red border.
  await section.getByRole('button', { name: 'Check nest count' }).click();
  const invalidBorder = await borderOf(eggs);
  for (const input of [eggs, chicks]) {
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleDescription(
      'Count at least one egg or chick.',
    );
    const border = await borderOf(input);
    expect(border).not.toBe(normal);
    if (!forced) expect(border).toBe(await tokenColor(page, 'danger'));
    // No message of its own: its polite region stays empty.
    await expect(
      input
        .locator('xpath=ancestor::*[contains(@class, "sw-field")][1]')
        .locator('.sw-field-error'),
    ).toHaveText('');
  }
  // The group's one message, not one per field.
  await expect(
    section.getByText('Count at least one egg or chick.'),
  ).toHaveCount(1);
  await expect(section.getByRole('alert')).toHaveCount(0);
  await group.screenshot({ path: testInfo.outputPath('field-invalid.png') });

  await eggs.fill('3');
  await expect(eggs).not.toHaveAttribute('aria-invalid', 'true');
  await expect(chicks).not.toHaveAttribute('aria-invalid', 'true');
  // The danger border goes with the state.
  await expect.poll(() => borderOf(chicks)).not.toBe(invalidBorder);
  if (!forced) await expect.poll(() => borderOf(chicks)).toBe(normal);
});

test('Field changed marks a corrected value with the accent border, and says what it was', async ({
  page,
}, testInfo) => {
  const forced = testInfo.project.name === 'forced-colors';
  if (forced) await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/#field');
  const adults = page.getByRole('textbox', { name: 'Adult herons' });
  const weight = page.getByRole('textbox', { name: 'Feed weight g' });
  await adults.scrollIntoViewIfNeeded();
  const border = (element: HTMLElement) => {
    const style = getComputedStyle(element);
    return { color: style.borderTopColor, shadow: style.boxShadow };
  };
  const frame = page.locator('.sw-field-adorned').filter({ has: weight });
  const before = await adults.evaluate(border);
  const boxBefore = await adults.boundingBox();
  await expect(page.getByText('No value changed.')).toBeVisible();

  await adults.fill('26');
  await adults.blur();
  await expect(adults).toHaveAccessibleDescription('Was 25');
  await expect(page.getByText('1 value changed · not saved yet')).toBeVisible();
  const after = await adults.evaluate(border);
  expect(after.color).not.toBe(before.color);
  if (!forced) expect(after.shadow).toMatch(/inset/);
  // Nothing moves: the border's extra width is a shadow inside it.
  expect(await adults.boundingBox()).toEqual(boxBefore);
  expect(await adults.getAttribute('aria-invalid')).toBeNull();

  // An adorned field marks its frame.
  const frameBefore = await frame.evaluate(border);
  await weight.fill('500.00');
  await weight.blur();
  await expect(weight).toHaveAccessibleDescription(/Was 480.00 g/);
  expect((await frame.evaluate(border)).color).not.toBe(frameBefore.color);
  await expect(
    page.getByText('2 values changed · not saved yet'),
  ).toBeVisible();
  await page
    .locator('.sw-field')
    .filter({ has: adults })
    .locator('..')
    .screenshot({ path: testInfo.outputPath('field-changed.png') });

  // Back to the saved value, the mark goes.
  await adults.fill('25');
  await adults.blur();
  expect((await adults.evaluate(border)).color).toBe(before.color);
});
