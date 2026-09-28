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

  const status = bar.getByRole('status');
  await expect(status).toHaveText('Not saved yet');
  await bar.getByRole('button', { name: 'Save survey' }).click();
  await expect(status).toHaveText('Survey saved at 5:00 PM');
  await expect(status).toBeVisible();

  const belowMd = section
    .getByTestId('action-bar-below-md')
    .locator('.sw-action-bar');
  const rest = await belowMd.evaluate(
    (element) => getComputedStyle(element).position,
  );
  expect(rest).toBe(
    testInfo.project.name === 'mobile-es' ? 'sticky' : 'static',
  );
  // With no status yet the live region is already there but takes no room.
  const nightStatus = belowMd.getByRole('status');
  await expect(nightStatus).toHaveText('');
  const empty = await nightStatus.boundingBox();
  expect(empty?.height).toBeLessThanOrEqual(1);
  await belowMd.getByRole('button', { name: 'Save count' }).click();
  await expect(nightStatus).toHaveText('Night count saved');
  await expect(nightStatus).toBeVisible();

  await survey.evaluate((element) => element.scrollIntoView({ block: 'end' }));
  const lastCard = await survey.locator('.sw-card').last().boundingBox();
  const resting = await bar.boundingBox();
  expect(lastCard && resting).toBeTruthy();
  if (!lastCard || !resting) return;
  expect(resting.y).toBeGreaterThanOrEqual(lastCard.y + lastCard.height);
  await section.screenshot({ path: testInfo.outputPath('action-bar.png') });
});

test('An open Select in an Accordion paints over the stuck ActionBar', async ({
  page,
}, testInfo) => {
  await page.goto('/#action-bar');
  const section = page.locator('#action-bar');
  const bar = section.getByRole('region', { name: 'Survey actions' });
  const trigger = section.getByRole('combobox', { name: 'Stop habitat' });
  await trigger.evaluate((element) =>
    element.scrollIntoView({ block: 'center' }),
  );
  await trigger.click();
  const last = section.getByRole('option', { name: 'Ocean' });
  await expect(last).toBeVisible();

  // Scroll the open list down until its last option sits across the stuck bar.
  const barCenter = await bar.evaluate((element) => {
    const box = element.getBoundingClientRect();
    return box.top + box.height / 2;
  });
  await last.evaluate((element, center) => {
    const box = element.getBoundingClientRect();
    window.scrollBy(0, box.top + box.height / 2 - center);
  }, barCenter);
  const option = await last.boundingBox();
  const stuck = await bar.boundingBox();
  expect(option && stuck).toBeTruthy();
  if (!option || !stuck) return;
  const optionCenter = option.y + option.height / 2;
  expect(optionCenter).toBeGreaterThan(stuck.y);
  expect(optionCenter).toBeLessThan(stuck.y + stuck.height);
  const onTop = await page.evaluate(
    ([x, y]) => document.elementFromPoint(x, y)?.textContent,
    [option.x + option.width / 2, optionCenter],
  );
  expect(onTop).toBe('Ocean');
  await page.screenshot({
    path: testInfo.outputPath('action-bar-under-open-select.png'),
  });

  // A plain click lands on whatever paints on top; with the bar over the list
  // it would land on the bar instead of the option.
  await last.click();
  await expect(trigger).toHaveText('Ocean');
  await expect(section.getByRole('listbox')).toHaveCount(0);
});
