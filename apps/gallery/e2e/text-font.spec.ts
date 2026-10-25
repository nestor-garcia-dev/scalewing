import { expect, test } from '@playwright/test';

test('Text font="mono" sets the monospace face at the variant size', async ({
  page,
}, testInfo) => {
  await page.goto('/#text');
  if (testInfo.project.name === 'forced-colors')
    await page.emulateMedia({ forcedColors: 'active' });
  const section = page.locator('#text');
  const code = section.getByText('R8M 3TW', { exact: true });
  const tag = section.getByText('Tag 0711 · 1180', { exact: true });
  await code.scrollIntoViewIfNeeded();

  const style = (locator: typeof code) =>
    locator.evaluate((node) => {
      const css = getComputedStyle(node);
      return {
        family: css.fontFamily,
        size: css.fontSize,
        weight: css.fontWeight,
        select: css.userSelect,
        color: css.color,
      };
    });
  const mono = await style(code);
  expect(mono.family).toBe('ui-monospace, monospace');
  expect(mono.select).not.toBe('none');
  expect((await style(tag)).family).toBe('ui-monospace, monospace');

  // The same size and weight as a sans headline; only the face changes.
  const headline = section.getByText('headline', { exact: true });
  const sans = await style(headline);
  expect(sans.family).not.toBe(mono.family);
  expect(mono.size).toBe(sans.size);
  expect(mono.weight).toBe(sans.weight);
  expect(mono.color).toBe(sans.color);

  // Fixed width: each character takes the same advance.
  const [narrow, wide] = await code.evaluate((node) => {
    const measure = (text: string) => {
      const span = document.createElement('span');
      span.textContent = text;
      node.append(span);
      const width = span.getBoundingClientRect().width;
      span.remove();
      return width;
    };
    return [measure('iiii'), measure('MMMM')];
  });
  expect(Math.round(narrow)).toBe(Math.round(wide));

  await code.screenshot({ path: testInfo.outputPath('text-font.png') });
});
