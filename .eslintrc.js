module.exports = {
  extends: ['opengovsg/javascript'],
  ignorePatterns: ['coverage', 'build', 'jest.config.ts'],
  root: true,
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: ['opengovsg'],
      rules: {
        '@typescript-eslint/no-unsafe-assignment': 'warn',
        '@typescript-eslint/no-unsafe-member-access': 'warn',
        '@typescript-eslint/require-await': 'warn',
        '@typescript-eslint/no-unsafe-return': 'warn',
        '@typescript-eslint/no-unsafe-call': 'warn',
        '@typescript-eslint/no-floating-promises': 'warn',
        '@typescript-eslint/no-misused-promises': 'warn',
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
      },
    },
  ],
  rules: {
    // Rules for auto sort of imports
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // Side effect imports.
          ['^\\u0000'],
          // Packages.
          // Things that start with a letter (or digit or underscore), or
          // `@` followed by a letter.
          ['^@?\\w'],
          // Root imports
          // Shared imports should be separate from application imports.
          ['^(~shared)(/.*|$)'],
          ['^(~)(/.*|$)'],
          // Parent imports. Put `..` last.
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
          // Other relative imports. Put same-folder imports and `.` last.
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
        ],
      },
    ],
  },
}
