import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.project.name !== 'forced-colors') return;
  await page.emulateMedia({ forcedColors: 'active' });
});

test("Select aria-labelledby is named by the page's words, read once", async ({
  page,
}) => {
  await page.goto('/#select');
  const section = page.locator('#select');
  const trigger = section.getByRole('combobox', { name: 'Den habitat' });
  await expect(trigger).toHaveText('Forest');

  // The words are in the page once: the select draws no label, hidden or
  // shown, so the accessibility tree holds them as text once and as the
  // combobox's name.
  const words = section.getByText('Den habitat', { exact: true });
  await expect(words).toHaveCount(1);
  const example = words.locator('xpath=..');
  await expect(example.getByRole('combobox')).toHaveCount(1);
  await expect(example.locator('label')).toHaveCount(0);
  await expect(example).toMatchAriaSnapshot(`
    - text: Den habitat
    - combobox "Den habitat": Forest
  `);

  // The trigger sits right under the page's words, as a labelled one does.
  const [wordsBox, triggerBox] = await Promise.all([
    words.boundingBox(),
    trigger.boundingBox(),
  ]);
  expect(wordsBox && triggerBox).toBeTruthy();
  if (wordsBox && triggerBox)
    expect(triggerBox.y).toBeGreaterThanOrEqual(wordsBox.y + wordsBox.height);

  // The open list is named by the same words and a choice commits.
  await trigger.click();
  await expect(
    section.getByRole('listbox', { name: 'Den habitat' }),
  ).toBeVisible();
  await section.getByRole('option', { name: 'Savanna' }).click();
  await expect(trigger).toHaveText('Savanna');
});
