import { expect, test } from '@playwright/test';

test('Box border draws a solid or a dashed token hairline', async ({
  page,
}, testInfo) => {
  await page.goto('/#layout');
  const example = page.locator('#layout').getByTestId('layout-dashed');
  const border = (text: string) =>
    example
      .getByText(text)
      .locator('xpath=..')
      .evaluate((element) => {
        const style = getComputedStyle(element);
        return {
          color: style.borderTopColor,
          style: style.borderTopStyle,
          width: style.borderTopWidth,
        };
      });
  const solid = await border('Species · Red fox');
  const dashed = await border('Observer · write it in by hand');
  expect(solid.style).toBe('solid');
  expect(dashed.style).toBe('dashed');
  expect(dashed.width).toBe('1px');
  expect(dashed.color).toBe(solid.color);
  await example.screenshot({ path: testInfo.outputPath('box-border.png') });
});
