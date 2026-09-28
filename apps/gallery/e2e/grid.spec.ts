import { expect, test } from '@playwright/test';

test('Grid renders equal-width columns, a two-to-one span, and fewer columns on a phone', async ({
  page,
}, testInfo) => {
  await page.goto('/#grid');
  const section = page.locator('#grid');
  const actions = section.getByRole('region', { name: 'Survey actions' });
  const columns = await actions.evaluate(
    (element) =>
      getComputedStyle(element).gridTemplateColumns.split(' ').length,
  );
  const isPhone = testInfo.project.name === 'mobile-es';
  expect(columns).toBe(isPhone ? 2 : 3);
  const buttons = actions.getByRole('button');
  await expect(buttons).toHaveCount(6);
  const first = await buttons.nth(0).boundingBox();
  const second = await buttons.nth(1).boundingBox();
  expect(first).not.toBeNull();
  expect(second).not.toBeNull();
  expect(Math.abs((first?.width ?? 0) - (second?.width ?? 0))).toBeLessThan(2);
  const totals = section.getByRole('region', { name: 'Season totals' });
  expect(
    await totals.evaluate(
      (element) =>
        getComputedStyle(element).gridTemplateColumns.split(' ').length,
    ),
  ).toBe(3);
  const entry = section.getByRole('region', { name: 'Sighting entry' });
  const form = await entry
    .getByRole('region', { name: 'Sighting form' })
    .boundingBox();
  const lookup = await entry
    .getByRole('region', { name: 'Habitat lookup' })
    .boundingBox();
  expect(form).not.toBeNull();
  expect(lookup).not.toBeNull();
  expect(
    await entry.evaluate(
      (element) =>
        getComputedStyle(element).gridTemplateColumns.split(' ').length,
    ),
  ).toBe(isPhone ? 1 : 3);
  if (isPhone) {
    // One column: the span is capped, so the lookup stacks under the form at
    // the same width instead of adding an implicit column.
    expect(Math.abs((form?.width ?? 0) - (lookup?.width ?? 0))).toBeLessThan(1);
    expect(lookup?.y ?? 0).toBeGreaterThan(
      (form?.y ?? 0) + (form?.height ?? 0),
    );
  } else {
    // Two of three columns: about twice the lookup, beside it on one row.
    const ratio = (form?.width ?? 0) / (lookup?.width ?? 1);
    expect(ratio).toBeGreaterThan(1.9);
    expect(ratio).toBeLessThan(2.2);
    expect(Math.abs((form?.y ?? 0) - (lookup?.y ?? 0))).toBeLessThan(1);
  }
  await section.screenshot({ path: testInfo.outputPath('grid.png') });
});

test('Grid align end keeps two inputs level when one label wraps', async ({
  page,
}, testInfo) => {
  await page.goto('/#grid');
  const survey = page.locator('#grid').getByRole('region', {
    name: 'Nest survey',
  });
  const height = survey.getByRole('textbox', {
    name: 'Nest height above the waterline',
  });
  const eggs = survey.getByRole('textbox', { name: 'Eggs' });
  const heightBox = await height.boundingBox();
  const eggsBox = await eggs.boundingBox();
  expect(heightBox && eggsBox).toBeTruthy();
  if (!heightBox || !eggsBox) return;
  expect(Math.abs(heightBox.y - eggsBox.y)).toBeLessThan(1);
  expect(Math.abs(heightBox.height - eggsBox.height)).toBeLessThan(1);
  if (testInfo.project.name === 'mobile-es') {
    const labelHeight = (name: string) =>
      survey
        .locator('label')
        .filter({ hasText: name })
        .evaluate((element) => element.getBoundingClientRect().height);
    expect(
      await labelHeight('Nest height above the waterline'),
    ).toBeGreaterThan(await labelHeight('Eggs'));
  }
  await survey.screenshot({ path: testInfo.outputPath('grid-align-end.png') });
});
