import { expect, test } from '@playwright/test';

import { textContrast, tokenColor } from './contrast.js';

test('ButtonGroup track: words on one grey track with hairline dividers', async ({
  page,
}, testInfo) => {
  await page.goto('/#button-group');
  const forced = testInfo.project.name === 'forced-colors';
  if (forced) await page.emulateMedia({ forcedColors: 'active' });
  const group = page.getByRole('group', { name: 'Survey week' });
  const previous = group.getByRole('button', { name: 'Previous week' });
  const week = group.getByRole('button', { name: 'This week' });
  const next = group.getByRole('button', { name: 'Next week' });
  await expect(next).toBeDisabled();
  if (!forced) await expect(next).toHaveCSS('opacity', '0.4');

  // One row, joined: no gap between the buttons.
  const left = (await previous.boundingBox())!;
  const middle = (await week.boundingBox())!;
  expect(Math.abs(left.x + left.width - middle.x)).toBeLessThanOrEqual(1);

  if (forced) {
    await expect(group).toHaveCSS('outline-style', 'solid');
  } else {
    const grey = await group.evaluate((node) => {
      const span = document.createElement('span');
      span.style.backgroundColor =
        'color-mix(in srgb, var(--sw-color-muted) 16%, transparent)';
      node.parentElement!.append(span);
      const color = getComputedStyle(span).backgroundColor;
      span.remove();
      return color;
    });
    await expect(group).toHaveCSS('background-color', grey);
    await expect(week).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await expect(week).toHaveCSS('color', await tokenColor(page, 'text'));
    await expect(week).toHaveCSS(
      'border-left-color',
      await tokenColor(page, 'border'),
    );
    await expect(previous).toHaveCSS('border-left-color', 'rgba(0, 0, 0, 0)');
    expect(await textContrast(week)).toBeGreaterThanOrEqual(4.5);
  }
  await week.click();
  await expect(page.getByText('Last press: This week')).toBeVisible();
});

test('ButtonGroup track keeps its tokens in the dark scheme', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === 'forced-colors');
  await page.goto('/#button-group');
  await page.getByRole('radio', { name: 'Dark' }).check();
  const group = page.getByRole('group', { name: 'Survey week' });
  const week = group.getByRole('button', { name: 'This week' });
  await expect(week).toHaveCSS('color', await tokenColor(page, 'text'));
  await expect(week).toHaveCSS(
    'border-left-color',
    await tokenColor(page, 'border'),
  );
  await expect(group).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
});
