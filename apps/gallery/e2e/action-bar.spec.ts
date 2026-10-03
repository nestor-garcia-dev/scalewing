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
  // A Badge and a short line share the status row, a space-2 gap apart.
  await bar.getByRole('button', { name: 'Submit sightings' }).click();
  const submitted = status.locator('.sw-badge');
  const line = status.getByText('11 stops · 14 sightings');
  await expect(submitted).toHaveText('Submitted');
  expect(await status.evaluate((element) => element.tagName)).toBe('DIV');
  const badgeBox = await submitted.boundingBox();
  const lineBox = await line.boundingBox();
  expect(badgeBox && lineBox).toBeTruthy();
  if (!badgeBox || !lineBox) return;
  expect(
    Math.abs(
      badgeBox.y + badgeBox.height / 2 - (lineBox.y + lineBox.height / 2),
    ),
  ).toBeLessThan(1);
  expect(lineBox.x - (badgeBox.x + badgeBox.width)).toBeCloseTo(8, 0);

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
  await expect(nightStatus).toContainText('Night count · 6 bat passes');
  await expect(nightStatus).toBeVisible();
  // On a phone the line does not fit beside the badge and wraps under it;
  // nothing runs past the bar.
  const savedBadge = await nightStatus.locator('.sw-badge').boundingBox();
  const nightLine = await nightStatus.locator('span').last().boundingBox();
  expect(savedBadge && nightLine).toBeTruthy();
  if (!savedBadge || !nightLine) return;
  if (testInfo.project.name === 'mobile-es') {
    expect(nightLine.y).toBeGreaterThanOrEqual(
      savedBadge.y + savedBadge.height,
    );
    expect(Math.abs(nightLine.x - savedBadge.x)).toBeLessThan(1);
  } else {
    expect(nightLine.x).toBeGreaterThan(savedBadge.x + savedBadge.width);
  }
  expect(
    await nightStatus.evaluate(
      (element) => element.scrollWidth <= element.clientWidth,
    ),
  ).toBe(true);

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
