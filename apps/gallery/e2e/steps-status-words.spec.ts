import { expect, test } from '@playwright/test';

import { chromiumName } from './chromium-naming.js';

test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.project.name !== 'forced-colors') return;
  await page.emulateMedia({ forcedColors: 'active' });
});

test("Steps reads a folded step's title and status word with no stray space, the title drawn as before", async ({
  page,
}) => {
  await page.goto('/#steps');
  const statuses = page.getByRole('list', { name: 'Every status' });
  for (const [title, name] of [
    ['Done', 'Done, Done'],
    ['Upcoming', 'Upcoming, Not started'],
  ] as const) {
    const heading = statuses.getByRole('heading', { name, exact: true });
    await expect(heading).toHaveAccessibleName(name);
    expect(await chromiumName(page, heading)).toBe(name);
    // One line, as drawn: the spoken line is a hidden 1 px box.
    const spoken = heading.locator('.sw-sr-only');
    await expect(spoken).toHaveText(name);
    const box = await spoken.boundingBox();
    expect(box?.width).toBe(1);
    expect(box?.height).toBe(1);
    const drawn = heading.locator('[aria-hidden="true"]');
    await expect(drawn).toBeVisible();
    await expect(drawn).toHaveText(title);
  }

  // A step that becomes done reads its word too; Edit keeps the title.
  const survey = page.getByRole('list', { name: 'Heron survey' });
  await survey.getByRole('button', { name: 'Continue' }).click();
  const site = survey.getByRole('heading', {
    name: 'The site, Done',
    exact: true,
  });
  expect(await chromiumName(page, site)).toBe('The site, Done');
  const edit = survey.getByRole('button', { name: 'Edit The site' });
  await expect(edit).toBeVisible();
  expect(await chromiumName(page, edit)).toBe('Edit The site');

  // An open list: the region is named by the title alone, and a step
  // greyed out by a block reads its word.
  const open = page.getByRole('list', {
    name: 'Wader count, every step open',
  });
  const region = open.getByRole('region', { name: 'The site' });
  await expect(region).toBeVisible();
  expect(await chromiumName(page, region)).toBe('The site');
  await open.getByRole('textbox', { name: 'Site' }).fill('Flooded');
  const greyed = open.getByRole('heading', {
    name: 'The count, Not started',
    exact: true,
  });
  await expect(greyed).toBeVisible();
  expect(await chromiumName(page, greyed)).toBe('The count, Not started');
  await expect(open.getByRole('region', { name: 'The count' })).toBeVisible();

  // The current step has no status word and draws its title as it is.
  const count = survey.getByRole('heading', { name: 'The count', exact: true });
  await expect(count.locator('.sw-sr-only')).toHaveCount(0);
  expect(await chromiumName(page, count)).toBe('The count');
});
