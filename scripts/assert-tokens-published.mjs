import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import { parseReleaseTag, releasePackages } from './release-tag.mjs';
import { assertTokensAvailable } from './tokens-availability.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const release = parseReleaseTag(process.env.RELEASE_TAG ?? '');

if (release.key === 'tokens') {
  console.log('Tokens release: no upstream package to check.');
} else {
  const { version } = JSON.parse(
    readFileSync(
      join(root, releasePackages.tokens.directory, 'package.json'),
      'utf8',
    ),
  );

  assertTokensAvailable(version, (spec) =>
    execFileSync('npm', ['view', spec, 'version'], { encoding: 'utf8' }),
  );
  console.log(`@scalewing/tokens@${version} is on npm.`);
}
