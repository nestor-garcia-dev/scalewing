import assert from 'node:assert/strict';
import { test } from 'node:test';

import { checkCommands } from './package-checks.mjs';
import { parseReleaseTag } from './release-tag.mjs';
import { assertTokensAvailable } from './tokens-availability.mjs';

test('parses one package and version from a release tag', () => {
  assert.deepEqual(parseReleaseTag('react-native-v1.2.3'), {
    key: 'react-native',
    version: '1.2.3',
    name: '@scalewing/react-native',
    directory: 'packages/react-native',
  });
  assert.equal(parseReleaseTag('react-v1.0.0-rc.1').version, '1.0.0-rc.1');
  assert.equal(parseReleaseTag('tokens-v0.0.1').key, 'tokens');
});

test('rejects tags that do not name exactly one public package', () => {
  for (const tag of [
    '',
    undefined,
    'v1.0.0',
    'react-native-1.0.0',
    'ui-v1.0.0',
  ]) {
    assert.throws(() => parseReleaseTag(tag), /must be tokens-v/);
  }
});

test('scopes checks to a package, its dependencies, and its dependents', () => {
  const filters = (key) =>
    checkCommands(key)
      .filter((command) => command.includes('--filter'))
      .map((command) => command[command.indexOf('--filter') + 1]);

  assert.deepEqual(
    new Set(filters('tokens')),
    new Set(['...@scalewing/tokens...']),
  );
  assert.deepEqual(
    new Set(filters('react')),
    new Set(['...@scalewing/react...']),
  );
  assert.throws(() => checkCommands('gallery'), /Unknown package/);
});

test('requires the tokens version on npm before a renderer release', () => {
  assert.doesNotThrow(() => assertTokensAvailable('1.0.0', () => '1.0.0\n'));
  assert.throws(
    () => assertTokensAvailable('1.0.0', () => ''),
    /Release tokens first/,
  );
  assert.throws(
    () =>
      assertTokensAvailable('1.0.0', () => {
        throw new Error('E404');
      }),
    /Release tokens first/,
  );
});
