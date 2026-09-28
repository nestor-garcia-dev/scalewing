import { expect, test } from '@playwright/test';

test('ActionBar sticks to the viewport bottom while its content scrolls by', async ({
  page,
}, testInfo) => {
  await page.goto('/#action-bar');
  const section = page.locator('#action-bar');
  const survey = section.getByTestId('action-bar-survey');
  const bar = section.getByRole('region', { name: 'Survey actions' });
  const viewport = page.viewportSize();
  expect(viewport).toBeTruthy();
  if (!viewport) return;

  await survey.locator('.sw-card').first().scrollIntoViewIfNeeded();
  await survey.evaluate((element) => {
    window.scrollBy(0, element.getBoundingClientRect().top - 80);
  });
  const surveyBox = await survey.boundingBox();
  expect(surveyBox && surveyBox.y + surveyBox.height).toBeGreaterThan(
    viewport.height,
  );
  const stuck = await bar.boundingBox();
  expect(stuck).toBeTruthy();
  if (!stuck) return;
  const gap = viewport.height - (stuck.y + stuck.height);
  expect(gap).toBeGreaterThanOrEqual(4);
  expect(gap).toBeLessThanOrEqual(12);
  await expect(bar.getByText('Not saved yet')).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('action-bar-stuck.png') });

  await bar.getByRole('button', { name: 'Save survey' }).click();
  await expect(bar.getByText('Survey saved at 5:00 PM')).toBeVisible();

  const rest = await section
    .getByTestId('action-bar-below-md')
    .locator('.sw-action-bar')
    .evaluate((element) => getComputedStyle(element).position);
  expect(rest).toBe(
    testInfo.project.name === 'mobile-es' ? 'sticky' : 'static',
  );

  await survey.evaluate((element) => element.scrollIntoView({ block: 'end' }));
  const lastCard = await survey.locator('.sw-card').last().boundingBox();
  const resting = await bar.boundingBox();
  expect(lastCard && resting).toBeTruthy();
  if (!lastCard || !resting) return;
  expect(resting.y).toBeGreaterThanOrEqual(lastCard.y + lastCard.height);
  await section.screenshot({ path: testInfo.outputPath('action-bar.png') });
});
