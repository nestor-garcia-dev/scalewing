import { expect, test } from '@playwright/test';

import { textContrast, tokenColor } from './contrast.js';

/** A CSS color as the page computes it beside `node`. */
async function probe(
  locator: import('@playwright/test').Locator,
  value: string,
): Promise<string> {
  return locator.evaluate((node, color) => {
    const span = document.createElement('span');
    span.style.backgroundColor = color;
    node.parentElement!.append(span);
    const computed = getComputedStyle(span).backgroundColor;
    span.remove();
    return computed;
  }, value);
}

test('Button neutral is a grey fill and disabledAppearance neutral greys a disabled button', async ({
  page,
}, testInfo) => {
  await page.goto('/#button');
  const forced = testInfo.project.name === 'forced-colors';
  if (forced) await page.emulateMedia({ forcedColors: 'active' });
  const group = page.getByRole('group', { name: 'Sheet actions' });
  const cancel = group.getByRole('button', { name: 'Cancel the sighting' });
  const record = group.getByRole('button', { name: 'Log the sighting' });
  const recount = group.getByRole('button', { name: 'Recount the herd' });
  const grey = 'color-mix(in srgb, var(--sw-color-muted) 16%, transparent)';

  await expect(cancel).toBeEnabled();
  await expect(record).toBeDisabled();
  await expect(recount).toBeDisabled();
  if (forced) return;

  await expect(cancel).toHaveCSS('background-color', await probe(cancel, grey));
  await expect(cancel).toHaveCSS('color', await tokenColor(page, 'text'));
  expect(await textContrast(cancel)).toBeGreaterThanOrEqual(4.5);

  // A disabled primary and a disabled secondary: the same grey, unfaded.
  for (const button of [record, recount]) {
    await expect(button).toHaveCSS('opacity', '1');
    await expect(button).toHaveCSS(
      'background-color',
      await probe(button, grey),
    );
  }
  // Its words in the muted color at 48 %, as the board's grey words.
  await expect(record).toHaveCSS(
    'color',
    await record.evaluate((node) => {
      const span = document.createElement('span');
      span.style.color =
        'color-mix(in srgb, var(--sw-color-muted) 48%, transparent)';
      node.parentElement!.append(span);
      const color = getComputedStyle(span).color;
      span.remove();
      return color;
    }),
  );
  await record.click({ force: true });
  await expect(page.getByText('log neutral disabled')).toHaveCount(0);
});
