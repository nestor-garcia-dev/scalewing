import { URL } from 'node:url';

const tokensDist = new URL('../../tokens/dist/index.js', import.meta.url).href;

export function resolve(specifier, context, nextResolve) {
  if (specifier === '@scalewing/tokens') {
    return { url: tokensDist, shortCircuit: true };
  }

  return nextResolve(specifier, context);
}
