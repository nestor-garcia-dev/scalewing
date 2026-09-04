import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { generateStylesheet } from '../dist/stylesheet.js';

const distDirectory = join(dirname(fileURLToPath(import.meta.url)), '../dist');

mkdirSync(distDirectory, { recursive: true });
writeFileSync(join(distDirectory, 'styles.css'), generateStylesheet(), 'utf8');
