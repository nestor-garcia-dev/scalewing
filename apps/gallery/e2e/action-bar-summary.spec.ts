import { expect, test } from '@playwright/test';

test('ActionBar summary shows a large figure in the polite status and tones it', async ({
  page,
}, testInfo) => {
  await page.goto('/#action-bar');
  if (testInfo.project.name === 'forced-colors') {
    await page.emulateMedia({ forcedColors: 'active' });
    expect(
      await page.evaluate(() => matchMedia('(forced-colors: active)').matches),
    ).toBe(true);
  }
  const example = page.getByTestId('action-bar-summary');
  const status = example.getByRole('status');
  await expect(status).toHaveText('Counted 14 nests short 2');
  // What assistive technology reads: the words apart, in order.
  await expect(status).toMatchAriaSnapshot(
    '- status: Counted 14 nests short 2',
  );
  const value = status.locator('.sw-action-bar-summary-value');
  const label = status.locator('.sw-action-bar-summary-label');
  const save = example.getByRole('button', { name: 'Save count' });
  await expect(save).toBeDisabled();

  // The value is the heading size (28, 24 below md) on the label's baseline.
  const size = await value.evaluate((node) => getComputedStyle(node).fontSize);
  expect(size).toBe(testInfo.project.name === 'mobile-es' ? '24px' : '28px');
  const baseline = async (locator: typeof value) =>
    locator.evaluate((node) => {
      const box = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      return (
        box.bottom -
        (parseFloat(style.lineHeight) - parseFloat(style.fontSize)) / 2
      );
    });
  expect(
    Math.abs((await baseline(value)) - (await baseline(label))),
  ).toBeLessThan(6);

  const short = await value.evaluate((node) => getComputedStyle(node).color);
  const more = example
    .getByRole('group', { name: 'Nests counted on the island' })
    .getByRole('button', { name: 'One more' });
  await more.click();
  await more.click();
  await expect(status).toHaveText('Counted 16 nests matches 16');
  await expect(save).toBeEnabled();
  if (testInfo.project.name !== 'forced-colors')
    expect(
      await value.evaluate((node) => getComputedStyle(node).color),
    ).not.toBe(short);

  await example.screenshot({
    path: testInfo.outputPath('action-bar-summary.png'),
  });
});
