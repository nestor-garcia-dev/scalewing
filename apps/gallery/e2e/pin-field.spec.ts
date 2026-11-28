import { expect, test, type Locator, type Page } from '@playwright/test';

import { axeViolations } from './axe-scan.js';

/**
 * Everything a reader of the page could get from the section's PinFields:
 * their markup and each input's live value, without what the pad's keys
 * themselves draw.
 */
async function sectionState(section: Locator): Promise<string> {
  return section.evaluate((root) =>
    [...root.querySelectorAll('.sw-pin-field')]
      .map((field) => {
        const values = [...field.querySelectorAll('input')].map(
          (input) => input.value,
        );
        const copy = field.cloneNode(true) as Element;
        for (const key of copy.querySelectorAll('.sw-pin-field-key'))
          key.textContent = '';
        return `${copy.outerHTML}\n${JSON.stringify(values)}`;
      })
      .join('\n'),
  );
}

async function forceColors(page: Page, project: string) {
  if (project === 'forced-colors')
    await page.emulateMedia({ forcedColors: 'active' });
}

test('PinField takes typed and pasted digits, shows dots and keeps the digits out of the page', async ({
  page,
}, testInfo) => {
  await forceColors(page, testInfo.project.name);
  await page.goto('/#pin-field');
  const section = page.locator('#pin-field');
  const typed = section.getByTestId('pin-field-typed');
  const code = typed.getByRole('textbox', { name: 'New gate code' });
  const again = typed.getByRole('textbox', { name: 'Enter it again' });
  const filled = typed
    .locator('.sw-pin-field')
    .first()
    .locator('.sw-pin-field-dot-filled');

  // One real text input for digits, not a password field.
  await expect(code).toHaveAttribute('type', 'text');
  await expect(code).toHaveAttribute('inputmode', 'numeric');
  await expect(code).toHaveAttribute('autocomplete', 'off');
  await expect(section.locator("input[type='password']")).toHaveCount(0);
  await expect(code).toHaveAccessibleDescription(
    '0 of 6 digits entered Six digits. The dots fill as you type.',
  );

  // Typed digits fill dots; anything else is dropped.
  await code.click();
  await expect(code).toBeFocused();
  await page.keyboard.type('7a8-');
  await expect(filled).toHaveCount(2);
  await expect(code).toHaveValue('••');
  await expect(code).toHaveAccessibleDescription(
    '2 of 6 digits entered Six digits. The dots fill as you type.',
  );
  // The count is announced in a polite status.
  await expect(
    typed.locator('.sw-pin-field').first().getByRole('status'),
  ).toHaveText('2 of 6 digits entered');

  // Backspace removes the last digit.
  await page.keyboard.press('Backspace');
  await expect(filled).toHaveCount(1);

  // Text put in at once, as a paste puts it (one input event for all of
  // it): its digits are kept, cut to the length.
  await page.keyboard.insertText('89 78-97 9');
  await expect(filled).toHaveCount(6);
  await expect(code).toHaveValue('••••••');
  // A digit typed on a full field is refused: the browser's edit is undone
  // and the input is the mask again.
  await page.keyboard.type('7');
  await expect(code).toHaveValue('••••••');
  await expect(filled).toHaveCount(6);

  // No digit of the code (7, 8, 9) is anywhere in the section.
  const state = await sectionState(section);
  expect(state).not.toMatch(/[789]/);
  expect(await code.getAttribute('value')).toBe('••••••');

  // The frame is the md control and shows the focus ring; the input is unseen.
  const entry = typed.locator('.sw-pin-field-entry').first();
  expect(Math.round((await entry.boundingBox())!.height)).toBe(44);
  await expect(entry).toHaveCSS('outline-style', 'solid');
  await expect(code).toHaveCSS('opacity', '0');
  // 16 px or more, so iOS does not zoom on focus.
  expect(
    parseFloat(await code.evaluate((node) => getComputedStyle(node).fontSize)),
  ).toBeGreaterThanOrEqual(16);

  // A second entry that differs says why, as a Field's error.
  await again.click();
  await page.keyboard.type('111111');
  await expect(again).toHaveAttribute('aria-invalid', 'true');
  await expect(
    typed.getByText('The two codes are not the same.'),
  ).toBeVisible();

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await section.screenshot({ path: testInfo.outputPath('pin-field.png') });
});

