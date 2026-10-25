import { createRequire } from 'node:module';

import { type Page } from '@playwright/test';

const require = createRequire(import.meta.url);

/** The part of axe-core's page API this check calls. */
type Axe = {
  run: (
    context: unknown,
    options: unknown,
  ) => Promise<{ violations: { id: string; nodes: unknown[] }[] }>;
};

/**
 * axe-core's WCAG 2 A and AA rules on the elements `selector` matches,
 * returned as the ids of the rules that fail (empty when it passes).
 */
export async function axeViolations(
  page: Page,
  selector: string,
): Promise<string[]> {
  await page.addScriptTag({ path: require.resolve('axe-core') });
  return page.evaluate(
    (include) =>
      (window as Window & { axe: Axe }).axe
        .run(
          { include: [[include]] },
          { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] } },
        )
        .then((result) => result.violations.map((violation) => violation.id)),
    selector,
  );
}
