import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.project.name !== 'forced-colors') return;
  await page.emulateMedia({ forcedColors: 'active' });
});

const photo = {
  name: 'heron-reeds-at-dawn-on-the-north-marsh-boardwalk.png',
  mimeType: 'image/png',
  buffer: Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAMAAAACCAIAAAASFvFNAAAAEklEQVR4nGNgYGD4z8DAwMAAAAwAAX9/wOcAAAAASUVORK5CYII=',
    'base64',
  ),
};

test('FileField compact: a photo on one row at a text field’s height, with its own Remove', async ({
  page,
}, testInfo) => {
  await page.goto('/#file-field');
  const row = page.locator('#file-field-compact');
  const title = row.getByRole('textbox', { name: 'Guide title' });
  const zone = row.getByRole('button', { name: 'Guide cover Choose a photo' });
  await expect(zone).toBeVisible();

  // Empty, the field is a text field's height.
  const [titleBox, emptyBox] = await Promise.all([
    title.boundingBox(),
    zone.boundingBox(),
  ]);
  expect(titleBox && emptyBox).toBeTruthy();
  if (titleBox && emptyBox)
    expect(Math.abs(emptyBox.height - titleBox.height)).toBeLessThanOrEqual(2);

  const chooser = page.waitForEvent('filechooser');
  await zone.click();
  await (await chooser).setFiles(photo);

  const change = row.getByRole('button', {
    name: 'Guide cover Choose another',
  });
  await expect(change).toHaveAccessibleDescription(
    /^heron-reeds-at-dawn-on-the-north-marsh-boardwalk\.png \d+ B$/,
  );
  const remove = row.getByRole('button', { name: 'Remove Guide cover' });
  await expect(remove).toBeVisible();

  // One row: the frame keeps the text field's height, the thumbnail, the
  // cut name and Remove side by side, inside the frame.
  const frame = row.locator('.sw-file-field-frame');
  const thumbnail = change.locator('img.sw-file-field-preview');
  const name = change.locator('.sw-file-field-name');
  const [frameBox, thumbBox, nameBox, removeBox, fieldBox] = await Promise.all([
    frame.boundingBox(),
    thumbnail.boundingBox(),
    name.boundingBox(),
    remove.boundingBox(),
    title.boundingBox(),
  ]);
  expect(frameBox && thumbBox && nameBox && removeBox && fieldBox).toBeTruthy();
  if (!frameBox || !thumbBox || !nameBox || !removeBox || !fieldBox) return;
  expect(Math.abs(frameBox.height - fieldBox.height)).toBeLessThanOrEqual(2);
  expect(thumbBox.x + thumbBox.width).toBeLessThan(nameBox.x);
  expect(nameBox.x + nameBox.width).toBeLessThanOrEqual(removeBox.x);
  expect(removeBox.x + removeBox.width).toBeLessThanOrEqual(
    frameBox.x + frameBox.width,
  );
  for (const box of [thumbBox, nameBox, removeBox]) {
    const middle = box.y + box.height / 2;
    expect(
      Math.abs(middle - (frameBox.y + frameBox.height / 2)),
    ).toBeLessThanOrEqual(1);
  }
  const cut = await name.evaluate(
    (node) => node.scrollWidth > node.clientWidth,
  );
  expect(cut).toBe(true);
  // Beside the title from md up; under it on a phone.
  if (testInfo.project.name === 'mobile-es')
    expect(frameBox.y).toBeGreaterThan(fieldBox.y + fieldBox.height);
  else expect(Math.abs(frameBox.y - fieldBox.y)).toBeLessThanOrEqual(1);

  // Chromium's tree: the row's button named by the label and the change
  // words, Remove named with the label.
  await expect(frame).toMatchAriaSnapshot(`
    - button "Guide cover Choose another"
    - button "Remove Guide cover"
  `);

  await row.screenshot({ path: testInfo.outputPath('file-field-compact.png') });

  // Remove empties the field and leaves focus on its choose button.
  await remove.focus();
  await page.keyboard.press('Enter');
  await expect(zone).toBeFocused();
  await expect(remove).toHaveCount(0);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

test('FileField compact disabled: the row and its Remove are off and faded alike', async ({
  page,
}, testInfo) => {
  await page.goto('/#file-field');
  const row = page.locator('#file-field-compact-off');
  const pick = row.getByRole('button', {
    name: 'Archived guide cover Choose another',
  });
  const remove = row.getByRole('button', {
    name: 'Remove Archived guide cover',
  });
  await expect(pick).toBeDisabled();
  await expect(remove).toBeDisabled();
  if (testInfo.project.name !== 'forced-colors') {
    const opacities = await Promise.all(
      [pick, remove].map((button) =>
        button.evaluate((node) => getComputedStyle(node).opacity),
      ),
    );
    expect(opacities[0]).toBe(opacities[1]);
    expect(Number(opacities[0])).toBeLessThan(1);
  }
  // Without a thumbnail the name starts where the title's words do.
  const [nameBox, frameBox, titleBox] = await Promise.all([
    pick.locator('.sw-file-field-name').boundingBox(),
    row.locator('.sw-file-field-frame').boundingBox(),
    row.getByRole('textbox', { name: 'Archived guide title' }).boundingBox(),
  ]);
  const titleStart = await row
    .getByRole('textbox', { name: 'Archived guide title' })
    .evaluate((node) => parseFloat(getComputedStyle(node).paddingLeft));
  expect(nameBox && frameBox && titleBox).toBeTruthy();
  if (nameBox && frameBox)
    expect(
      Math.abs(nameBox.x - frameBox.x - 1 - titleStart),
    ).toBeLessThanOrEqual(2);
  await row.screenshot({
    path: testInfo.outputPath('file-field-compact-off.png'),
  });
});
