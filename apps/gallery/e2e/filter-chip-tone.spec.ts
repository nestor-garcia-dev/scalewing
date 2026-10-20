import { expect, test } from '@playwright/test';

import {
  colorContrast,
  systemColor,
  textContrast,
  tokenColor,
} from './contrast.js';

/** A colour the page computes, read from a probe on the themed canvas. */
function computed(
  page: import('@playwright/test').Page,
  property: 'color' | 'backgroundColor',
  value: string,
): Promise<string> {
  return page.evaluate(
    ([name, color]) => {
      const probe = document.createElement('span');
      probe.style[name as 'color'] = color!;
      (document.querySelector('[data-theme]') ?? document.body).append(probe);
      const result = getComputedStyle(probe)[name as 'color'];
      probe.remove();
      return result;
    },
    [property, value],
  );
}

test('FilterChips draws a warning chip in the warning tint until it is chosen', async ({
  page,
}, testInfo) => {
  const forced = testInfo.project.name === 'forced-colors';
  if (forced) await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/#filter-chips');
  const group = page.getByRole('group', { name: 'Camera traps to check' });
  const chip = group.getByRole('checkbox', {
    name: 'Not checked this week 2',
  });
  const face = chip.locator('xpath=following-sibling::*[1]');
  const count = face.locator('.sw-filter-chip-count-inline');
  const flooded = group.getByRole('checkbox', {
    name: 'Flooded since the storm 0',
  });
  const floodedFace = flooded.locator('xpath=following-sibling::*[1]');

  if (forced) {
    // Forced colours draw it as every chip; its words say why.
    await expect(face).toHaveCSS(
      'background-color',
      await systemColor(page, 'Canvas'),
    );
    await expect(face).toHaveCSS(
      'color',
      await systemColor(page, 'CanvasText'),
    );
  } else {
    await expect(face).toHaveCSS(
      'background-color',
      await computed(
        page,
        'backgroundColor',
        'color-mix(in srgb, var(--sw-color-warning) 10%, var(--sw-color-surface))',
      ),
    );
    const ink = await computed(
      page,
      'color',
      'color-mix(in srgb, var(--sw-color-warning) 70%, var(--sw-color-text))',
    );
    await expect(face).toHaveCSS('color', ink);
    await expect(count).toHaveCSS('color', ink);
    expect(await textContrast(face)).toBeGreaterThanOrEqual(4.5);
  }
  await group.screenshot({ path: testInfo.outputPath('warning-chip.png') });

  // With nothing in it, it is quiet like every chip: no fill, muted words.
  if (!forced) {
    await expect(floodedFace).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await expect(floodedFace).toHaveCSS(
      'color',
      await tokenColor(page, 'muted'),
    );
    await flooded.check();
    await expect(floodedFace).toHaveCSS(
      'background-color',
      await tokenColor(page, 'accent'),
    );
    await flooded.uncheck();
  }

  // It keeps the chips' hairline, so an error's danger edge shows on it
  // (the group marked invalid as FilterChips marks it with an error).
  await group.evaluate((node) => node.setAttribute('aria-invalid', 'true'));
  await expect(face).toHaveCSS(
    'border-top-color',
    forced ? await systemColor(page, 'Mark') : await tokenColor(page, 'danger'),
  );
  await group.evaluate((node) => node.removeAttribute('aria-invalid'));

  // Chosen, it is the accent like every chip.
  await chip.check();
  await expect(chip).toBeChecked();
  if (!forced) {
    await expect(face).toHaveCSS(
      'background-color',
      await tokenColor(page, 'accent'),
    );
    await expect(face).toHaveCSS('color', await tokenColor(page, 'onAccent'));
  }
  await chip.uncheck();

  if (forced) return;
  // Dark: the tint and ink move with the scheme and keep 4.5:1.
  await page.getByRole('radio', { name: 'Dark' }).first().check();
  await expect
    .poll(async () => face.evaluate((node) => getComputedStyle(node).color))
    .toBe(
      await computed(
        page,
        'color',
        'color-mix(in srgb, var(--sw-color-warning) 70%, var(--sw-color-text))',
      ),
    );
  const background = await face.evaluate(
    (node) => getComputedStyle(node).backgroundColor,
  );
  const words = await face.evaluate((node) => getComputedStyle(node).color);
  expect(colorContrast(words, background)).toBeGreaterThanOrEqual(4.5);
  await group.screenshot({
    path: testInfo.outputPath('warning-chip-dark.png'),
  });
});
