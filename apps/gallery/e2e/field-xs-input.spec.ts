import { expect, test } from '@playwright/test';

test('an xs Field draws its own text input at the xs size, and 44 px on a coarse pointer', async ({
  page,
}, testInfo) => {
  await page.goto('/#field');
  const table = page.getByRole('table', { name: 'Band numbers' });
  await table.scrollIntoViewIfNeeded();
  const input = table.getByRole('textbox', {
    name: 'Band number for Merlin',
  });
  const coarse = await page.evaluate(
    () => matchMedia('(pointer: coarse)').matches,
  );
  expect(coarse).toBe(testInfo.project.name === 'mobile-es');

  const [height, fontSize, captionSize, xsHeight, target] =
    await input.evaluate((node) => {
      const probe = document.createElement('span');
      node.parentElement!.append(probe);
      probe.className = 'sw-text-caption';
      const read = (value: string) => {
        probe.style.minHeight = value;
        return getComputedStyle(probe).minHeight;
      };
      const caption = getComputedStyle(probe).fontSize;
      const xs = read('var(--sw-control-xs-min-height)');
      const md = read('var(--sw-control-md-min-height)');
      probe.remove();
      return [
        node.getBoundingClientRect().height,
        getComputedStyle(node).fontSize,
        caption,
        xs,
        md,
      ];
    });
  // The canvas's typed-input rule (md height, inherited type) no longer wins.
  expect(fontSize).toBe(captionSize);
  expect(`${height}px`).toBe(coarse ? target : xsHeight);
});
