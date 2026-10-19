import { expect, test, type Locator, type Page } from '@playwright/test';

import { systemColor, tokenColor } from './contrast.js';

test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.project.name !== 'forced-colors') return;
  await page.emulateMedia({ forcedColors: 'active' });
});

const pdf = {
  name: 'heron-calls.pdf',
  mimeType: 'application/pdf',
  buffer: Buffer.from('%PDF-1.7\n'),
};

/** Drops a file on a target as a browser does: dragenter, dragover, drop. */
async function dropFile(page: Page, target: Locator, name: string) {
  const dataTransfer = await page.evaluateHandle((fileName) => {
    const transfer = new DataTransfer();
    transfer.items.add(new File(['%PDF-1.7'], fileName));
    return transfer;
  }, name);
  await target.dispatchEvent('dragenter', { dataTransfer });
  await target.dispatchEvent('dragover', { dataTransfer });
  return dataTransfer;
}

test('FileField chooses a file with the picker, shows it and chooses another', async ({
  page,
}, testInfo) => {
  await page.goto('/#file-field');
  const section = page.locator('#file-field');
  const zone = section.getByRole('button', {
    name:
      testInfo.project.name === 'mobile-es'
        ? 'Field guide Choose a PDF'
        : 'Field guide Choose a PDF or drop it here',
  });
  await expect(zone).toHaveAccessibleDescription('A PDF up to 2 MB');
  const box = await zone.boundingBox();
  expect(box?.height).toBeGreaterThanOrEqual(44);
  // On a coarse pointer nothing is dragged, so the drop words are hidden.
  await expect(section.locator('.sw-file-field-drop')).toBeVisible({
    visible: testInfo.project.name !== 'mobile-es',
  });

  const chooser = page.waitForEvent('filechooser');
  await zone.click();
  await (await chooser).setFiles(pdf);
  const change = section.getByRole('button', {
    name: 'Field guide Choose another',
  });
  await expect(change).toBeFocused();
  await expect(change).toHaveAccessibleDescription(
    'heron-calls.pdf 9 B · ready A PDF up to 2 MB',
  );

  // The consumer refuses a file that is not a PDF; the field says why.
  const again = page.waitForEvent('filechooser');
  await change.click();
  await (
    await again
  ).setFiles({ ...pdf, name: 'nest.jpg', mimeType: 'image/jpeg' });
  const error = section.getByText(
    'nest.jpg isn’t a PDF. Choose a PDF field guide.',
  );
  await expect(error).toBeVisible();
  await expect(zone).toBeFocused();
  await expect(zone).toHaveAccessibleDescription(
    'nest.jpg isn’t a PDF. Choose a PDF field guide.',
  );
  const frame = section.locator('.sw-file-field-frame').first();
  await expect(frame).toHaveCSS(
    'border-top-color',
    testInfo.project.name === 'forced-colors'
      ? await systemColor(page, 'Mark')
      : await tokenColor(page, 'danger'),
  );
  // Nothing scrolls the page sideways.
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    ),
  ).toBeLessThanOrEqual(0);
  await section.screenshot({ path: testInfo.outputPath('file-field.png') });
});

test('FileField takes a dropped file and draws the drag', async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name === 'mobile-es',
    'nothing is dragged on touch',
  );
  await page.goto('/#file-field');
  const section = page.locator('#file-field');
  const frame = section.locator('.sw-file-field-frame').first();
  const dataTransfer = await dropFile(page, frame, 'owl-pellets.pdf');
  await expect(frame).toHaveClass(/sw-file-field-dragging/);
  if (testInfo.project.name !== 'forced-colors')
    await expect(frame).toHaveCSS(
      'background-color',
      await tokenColor(page, 'accentSubtle'),
    );
  else
    await expect(frame).toHaveCSS(
      'border-top-color',
      await systemColor(page, 'Highlight'),
    );
  // Every word on the tint is in the text colour, for 4.5:1 (forced
  // colours draw system colours instead).
  if (testInfo.project.name !== 'forced-colors')
    for (const words of ['.sw-file-field-choose', '.sw-file-field-drop'])
      await expect(frame.locator(words)).toHaveCSS(
        'color',
        await tokenColor(page, 'text'),
      );
  await frame.dispatchEvent('drop', { dataTransfer });
  await expect(section.getByText('owl-pellets.pdf')).toBeVisible();
  await expect(frame).not.toHaveClass(/sw-file-field-dragging/);
  // A drop from elsewhere moves no focus.
  await expect(
    section.getByRole('button', { name: 'Field guide Choose another' }),
  ).not.toBeFocused();

  // A drop that replaces the focused button keeps focus in the field.
  const map = section.getByRole('button', {
    name: 'Field guide Choose another',
  });
  await map.focus();
  const second = await dropFile(page, frame, 'nest.jpg');
  await frame.dispatchEvent('drop', { dataTransfer: second });
  await expect(
    section.getByRole('button', { name: /^Field guide Choose a PDF/ }),
  ).toBeFocused();
});

