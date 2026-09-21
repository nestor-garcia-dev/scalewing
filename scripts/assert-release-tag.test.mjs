import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { URL, fileURLToPath } from 'node:url';
import process from 'node:process';
import { test } from 'node:test';

import { releasePackages } from './release-tag.mjs';

function versionOf(directory) {
  return JSON.parse(
    readFileSync(
      new URL(`../${directory}/package.json`, import.meta.url),
      'utf8',
    ),
  ).version;
}

function validate(environment) {
  const env = { ...process.env };
  delete env.RELEASE_TAG;
  return spawnSync(
    process.execPath,
    [fileURLToPath(new URL('./assert-release-tag.mjs', import.meta.url))],
    { env: { ...env, ...environment }, encoding: 'utf8' },
  );
}

test('accepts each package tag that matches its own manifest version', () => {
  for (const [key, { directory }] of Object.entries(releasePackages)) {
    const tag = `${key}-v${versionOf(directory)}`;
    assert.equal(validate({ RELEASE_TAG: tag }).status, 0, tag);
  }
});

test('rejects missing, malformed, legacy, unknown, and mismatched tags', () => {
  const version = versionOf(releasePackages.tokens.directory);

  for (const environment of [
    {},
    { RELEASE_TAG: 'main' },
    { RELEASE_TAG: `v${version}` },
    { RELEASE_TAG: `gallery-v${version}` },
    { RELEASE_TAG: 'tokens-v99999.0.0' },
    { RELEASE_TAG: 'react-v1.2.3; echo unsafe' },
    { RELEASE_TAG: `tokens-v${version}-` },
  ]) {
    assert.notEqual(
      validate(environment).status,
      0,
      JSON.stringify(environment),
    );
  }
});
