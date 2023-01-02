module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  ignorePatterns: [
    '.eslintrc.js',
    'jest.config.js',
    'jest.config.ts',
    'jest-dotenv.config.js',
    'coverage',
    'build',
    'node_modules',
    'scripts/**/*.mjs',
    'commitlint.config.js',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'simple-import-sort'],
  root: true,
  rules: {
    'no-console': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', ignoreRestSiblings: true },
    ],
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'none',
          requireLast: true,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
      },
    ],
    // Rules for auto sort of imports
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // Side effect imports.
          ['^\\u0000'],
          // Packages.
          // Packages. `react` related packages come first.
          // Things that start with a letter (or digit or underscore), or
          // `@` followed by a letter.
          ['^react', '^@?\\w'],
          // Root imports
          // Shared imports should be separate from application imports.
          ['^(~shared)(/.*|$)'],
          ['^(~)(/.*|$)'],
          [
            '^(~assets)(/.*|$)',
            '^(~contexts)(/.*|$)',
            '^(~constants)(/.*|$)',
            '^(~hooks)(/.*|$)',
            '^(~utils)(/.*|$)',
            '^(~services)(/.*|$)',
            '^(~components)(/.*|$)',
            '^(~templates)(/.*|$)',
          ],
          ['^(~pages)(/.*|$)', '^(~features)(/.*|$)'],
          // Parent imports. Put `..` last.
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
          // Other relative imports. Put same-folder imports and `.` last.
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
        ],
      },
    ],
    'simple-import-sort/exports': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'warn',
    '@typescript-eslint/no-unsafe-member-access': 'warn',
    '@typescript-eslint/require-await': 'warn',
    '@typescript-eslint/no-unsafe-return': 'warn',
    '@typescript-eslint/no-unsafe-call': 'warn',
    '@typescript-eslint/no-floating-promises': 'warn',
    '@typescript-eslint/no-misused-promises': 'warn',
  },
}