test('PinField pad enters digits from 64 px keys that keep the focus, and completes once', async ({
  page,
}, testInfo) => {
  await forceColors(page, testInfo.project.name);
  await page.goto('/#pin-field');
  const section = page.locator('#pin-field');
  const card = section.getByTestId('pin-field-pad');
  const input = card.getByRole('textbox', { name: 'Hide door code' });
  const pad = card.getByRole('group', { name: 'Number pad' });
  const keys = pad.getByRole('button');
  await expect(keys).toHaveCount(11);
  const remove = pad.getByRole('button', { name: 'Delete the last digit' });

  // Every key is at least 64 px both ways, with a visible edge.
  for (const key of await keys.all()) {
    const box = (await key.boundingBox())!;
    expect(box.height).toBeGreaterThanOrEqual(64);
    expect(box.width).toBeGreaterThanOrEqual(64);
    await expect(key).toHaveCSS('border-top-width', '1px');
    await expect(key).toHaveCSS('border-top-style', 'solid');
  }
  // Three columns: 1, 2 and 3 share a row; 0 is under 8.
  const [one, two, three] = await Promise.all(
    ['1', '2', '3'].map((name) =>
      pad.getByRole('button', { name, exact: true }).boundingBox(),
    ),
  );
  expect(one!.y).toBe(two!.y);
  expect(two!.y).toBe(three!.y);
  const eight = (await pad
    .getByRole('button', { name: '8', exact: true })
    .boundingBox())!;
  const zero = (await pad
    .getByRole('button', { name: '0', exact: true })
    .boundingBox())!;
  expect(zero.x).toBe(eight.x);
  expect(zero.y).toBeGreaterThan(eight.y);

  // Nothing to delete yet: marked off, still focusable.
  await expect(remove).toHaveAttribute('aria-disabled', 'true');
  expect(
    await remove.evaluate((node: HTMLButtonElement) => node.disabled),
  ).toBe(false);

  // A press enters a digit and the key keeps the focus.
  const seven = pad.getByRole('button', { name: '7', exact: true });
  await seven.click();
  await expect(seven).toBeFocused();
  await expect(input).toHaveValue('•');
  await expect(card.locator('.sw-pin-field-dot-filled')).toHaveCount(1);
  await expect(remove).not.toHaveAttribute('aria-disabled', 'true');

  // The keyboard works on a key, and shows the focus ring there.
  await page.keyboard.press('Tab');
  await expect(
    pad.getByRole('button', { name: '8', exact: true }),
  ).toBeFocused();
  await expect(pad.getByRole('button', { name: '8', exact: true })).toHaveCSS(
    'outline-style',
    'solid',
  );
  await page.keyboard.press('Enter');
  await expect(card.locator('.sw-pin-field-dot-filled')).toHaveCount(2);

  // Delete removes the last one; typing in the input mixes with the pad.
  await remove.click();
  await expect(card.locator('.sw-pin-field-dot-filled')).toHaveCount(1);
  await input.focus();
  await page.keyboard.type('89');
  await expect(card.locator('.sw-pin-field-dot-filled')).toHaveCount(3);
  await expect(card.getByText('No code checked yet')).toBeVisible();

  // The sixth digit completes, once.
  for (const name of ['9', '8', '7'])
    await pad.getByRole('button', { name, exact: true }).click();
  await expect(card.getByText('Codes checked: one')).toBeVisible();
  await seven.click();
  await expect(card.getByText('Codes checked: one')).toBeVisible();
  await expect(input).toHaveValue('••••••');

  // The digits pressed are nowhere in the section but on the keys' faces.
  expect(await sectionState(section)).not.toMatch(/[789]/);

  // The dots are centred over the pad, and the pad fits its card.
  const dots = (await card.locator('.sw-pin-field-dots').boundingBox())!;
  const padBox = (await pad.boundingBox())!;
  expect(
    Math.abs(dots.x + dots.width / 2 - (padBox.x + padBox.width / 2)),
  ).toBeLessThanOrEqual(1);
  expect(padBox.width).toBeLessThanOrEqual(320);

  // In a wide parent that centres nothing, the column centres itself.
  const wide = section.getByTestId('pin-field-disabled-pad');
  const wideBox = (await wide.boundingBox())!;
  const column = (await wide.locator('.sw-pin-field').boundingBox())!;
  if (testInfo.project.name !== 'mobile-es')
    expect(wideBox.width).toBeGreaterThan(2 * column.width);
  expect(column.width).toBeLessThanOrEqual(320);
  expect(
    Math.abs(column.x + column.width / 2 - (wideBox.x + wideBox.width / 2)),
  ).toBeLessThanOrEqual(1);

  // A refused code: the error is under the keys and announced politely.
  const refused = section.getByTestId('pin-field-refused');
  const error = refused.getByText('That code is not right. Try again.');
  await expect(error).toBeVisible();
  await expect(error).toHaveAttribute('aria-live', 'polite');
  const refusedPad = (await refused.getByRole('group').boundingBox())!;
  expect((await error.boundingBox())!.y).toBeGreaterThanOrEqual(
    refusedPad.y + refusedPad.height,
  );

  // Disabled: the input and every key are off.
  const off = section.getByTestId('pin-field-disabled-pad');
  await expect(off.getByRole('textbox')).toBeDisabled();
  for (const key of await off.getByRole('button').all())
    await expect(key).toBeDisabled();
  const locked = section.getByTestId('pin-field-disabled');
  await expect(locked.getByRole('textbox')).toBeDisabled();
  // A disabled input stays unseen (the canvas would draw it), under its dots
  // in a dashed frame.
  for (const input of [locked.getByRole('textbox'), off.getByRole('textbox')])
    await expect(input).toHaveCSS('opacity', '0');
  await expect(locked.locator('.sw-pin-field-dot-filled')).toHaveCount(3);
  await expect(locked.locator('.sw-pin-field-dot').first()).toBeVisible();
  await expect(locked.locator('.sw-pin-field-entry')).toHaveCSS(
    'border-top-style',
    'dashed',
  );

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await section.screenshot({ path: testInfo.outputPath('pin-field-pad.png') });
});

test('PinField passes axe in light and dark', async ({ page }, testInfo) => {
  // axe reads forced colours' painted text as its authored colour.
  test.skip(testInfo.project.name === 'forced-colors');
  await page.goto('/#pin-field');
  const fields = '#pin-field .sw-pin-field';
  expect(await axeViolations(page, fields)).toEqual([]);
  await page.getByRole('radio', { name: 'Dark' }).check();
  await expect(page.getByRole('radio', { name: 'Dark' })).toBeChecked();
  expect(await axeViolations(page, fields)).toEqual([]);
  await page
    .locator('#pin-field')
    .screenshot({ path: testInfo.outputPath('pin-field-dark.png') });
});
