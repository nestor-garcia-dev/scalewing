import { expect, test } from '@playwright/test';

test('SegmentedControl filled variant stretches, splits evenly and fills the selection', async ({
  page,
}, testInfo) => {
  await page.goto('/#segmented-control');
  const section = page.locator('#segmented-control');
  const filled = section.getByRole('radiogroup', { name: 'Survey period' });
  const filledBox = await filled.boundingBox();
  const parentBox = await filled.evaluate((element) => {
    const rect = (element.parentElement as HTMLElement).getBoundingClientRect();
    return { width: rect.width };
  });
  expect(filledBox).not.toBeNull();
  expect(Math.abs((filledBox?.width ?? 0) - parentBox.width)).toBeLessThan(2);

  const day = filled.getByRole('radio', { name: 'Daytime' });
  const night = filled.getByRole('radio', { name: 'Nighttime' });
  const dayBox = await day.boundingBox();
  const nightBox = await night.boundingBox();
  expect(Math.abs((dayBox?.width ?? 0) - (nightBox?.width ?? 0))).toBeLessThan(
    2,
  );

  const fill = (element: HTMLElement) =>
    getComputedStyle(element).backgroundColor;
  const selectedFill = await day.evaluate(fill);
  const idleFill = await night.evaluate(fill);
  expect(selectedFill).not.toBe(idleFill);
  await expect(day).toHaveAttribute('aria-checked', 'true');
  await night.click();
  await expect(night).toHaveAttribute('aria-checked', 'true');
  expect(await night.evaluate(fill)).toBe(selectedFill);
  await section.screenshot({
    path: testInfo.outputPath('segmented-control.png'),
  });
});