test('FileField shows a chosen file, an error and a disabled field, light and dark', async ({
  page,
}, testInfo) => {
  await page.goto('/#file-field');
  const section = page.locator('#file-field');
  const map = section.getByRole('button', {
    name: 'Heron survey map Choose another',
  });
  await expect(map).toHaveAccessibleDescription(
    'wetland-survey-map-north-marsh-2026.pdf 4 pages · 1.6 MB · opens fine',
  );
  // The long name wraps inside the row; the button stays whole at its end.
  const [row, button] = await Promise.all([
    section.locator('.sw-file-field-chosen').boundingBox(),
    map.boundingBox(),
  ]);
  expect(row && button).toBeTruthy();
  if (row && button)
    // The frame's 1 px hairline and its space-2 end padding.
    expect(row.x + row.width - (button.x + button.width)).toBeCloseTo(9, 0);

  await expect(
    section.getByRole('button', { name: 'Nest photo Choose a photo' }),
  ).toHaveAccessibleDescription(
    'nest.heic isn’t a JPEG or PNG. Choose a JPEG or PNG photo.',
  );
  const season = section.getByRole('button', {
    name: 'Migration report Choose a PDF',
  });
  await expect(season).toBeDisabled();
  await expect(section.locator('.sw-file-field-disabled')).toHaveCSS(
    'border-top-style',
    'dashed',
  );
  // A file dropped on the disabled field is refused: the browser keeps it.
  const refused = await section
    .locator('.sw-file-field-disabled')
    .evaluate((frame) => {
      const transfer = new DataTransfer();
      transfer.items.add(new File(['%PDF-1.7'], 'report.pdf'));
      const send = (type: string) =>
        frame.dispatchEvent(
          new DragEvent(type, {
            bubbles: true,
            cancelable: true,
            dataTransfer: transfer,
          }),
        );
      send('dragenter');
      const over = send('dragover');
      const drop = send('drop');
      return {
        over,
        drop,
        tinted: frame.classList.contains('sw-file-field-dragging'),
      };
    });
  expect(refused).toEqual({ over: false, drop: false, tinted: false });

  if (testInfo.project.name === 'forced-colors') return;
  // An element screenshot drops Chromium's coarse-pointer emulation, so the
  // phone screenshots show the drop words the field hides on a phone (the
  // first test asserts that before any screenshot).
  for (const scheme of ['Light', 'Dark']) {
    await page.getByRole('radio', { name: scheme }).first().check();
    const choose = section.locator('.sw-file-field-choose').first();
    await expect
      .poll(() => choose.evaluate((node) => getComputedStyle(node).color))
      .toBe(await tokenColor(page, 'text'));
    await section.screenshot({
      path: testInfo.outputPath(`file-field-${scheme}.png`),
    });
  }
});

test('FileField is one Tab stop, and Enter presses the zone, clicking its input', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === 'mobile-es', 'keyboard');
  await page.goto('/#file-field');
  const section = page.locator('#file-field');
  const zone = section.getByRole('button', { name: /^Field guide Choose/ });
  await zone.focus();
  await expect(zone).toHaveCSS('outline-style', 'solid');
  await page.keyboard.press('Tab');
  await expect(
    section.getByRole('button', { name: 'Heron survey map Choose another' }),
  ).toBeFocused();
  await zone.focus();
  await expect(zone).toBeFocused();
  // Enter presses the zone, which clicks the hidden input. The click is
  // noted and its picker held back here, a workaround for a wait on the
  // browser's file chooser that once timed out under load (cause not
  // found); the pointer test above answers a real chooser.
  const input = section.locator('input[type="file"]').first();
  await input.evaluate((node) =>
    node.addEventListener(
      'click',
      (event) => {
        event.preventDefault();
        node.setAttribute('data-clicked', 'yes');
      },
      { once: true },
    ),
  );
  await page.keyboard.press('Enter');
  await expect(input).toHaveAttribute('data-clicked', 'yes');
  // The file comes back to the zone that still has focus.
  await input.setInputFiles(pdf);
  await expect(
    section.getByRole('button', { name: 'Field guide Choose another' }),
  ).toBeFocused();
});
