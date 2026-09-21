export const releasePackages = {
  tokens: { name: '@scalewing/tokens', directory: 'packages/tokens' },
  react: { name: '@scalewing/react', directory: 'packages/react' },
  'react-native': {
    name: '@scalewing/react-native',
    directory: 'packages/react-native',
  },
};

const tagPattern =
  /^(tokens|react-native|react)-v(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)$/;

export function parseReleaseTag(tag) {
  const match = tagPattern.exec(tag ?? '');

  if (!match) {
    throw new Error(
      `Release tag ${tag || '(missing)'} must be tokens-vX.Y.Z, react-vX.Y.Z, or react-native-vX.Y.Z.`,
    );
  }

  const [, key, version] = match;

  return { key, version, ...releasePackages[key] };
}
