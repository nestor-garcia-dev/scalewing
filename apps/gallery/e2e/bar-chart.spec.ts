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
