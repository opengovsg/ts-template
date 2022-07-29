module.exports = {
  plugins: [
    '@typescript-eslint',
    'import',
    'simple-import-sort',
    'react',
    'react-hooks',
  ],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: [
    'build',
    'tsconfig.json',
    '.eslintrc.js',
    'config-overrides.js',
  ],
  env: { es6: true },
  root: true,
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'no-console': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'warn',
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
    'react/react-in-jsx-scope': 'off',
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
          ['^(shared)(/.*|$)'],
          ['^(typings)(/.*|$)'],
          [
            '^(app)(/.*|$)',
            '^(assets|theme)(/.*|$)',
            '^(contexts)(/.*|$)',
            '^(constants)(/.*|$)',
            '^(hooks)(/.*|$)',
            '^(utils)(/.*|$)',
            '^(services)(/.*|$)',
            '^(components)(/.*|$)',
            '^(types)(/.*|$)',
            '^(templates)(/.*|$)',
          ],
          ['^(pages)(/.*|$)', '^(features)(/.*|$)'],
          // Parent imports. Put `..` last.
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
          // Other relative imports. Put same-folder imports and `.` last.
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
        ],
      },
    ],
    'simple-import-sort/exports': 'error',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'import/no-extraneous-dependencies': 'error',
  },
}
