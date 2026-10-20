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

test('sw-container-reading centres a column at the reading width and is full width below it', async ({
  page,
}, testInfo) => {
  await page.goto('/#layout');
  const column = page.locator('#layout').getByTestId('layout-reading');
  const [box, parent, readingMax] = await column.evaluate((node) => {
    const own = node.getBoundingClientRect();
    const around = (node.parentElement as HTMLElement).getBoundingClientRect();
    const probe = document.createElement('div');
    probe.style.width = 'var(--sw-reading-max)';
    node.append(probe);
    const width = probe.getBoundingClientRect().width;
    probe.remove();
    return [
      { left: own.left, right: own.right, width: own.width },
      { left: around.left, right: around.right, width: around.width },
      width,
    ];
  });
  if (parent.width > readingMax) {
    expect(box.width).toBeCloseTo(readingMax, 0);
    // Centred: the same room on each side.
    expect(
      Math.abs(box.left - parent.left - (parent.right - box.right)),
    ).toBeLessThan(1);
  } else {
    expect(box.width).toBeCloseTo(parent.width, 0);
  }
  if (testInfo.project.name === 'desktop-en')
    expect(parent.width).toBeGreaterThan(readingMax);
  if (testInfo.project.name === 'mobile-es')
    expect(parent.width).toBeLessThan(readingMax);
  await column.screenshot({
    path: testInfo.outputPath('container-reading.png'),
  });
});
