// Rebuild @scalewing/tokens then @scalewing/react on every token source
// change, so a linked consumer (see docs/CONSUMER_REQUESTS.md, "Linked
// development") picks up new CSS without a manual rebuild step.
//
// Component edits already hot-reload through the link with no build.
// Only token and CSS edits need this, because @scalewing/react/styles.css
// always resolves to dist/styles.css, never to source.

import { watch } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const tokensSourceDir = join(root, 'packages/tokens/src');
const DEBOUNCE_MS = 200;

let debounceTimer = null;
let isBuilding = false;

function rebuild() {
  if (isBuilding) {
    return;
  }
  isBuilding = true;
  console.log('[watch-tokens-css] rebuilding tokens then react...');

  const tokensBuild = spawnSync(
    'pnpm',
    ['--filter', '@scalewing/tokens', 'build'],
    {
      cwd: root,
      stdio: 'inherit',
    },
  );
  if (tokensBuild.status !== 0) {
    console.error('[watch-tokens-css] tokens build failed');
    isBuilding = false;
    return;
  }

  const reactBuild = spawnSync(
    'pnpm',
    ['--filter', '@scalewing/react', 'build'],
    {
      cwd: root,
      stdio: 'inherit',
    },
  );
  if (reactBuild.status !== 0) {
    console.error('[watch-tokens-css] react build failed');
  } else {
    console.log('[watch-tokens-css] done');
  }

  isBuilding = false;
}

function scheduleRebuild() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(rebuild, DEBOUNCE_MS);
}

console.log(`[watch-tokens-css] watching ${tokensSourceDir}`);
rebuild();
watch(tokensSourceDir, { recursive: true }, scheduleRebuild);
