import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const manifest = JSON.parse(
  readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), '../package.json'),
    'utf8',
  ),
) as {
  files: string[];
  publishConfig: {
    access: string;
    exports: {
      '.': { types: string; import: string };
      './styles.css': string;
    };
  };
};

describe('publish manifest', () => {
  it('points npm consumers at compiled dist, not TypeScript source', () => {
    expect(manifest.files).not.toContain('src');
    expect(manifest.publishConfig.access).toBe('public');
    expect(manifest.publishConfig.exports['.']).toEqual({
      types: './dist/index.d.ts',
      import: './dist/index.js',
    });
    expect(manifest.publishConfig.exports['./styles.css']).toBe(
      './dist/styles.css',
    );
  });
});
