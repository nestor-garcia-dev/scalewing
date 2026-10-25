import { expect, test } from '@playwright/test';

import { axeViolations } from './axe-scan.js';

test('Field descriptionTone="warning" draws an amber hint that never marks the field invalid', async ({
  page,
}, testInfo) => {
  const forced = testInfo.project.name === 'forced-colors';
  await page.goto('/#field');
  if (forced) await page.emulateMedia({ forcedColors: 'active' });
  const table = page.getByRole('table', { name: 'Band numbers' });
  await table.scrollIntoViewIfNeeded();

  const kestrel = table.getByRole('textbox', {
    name: 'Band number for Kestrel',
  });
  const merlin = table.getByRole('textbox', { name: 'Band number for Merlin' });
  await expect(kestrel).toHaveAccessibleDescription('Hobby also wears 7');
  await expect(merlin).toHaveAccessibleDescription('');
  for (const box of [kestrel, merlin])
    expect(await box.getAttribute('aria-invalid')).toBeNull();

  const hint = table.getByText('Hobby also wears 7');
  const warning = table.locator('.sw-field-description-warning');
  await expect(warning).toHaveCount(2);
  await expect(warning.first()).toHaveText('Hobby also wears 7');
  const glyph = warning.first().locator('svg');
  await expect(glyph).toBeVisible();
  expect(await glyph.getAttribute('aria-hidden')).toBe('true');
  const [glyphBox, textBox] = [
    await glyph.boundingBox(),
    await hint.boundingBox(),
  ];
  expect(glyphBox!.width).toBe(16);
  expect(glyphBox!.height).toBe(16);
  // The glyph sits before the words on their first line.
  expect(glyphBox!.x + glyphBox!.width).toBeLessThanOrEqual(textBox!.x);
  expect(glyphBox!.y).toBeGreaterThanOrEqual(textBox!.y);

  // The border stays the plain hairline of a field with no hint.
  const borderOf = (box: typeof kestrel) =>
    box.evaluate((node) => getComputedStyle(node).borderTopColor);
  expect(await borderOf(kestrel)).toBe(await borderOf(merlin));
  const [glyphStroke, colour, warn] = await warning.first().evaluate((node) => {
    const probe = document.createElement('span');
    node.append(probe);
    probe.style.color = 'var(--sw-color-warning)';
    const tone = getComputedStyle(probe).color;
    probe.remove();
    return [
      getComputedStyle(node.querySelector('svg')!).stroke,
      getComputedStyle(node).color,
      tone,
    ];
  });
  expect(glyphStroke).toBe(colour);
  if (forced) {
    const text = await table
      .getByRole('rowheader', { name: 'Kestrel' })
      .evaluate((node) => getComputedStyle(node).color);
    expect(colour).toBe(text);
  } else {
    expect(colour).toBe(warn);
  }

  // Changing the number clears both warnings; matching again brings one back.
  await kestrel.fill('8');
  await expect(kestrel).toHaveAccessibleDescription('');
  await expect(
    table.getByRole('textbox', { name: 'Band number for Hobby' }),
  ).toHaveAccessibleDescription('');
  await merlin.fill('8');
  await expect(merlin).toHaveAccessibleDescription('Kestrel also wears 8');
  expect(await merlin.getAttribute('aria-invalid')).toBeNull();

  expect(await axeViolations(page, 'table[aria-label="Band numbers"]')).toEqual(
    [],
  );
  await table.screenshot({
    path: testInfo.outputPath('field-description-tone.png'),
  });
});
