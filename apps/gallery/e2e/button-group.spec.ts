import { expect, test } from '@playwright/test';

test('ButtonGroup sits at the end on desktop and stacks full width on a phone', async ({
  page,
}, testInfo) => {
  await page.goto('/#button-group');
  const section = page.locator('#button-group');
  const group = section.getByRole('group', { name: 'Sighting actions' });
  const discard = group.getByRole('button', { name: 'Discard' });
  const save = group.getByRole('button', { name: 'Save sighting' });
  const groupBox = await group.boundingBox();
  const discardBox = await discard.boundingBox();
  const saveBox = await save.boundingBox();
  expect(groupBox).not.toBeNull();
  expect(discardBox).not.toBeNull();
  expect(saveBox).not.toBeNull();
  const isPhone = testInfo.project.name === 'mobile-es';
  if (isPhone) {
    // Stacked, each button the whole row, primary last.
    expect((saveBox?.y ?? 0) > (discardBox?.y ?? 0)).toBe(true);
    expect(
      Math.abs((saveBox?.width ?? 0) - (groupBox?.width ?? 0)),
    ).toBeLessThan(2);
    expect(
      Math.abs((discardBox?.width ?? 0) - (groupBox?.width ?? 0)),
    ).toBeLessThan(2);
  } else {
    // One row, flush with the end of the group.
    expect(Math.abs((saveBox?.y ?? 0) - (discardBox?.y ?? 0))).toBeLessThan(2);
    const groupEnd = (groupBox?.x ?? 0) + (groupBox?.width ?? 0);
    const saveEnd = (saveBox?.x ?? 0) + (saveBox?.width ?? 0);
    expect(Math.abs(groupEnd - saveEnd)).toBeLessThan(2);
    expect((saveBox?.width ?? 0) < (groupBox?.width ?? 0) / 2).toBe(true);
  }
  await save.click();
  await expect(section.getByText('Last press: Save sighting')).toBeVisible();
  await section.screenshot({ path: testInfo.outputPath('button-group.png') });
});
