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
  // In an Inline the same variant takes only its labels' width, halves still equal.
  const inline = section.getByRole('radiogroup', { name: 'Species names' });
  const inlineBox = await inline.boundingBox();
  const inlineParent = await inline.evaluate(
    (element) =>
      (element.parentElement as HTMLElement).getBoundingClientRect().width,
  );
  expect(inlineBox?.width ?? 0).toBeLessThan(inlineParent * 0.6);
  const common = await inline
    .getByRole('radio', { name: 'Common' })
    .boundingBox();
  const scientific = await inline
    .getByRole('radio', { name: 'Scientific' })
    .boundingBox();
  expect(
    Math.abs((common?.width ?? 0) - (scientific?.width ?? 0)),
  ).toBeLessThan(2);
  // A disabled control keeps its recorded choice and refuses clicks and arrows.
  const recorded = section.getByRole('radiogroup', {
    name: 'Recorded sighting',
  });
  await expect(recorded).toHaveAttribute('aria-disabled', 'true');
  const wild = recorded.getByRole('radio', { name: 'In the wild' });
  const captive = recorded.getByRole('radio', { name: 'In captivity' });
  await expect(captive).toBeDisabled();
  await wild.focus();
  await page.keyboard.press('ArrowRight');
  await expect(wild).toHaveAttribute('aria-checked', 'true');
  expect(
    await recorded.evaluate((element) => getComputedStyle(element).opacity),
  ).not.toBe('1');
  await section.screenshot({
    path: testInfo.outputPath('segmented-control.png'),
  });
});
