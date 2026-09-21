// Node cannot run @scalewing/tokens' TypeScript source entry, so the CSS build
// resolves it to the compiled dist that `pnpm build` produces first.
import { register } from 'node:module';

register('./tokens-dist-loader.mjs', import.meta.url);
