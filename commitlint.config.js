module.exports = {
  extends: ['@commitlint/config-conventional'],
  ignores: [(message) => /^Bumps \[(.+)\]\((.+)\)(.*).$/m.test(message)],
  rules: {
    'scope-case': [2, 'always', ['pascal-case', 'lower-case', 'camel-case']],
  },
}
