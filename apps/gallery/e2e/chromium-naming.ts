import { type Locator, type Page } from '@playwright/test';

/**
 * Chromium's own accessible name and description of the element `find`
 * (a script expression) returns in the page, read from its accessibility
 * tree, not Playwright's computation.
 */
export async function chromiumNaming(page: Page, find: string) {
  const cdp = await page.context().newCDPSession(page);
  try {
    const { result } = await cdp.send('Runtime.evaluate', {
      expression: find,
    });
    if (!result.objectId) throw new Error(`${find} found nothing`);
    const { nodes } = await cdp.send('Accessibility.getPartialAXTree', {
      fetchRelatives: false,
      objectId: result.objectId,
    });
    return {
      description: String(nodes[0]?.description?.value ?? ''),
      name: String(nodes[0]?.name?.value ?? ''),
    };
  } finally {
    await cdp.detach();
  }
}

/** Chromium's own accessible name of the element a locator finds. */
export async function chromiumName(
  page: Page,
  element: Locator,
): Promise<string> {
  await element.evaluate((node) => {
    (window as unknown as { swNamingProbe?: Element }).swNamingProbe = node;
  });
  try {
    return (await chromiumNaming(page, 'window.swNamingProbe')).name;
  } finally {
    await page.evaluate(() => {
      delete (window as unknown as { swNamingProbe?: Element }).swNamingProbe;
    });
  }
}
