import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.project.name !== 'forced-colors') return;
  await page.emulateMedia({ forcedColors: 'active' });
});

test("Article contentLang marks the title and the body, the app's own words left in the page's language", async ({
  page,
}) => {
  await page.goto('/#article');
  const title = 'Cómo distinguir una garza de una garceta';
  const guide = page.getByRole('article', { name: title });
  await expect(guide).toBeVisible();
  await expect(guide).not.toHaveAttribute('lang');

  // Two marked parts: the heading and the body.
  const marked = guide.locator('[lang]');
  await expect(marked).toHaveCount(2);
  const heading = guide.getByRole('heading', { level: 3, name: title });
  await expect(heading).toHaveAttribute('lang', 'es');
  await expect(guide.locator('.sw-article-content')).toHaveAttribute(
    'lang',
    'es',
  );
  await expect(guide.locator('.sw-article-content :lang(es)')).toHaveCount(1);

  // The eyebrow and meta are the app's words, in the page's English.
  for (const part of ['.sw-article-eyebrow', '.sw-article-meta']) {
    await expect(guide.locator(`${part}:lang(es)`)).toHaveCount(0);
    await expect(guide.locator(`${part}:lang(en)`)).toHaveCount(1);
  }
  await expect(guide.locator('.sw-article-eyebrow')).toHaveText(
    'Field guide · Only in Spanish',
  );

  // Marking the language changes no layout: the title still sits between
  // the eyebrow and the meta line, the body under them.
  const [eyebrowBox, titleBox, metaBox, bodyBox] = await Promise.all([
    guide.locator('.sw-article-eyebrow').boundingBox(),
    heading.boundingBox(),
    guide.locator('.sw-article-meta').boundingBox(),
    guide.locator('.sw-article-content').boundingBox(),
  ]);
  expect(eyebrowBox && titleBox && metaBox && bodyBox).toBeTruthy();
  if (eyebrowBox && titleBox && metaBox && bodyBox) {
    expect(eyebrowBox.y + eyebrowBox.height).toBeLessThanOrEqual(titleBox.y);
    expect(titleBox.y + titleBox.height).toBeLessThanOrEqual(metaBox.y);
    expect(metaBox.y + metaBox.height).toBeLessThan(bodyBox.y);
  }

  // An article without contentLang carries no lang.
  await expect(
    page
      .getByRole('article', {
        name: 'The east trail is closed for nesting season',
      })
      .locator('[lang]'),
  ).toHaveCount(0);
});
