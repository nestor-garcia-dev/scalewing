import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  generatePaletteStylesheet,
  generateStylesheet,
  paletteStylesheetIds,
} from '../dist/css/stylesheet.js';

const distDirectory = join(dirname(fileURLToPath(import.meta.url)), '../dist');
const paletteDirectory = join(distDirectory, 'palette');

mkdirSync(distDirectory, { recursive: true });
writeFileSync(join(distDirectory, 'styles.css'), generateStylesheet(), 'utf8');

mkdirSync(paletteDirectory, { recursive: true });

for (const id of paletteStylesheetIds()) {
  writeFileSync(
    join(paletteDirectory, `${id}.css`),
    generatePaletteStylesheet(id),
    'utf8',
  );
}
