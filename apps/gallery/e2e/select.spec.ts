import { expect, test } from '@playwright/test';

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
