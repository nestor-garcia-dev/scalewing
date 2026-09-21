import { releasePackages } from './release-tag.mjs';

const filteredScripts = ['test', 'build', 'typecheck'];

export function checkCommands(key) {
  const release = releasePackages[key];

  if (!release) {
    throw new Error(
      `Unknown package ${key}. Use ${Object.keys(releasePackages).join(', ')}.`,
    );
  }

  return [
    ['pnpm', 'format:check'],
    ['pnpm', 'lint'],
    ['node', '--test', 'scripts/assert-release-tag.test.mjs'],
    ['node', '--test', 'scripts/release-tooling.test.mjs'],
    ...filteredScripts.map((script) => [
      'pnpm',
      '--workspace-concurrency=1',
      '--filter',
      `...${release.name}...`,
      '--if-present',
      'run',
      script,
    ]),
  ];
}
