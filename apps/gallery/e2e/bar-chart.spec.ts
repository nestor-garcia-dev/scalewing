import { expect, test } from '@playwright/test';

test('A diverging BarChart grows negative bars left of a centre zero and reads its axis with formatValue', async ({
  page,
}, testInfo) => {
  const forced = testInfo.project.name === 'forced-colors';
  if (forced) await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/#bar-chart');
  const plot = page.getByRole('list', { name: 'Change in sightings' });
  await plot.scrollIntoViewIfNeeded();
  const chart = plot.locator('..');

  // The axis reads from minus the peak through zero to the peak.
  await expect(chart.locator('.sw-bar-chart-axis-track > span')).toHaveText([
    '−9',
    '0',
    '+9',
  ]);
  await expect(plot.getByText('−4', { exact: true })).toBeVisible();

  const bar = (label: string) =>
    plot
      .getByRole('listitem')
      .filter({ hasText: label })
      .evaluate((row) => {
        const track = row.querySelector('.sw-bar-chart-track')!;
        const fill = row.querySelector('.sw-bar-chart-fill')!;
        const trackBox = track.getBoundingClientRect();
        const fillBox = fill.getBoundingClientRect();
        return {
          centre: trackBox.left + track.clientLeft + track.clientWidth / 2,
          half: track.clientWidth / 2,
          left: fillBox.left,
          right: fillBox.right,
        };
      });
  const skylark = await bar('Skylark');
  const fox = await bar('Red fox');
  // The peak's bar fills its half up to zero; a positive bar starts at zero.
  expect(Math.abs(skylark.right - skylark.centre)).toBeLessThanOrEqual(1);
  expect(
    Math.abs(skylark.centre - skylark.left - skylark.half),
  ).toBeLessThanOrEqual(1);
  expect(Math.abs(fox.left - fox.centre)).toBeLessThanOrEqual(1);
  expect(
    Math.abs(fox.right - fox.left - (fox.half * 6) / 9),
  ).toBeLessThanOrEqual(1);

  // The magnitude chart above keeps its bars from the start.
  const traits = page.getByRole('list', { name: 'Trait contributions' });
  const traitFill = await traits
    .locator('.sw-bar-chart-fill-negative')
    .first()
    .evaluate((fill) => {
      const track = fill.parentElement!.getBoundingClientRect();
      return Math.abs(fill.getBoundingClientRect().left - track.left);
    });
  expect(traitFill).toBeLessThanOrEqual(2);
  await chart.screenshot({ path: testInfo.outputPath('bar-chart.png') });
});

test('A BarChart item tone colors its bar by meaning: a diverging overage in warning and a shortage in danger', async ({
  page,
}, testInfo) => {
  const forced = testInfo.project.name === 'forced-colors';
  if (forced) await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/#bar-chart');
  const plot = page.getByRole('list', { name: 'Feed against plan' });
  await plot.scrollIntoViewIfNeeded();
  const chart = plot.locator('..');
  await expect(chart.locator('.sw-bar-chart-axis-track > span')).toHaveText([
    '−4 kg',
    '0 kg',
    '+4 kg',
  ]);

  const paint = (label: string) =>
    plot
      .getByRole('listitem')
      .filter({ hasText: label })
      .evaluate((row) => {
        const track = row.querySelector('.sw-bar-chart-track')!;
        const fill = row.querySelector('.sw-bar-chart-fill')!;
        // The token the tone names, resolved the way the page paints it.
        const probe = (token: string) => {
          const swatch = document.createElement('span');
          swatch.style.background = `var(--sw-color-${token})`;
          track.append(swatch);
          const color = getComputedStyle(swatch).backgroundColor;
          swatch.remove();
          return color;
        };
        const centre = track.getBoundingClientRect();
        const box = fill.getBoundingClientRect();
        return {
          className: fill.className,
          fill: getComputedStyle(fill).backgroundColor,
          track: getComputedStyle(track).backgroundColor,
          warning: probe('warning'),
          danger: probe('danger'),
          startsAtCentre:
            Math.abs(box.left - (centre.left + centre.width / 2)) <= 1.5,
          endsAtCentre:
            Math.abs(box.right - (centre.left + centre.width / 2)) <= 1.5,
        };
      });
  const over = await paint('Otter pool');
  const short = await paint('Owl barn');
  expect(over.className).toBe('sw-bar-chart-fill sw-bar-chart-fill-warning');
  expect(short.className).toBe(
    'sw-bar-chart-fill sw-bar-chart-fill-negative sw-bar-chart-fill-danger',
  );
  // The tone keeps the sign's geometry: over runs right of zero, short left.
  expect(over.startsAtCentre).toBe(true);
  expect(short.endsAtCentre).toBe(true);
  if (forced) {
    // Forced colors draw every fill in the system text color on the track.
    expect(over.fill).toBe(short.fill);
    expect(over.fill).not.toBe(over.track);
  } else {
    expect(over.fill).toBe(over.warning);
    expect(short.fill).toBe(short.danger);
    expect(over.fill).not.toBe(short.fill);
  }

  // An untoned chart is unchanged: its negative bar is still danger.
  const sightings = page.getByRole('list', { name: 'Change in sightings' });
  const untoned = await sightings
    .getByRole('listitem')
    .filter({ hasText: 'Skylark' })
    .locator('.sw-bar-chart-fill')
    .evaluate((fill) => ({
      className: fill.className,
      fill: getComputedStyle(fill).backgroundColor,
    }));
  expect(untoned.className).toBe(
    'sw-bar-chart-fill sw-bar-chart-fill-negative',
  );
  if (!forced) expect(untoned.fill).toBe(short.danger);
  await chart.screenshot({ path: testInfo.outputPath('bar-chart-tone.png') });
});
