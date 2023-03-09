module.exports = {
  extends: ['opengovsg/javascript'],
  ignorePatterns: ['coverage', 'build', 'node_modules', 'jest.config.ts'],
  root: true,
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: ['opengovsg'],
      rules: {
        '@typescript-eslint/no-unused-vars': [
          'error',
          { ignoreRestSiblings: true },
        ],
      },
    },
  ],
}
