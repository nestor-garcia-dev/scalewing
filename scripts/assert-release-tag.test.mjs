import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { URL, fileURLToPath } from 'node:url';
import process from 'node:process';
import { test } from 'node:test';

const version = JSON.parse(
  readFileSync(
    new URL('../packages/tokens/package.json', import.meta.url),
    'utf8',
  ),
).version;

function validate(environment) {
  const env = { ...process.env };
  delete env.RELEASE_TAG;
  delete env.CI_COMMIT_TAG;
  return spawnSync(
    process.execPath,
    [fileURLToPath(new URL('./assert-release-tag.mjs', import.meta.url))],
    { env: { ...env, ...environment }, encoding: 'utf8' },
  );
}

test('accepts a matching release tag in GitHub and legacy GitLab', () => {
  assert.equal(validate({ RELEASE_TAG: `v${version}` }).status, 0);
  assert.equal(validate({ CI_COMMIT_TAG: `v${version}` }).status, 0);
});

test('rejects missing, malformed, and mismatched release tags', () => {
  for (const environment of [
    {},
    { RELEASE_TAG: 'main' },
    { RELEASE_TAG: 'v99999.0.0' },
    { RELEASE_TAG: 'v1.2.3; echo unsafe' },
  ]) {
    assert.notEqual(validate(environment).status, 0);
  }
});

test('rejects conflicting release contexts', () => {
  const result = validate({
    RELEASE_TAG: `v${version}`,
    CI_COMMIT_TAG: 'v99999.0.0',
  });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /disagree/);
});
