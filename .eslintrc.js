module.exports = {
  extends: ['opengovsg/javascript'],
  ignorePatterns: ['coverage', 'build', 'node_modules', 'jest.config.ts'],
  root: true,
  overrides: [
    {
      files: ['*.ts'],
      extends: ['opengovsg'],
    },
    {
      files: ['*.tsx'],
      extends: ['opengovsg', 'opengovsg/react'],
    },
    {
      files: ['*.jsx'],
      extends: ['opengovsg/javascript', 'opengovsg/react'],
    },
  ],
}
