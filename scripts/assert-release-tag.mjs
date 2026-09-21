import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import { parseReleaseTag } from './release-tag.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const releaseTag = process.env.RELEASE_TAG ?? '';
const release = parseReleaseTag(releaseTag);
const manifest = JSON.parse(
  readFileSync(join(root, release.directory, 'package.json'), 'utf8'),
);

if (manifest.name !== release.name) {
  throw new Error(
    `${release.directory} is ${manifest.name}, not ${release.name}.`,
  );
}

if (manifest.version !== release.version) {
  throw new Error(
    `${manifest.name} is ${manifest.version}, but the release tag is ${releaseTag}.`,
  );
}
