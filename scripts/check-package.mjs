import { spawnSync } from 'node:child_process';
import process from 'node:process';

import { checkCommands } from './package-checks.mjs';

for (const [command, ...args] of checkCommands(process.argv[2])) {
  console.log(`$ ${[command, ...args].join(' ')}`);
  const result = spawnSync(command, args, { stdio: 'inherit' });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
