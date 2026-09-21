export function assertTokensAvailable(version, view) {
  let published;

  try {
    published = view(`@scalewing/tokens@${version}`);
  } catch {
    published = '';
  }

  if (published.trim() !== version) {
    throw new Error(
      `@scalewing/tokens@${version} is not on npm. Release tokens first.`,
    );
  }
}
