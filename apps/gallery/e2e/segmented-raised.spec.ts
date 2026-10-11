import { expect, test } from '@playwright/test';

import { textContrast, tokenColor } from './contrast.js';

test('SegmentedControl raised: a grey track, a raised white selection, words in the text color', async ({
  page,
}, testInfo) => {
  await page.goto('/#segmented-control');
  const forced = testInfo.project.name === 'forced-colors';
  if (forced) await page.emulateMedia({ forcedColors: 'active' });
  const track = page.getByRole('radiogroup', {
    name: 'Count order',
    exact: true,
  });
  const largest = track.getByRole('radio', { name: 'Largest first' });
  const tens = track.getByRole('radio', { name: 'Tens only' });
  await expect(largest).toHaveAttribute('aria-checked', 'true');

  // Sized to its segments, not stretched across the Stack.
  const trackBox = (await track.boundingBox())!;
  const tensBox = (await tens.boundingBox())!;
  expect(
    trackBox.x + trackBox.width - (tensBox.x + tensBox.width),
  ).toBeLessThanOrEqual(4);
  const stackWidth = await track.evaluate(
    (node) => node.parentElement!.parentElement!.getBoundingClientRect().width,
  );
  expect(trackBox.width).toBeLessThan(stackWidth - 40);

  // The md control height, every segment.
  expect(Math.round((await tens.boundingBox())!.height)).toBeGreaterThanOrEqual(
    44,
  );

  if (forced) {
    await expect(largest).toHaveCSS('outline-style', 'solid');
  } else {
    const grey = await track.evaluate((node) => {
      const span = document.createElement('span');
      span.style.backgroundColor =
        'color-mix(in srgb, var(--sw-color-muted) 16%, transparent)';
      node.parentElement!.append(span);
      const color = getComputedStyle(span).backgroundColor;
      span.remove();
      return color;
    });
    await expect(track).toHaveCSS('background-color', grey);
    await expect(largest).toHaveCSS(
      'background-color',
      await tokenColor(page, 'surface'),
    );
    await expect(largest).not.toHaveCSS('box-shadow', 'none');
    const text = await tokenColor(page, 'text');
    await expect(tens).toHaveCSS('color', text);
    expect(await textContrast(tens)).toBeGreaterThanOrEqual(4.5);
  }

  // Still one exclusive choice: arrows move it.
  await largest.focus();
  await page.keyboard.press('ArrowRight');
  await expect(tens).toHaveAttribute('aria-checked', 'true');

  // With marks, the raised look holds.
  const marked = page.getByRole('radiogroup', { name: 'Survey, raised' });
  await expect(marked).toHaveClass(/sw-segmented-raised/);
  await expect(marked.getByRole('radio', { name: 'Forest' })).toHaveAttribute(
    'aria-checked',
    'true',
  );
});

test('SegmentedControl raised keeps the error outline and the disabled state', async ({
  page,
}, testInfo) => {
  await page.goto('/#segmented-control');
  const forced = testInfo.project.name === 'forced-colors';
  if (forced) await page.emulateMedia({ forcedColors: 'active' });
  const invalid = page.getByRole('radiogroup', {
    name: 'Count order to retake',
  });
  await expect(invalid).toHaveAttribute('aria-invalid', 'true');
  const expected = await invalid.evaluate(
    (node, keyword) => {
      const probe = document.createElement('span');
      probe.style.color = keyword;
      node.append(probe);
      const color = getComputedStyle(probe).color;
      probe.remove();
      return color;
    },
    forced ? 'Mark' : 'var(--sw-color-danger)',
  );
  await expect(invalid).toHaveCSS('border-top-color', expected);
  await expect(invalid).toHaveCSS('border-top-width', '1px');
  const closed = page.getByRole('radiogroup', { name: 'Closed count order' });
  await expect(closed).toHaveClass(/sw-segmented-disabled/);
  await expect(closed.getByRole('radio', { name: 'Tens only' })).toBeDisabled();
});

test('SegmentedControl raised rings the selected segment in the dark scheme', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === 'forced-colors');
  await page.goto('/#segmented-control');
  await page.getByRole('radio', { name: 'Dark' }).check();
  const selected = page
    .getByRole('radiogroup', { name: 'Count order', exact: true })
    .getByRole('radio', { name: 'Largest first' });
  const muted = await tokenColor(page, 'muted');
  await expect(selected).toHaveCSS(
    'box-shadow',
    `${muted} 0px 0px 0px 1px inset`,
  );
});
