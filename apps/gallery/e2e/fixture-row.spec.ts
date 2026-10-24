import { expect, test, type Page } from '@playwright/test';

async function openSection(page: Page) {
  await page.goto('/#fixture-row');
  await expect(page.locator('#fixture-row')).toBeVisible();
}

const box = async (page: Page, selector: string, index: number) =>
  (await page.locator(selector).nth(index).boundingBox())!;

test('FixtureRow lines up its centres down a run and reads in order', async ({
  page,
}, testInfo) => {
  await openSection(page);
  const section = page.locator('#fixture-row');
  const list = section.getByRole('list', {
    name: 'Sunday 25 October · North meadow hides',
  });
  await expect(list.getByRole('listitem')).toHaveCount(3);
  // One grid: the centres share one column whatever the names.
  const centres = list.locator('.sw-fixture-center');
  const first = (await centres.nth(0).boundingBox())!;
  const third = (await centres.nth(2).boundingBox())!;
  expect(
    Math.abs(first.x + first.width / 2 - (third.x + third.width / 2)),
  ).toBeLessThanOrEqual(1);
  // The home name ends at the centre side, the away starts from it.
  const home = (await list
    .locator('.sw-fixture-team-home')
    .first()
    .boundingBox())!;
  const away = (await list
    .locator('.sw-fixture-team-away')
    .first()
    .boundingBox())!;
  expect(home.x + home.width).toBeLessThanOrEqual(first.x);
  expect(away.x).toBeGreaterThanOrEqual(first.x + first.width);
  // The link row is named in the consumer's words; the button by what it shows.
  await expect(
    list.getByRole('link', {
      name: 'Heron Marsh with Otter Pool, 8:00, Hide 1',
    }),
  ).toBeVisible();
  const button = list.getByRole('button', {
    name:
      testInfo.project.name === 'mobile-es'
        ? 'Pine Ridge 9:15 Bittern Fen'
        : 'Pine Ridge 9:15 Bittern Fen Hide 2',
  });
  await expect(button).toBeVisible();
  const row = (await button.boundingBox())!;
  expect(row.height).toBeGreaterThanOrEqual(44);
  await button.click();
  await expect(
    section.getByText('Last opened: Pine Ridge with Bittern Fen'),
  ).toBeVisible();
  // A plain press on the link row goes to onPress.
  await list.getByRole('link').click();
  await expect(
    section.getByText('Last opened: Heron Marsh with Otter Pool'),
  ).toBeVisible();
  await page.screenshot({
    path: testInfo.outputPath('fixture-row.png'),
    fullPage: false,
  });
});

test('FixtureRow moves its details under the sides on a phone', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openSection(page);
  const row = page.locator('#fixture-row .sw-fixture-item').nth(2);
  const end = (await row.locator('.sw-fixture-end').boundingBox())!;
  const home = (await row.locator('.sw-fixture-team-home').boundingBox())!;
  expect(end.y).toBeGreaterThanOrEqual(home.y + home.height - 1);
  // metaHideBelow="md" leaves the second row's hide out.
  await expect(
    page.locator('#fixture-row .sw-fixture-item').nth(1).getByText('Hide 2'),
  ).toBeHidden();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

test('FixtureRow mirrors its sides in right-to-left', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await openSection(page);
  await page.evaluate(() =>
    document.documentElement.setAttribute('dir', 'rtl'),
  );
  const home = await box(page, '#fixture-row .sw-fixture-team-home', 0);
  const away = await box(page, '#fixture-row .sw-fixture-team-away', 0);
  expect(home.x).toBeGreaterThan(away.x);
});
