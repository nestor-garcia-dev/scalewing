import { expect, test } from '@playwright/test';

test('Tabs select with the pointer and the keyboard, show one panel and scroll on a phone', async ({
  page,
}, testInfo) => {
  await page.goto('/#tabs');
  const section = page.locator('#tabs');
  const list = section.getByRole('tablist', { name: 'Habitats' });
  const forest = list.getByRole('tab', { name: 'Forest' });
  const savanna = list.getByRole('tab', { name: 'Savanna' });
  await expect(forest).toHaveAttribute('aria-selected', 'true');
  await expect(section.getByRole('tabpanel')).toHaveCount(1);
  await expect(section.getByRole('tabpanel')).toContainText('Red fox');

  await savanna.click();
  await expect(savanna).toHaveAttribute('aria-selected', 'true');
  await expect(section.getByRole('tabpanel')).toContainText('Lion pride');
  await expect(section.getByRole('tabpanel')).toHaveAttribute(
    'aria-labelledby',
    'habitats-tab-savanna',
  );

  await page.keyboard.press('ArrowRight');
  await expect(list.getByRole('tab', { name: 'Ocean' })).toBeFocused();
  await expect(section.getByRole('tabpanel')).toContainText('sea turtle');
  await page.keyboard.press('End');
  await expect(list.getByRole('tab', { name: 'Desert' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await page.keyboard.press('ArrowRight');
  await expect(forest).toHaveAttribute('aria-selected', 'true');

  const underline = (element: HTMLElement) =>
    getComputedStyle(element).borderBottomColor;
  expect(await forest.evaluate(underline)).not.toBe(
    await savanna.evaluate(underline),
  );

  const overflow = await list.evaluate(
    (element) => element.scrollWidth > element.clientWidth,
  );
  if (testInfo.project.name === 'mobile-es') {
    expect(overflow).toBe(true);
  }
  await section.screenshot({ path: testInfo.outputPath('tabs.png') });
});
