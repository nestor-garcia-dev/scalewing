import eslint from '@eslint/js';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

const tokensForbidden = {
  paths: [
    {
      name: 'react',
      message: 'Tokens must stay framework-free.',
    },
    {
      name: 'react-dom',
      message: 'Tokens must stay framework-free.',
    },
    {
      name: 'react-native',
      message: 'Tokens must stay framework-free.',
    },
    {
      name: '@scalewing/react',
      message: 'Tokens must not import renderers.',
    },
    {
      name: '@scalewing/react-native',
      message: 'Tokens must not import renderers.',
    },
  ],
  patterns: [
    {
      group: [
        'react/*',
        'react-dom/*',
        'react-native/*',
        'expo',
        'expo/*',
        '@scalewing/react/*',
        '@scalewing/react-native/*',
      ],
      message: 'Tokens must stay framework-free.',
    },
  ],
};

const reactForbidden = {
  paths: [
    {
      name: 'react-native',
      message: '@scalewing/react is DOM-only.',
    },
    {
      name: '@scalewing/react-native',
      message: '@scalewing/react is DOM-only.',
    },
  ],
  patterns: [
    {
      group: ['react-native/*', 'expo', 'expo/*', '@expo/*'],
      message: '@scalewing/react is DOM-only.',
    },
  ],
};

const nativeForbidden = {
  paths: [
    {
      name: 'react-dom',
      message: '@scalewing/react-native is native-only.',
    },
    {
      name: '@scalewing/react',
      message: '@scalewing/react-native is native-only.',
    },
  ],
  patterns: [
    {
      group: ['react-dom/*', '@scalewing/react/*'],
      message: '@scalewing/react-native is native-only.',
    },
  ],
};

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/.expo/**',
      '**/.pnpm-store/**',
      '**/coverage/**',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['packages/tokens/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', tokensForbidden],
    },
  },
  {
    files: ['packages/react/**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...reactHooks.configs.flat.recommended.rules,
      'no-restricted-imports': ['error', reactForbidden],
    },
  },
  {
    files: ['packages/react-native/**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.flat.recommended.rules,
      'no-restricted-imports': ['error', nativeForbidden],
    },
  },
  {
    files: ['apps/gallery/**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...reactHooks.configs.flat.recommended.rules,
      'no-restricted-imports': ['error', reactForbidden],
    },
  },
  {
    files: ['apps/native-example/**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.flat.recommended.rules,
      'no-restricted-imports': ['error', nativeForbidden],
    },
  },
);
