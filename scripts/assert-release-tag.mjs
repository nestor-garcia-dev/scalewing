import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const packageDirectories = [
  'packages/tokens',
  'packages/react',
  'packages/react-native',
];

function versionFromTag(tag) {
  if (!tag) {
    throw new Error(
      'RELEASE_TAG (or legacy CI_COMMIT_TAG) is required for publish.',
    );
  }

  const version = tag.startsWith('v') ? tag.slice(1) : tag;

  if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version)) {
    throw new Error(`Release tag ${tag} is not a package version.`);
  }

  return version;
}

function readPackageVersion(directory) {
  const manifest = JSON.parse(
    readFileSync(join(root, directory, 'package.json'), 'utf8'),
  );

  return { name: manifest.name, version: manifest.version };
}

const releaseTag = process.env.RELEASE_TAG ?? process.env.CI_COMMIT_TAG ?? '';
if (
  process.env.RELEASE_TAG &&
  process.env.CI_COMMIT_TAG &&
  process.env.RELEASE_TAG !== process.env.CI_COMMIT_TAG
) {
  throw new Error('RELEASE_TAG and CI_COMMIT_TAG disagree.');
}
const expectedVersion = versionFromTag(releaseTag);

for (const directory of packageDirectories) {
  const pkg = readPackageVersion(directory);

  if (pkg.version !== expectedVersion) {
    throw new Error(
      `${pkg.name} is ${pkg.version}, but the release tag is ${releaseTag}.`,
    );
  }
}
