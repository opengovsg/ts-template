# Tooling

This document describes the tools that are in place in this project
to facilitate good practice during the development process

## Keeping Things Organised

## Folder Structure
Two separate TypeScript projects, `frontend/` and `backend/`, 
for frontend and backend respectively.

Structure within frontend/backend folder taken from \[1\]. Notably, 
we distinguish between `lib/` and `src/` directories, the latter for
files that we have to process (eg, transpile) into `build/` or `dist/`. 

## Linting
Done with ESLint, using the following rule configs:

- `eslint:recommended` 
- `plugin:prettier/recommended`

Prettier is further configured using the rules in `.prettierrc.js`.

VSCode users may have to add the following to their ESLint extension
settings for linting to work in both `frontend/` and `backend/`:

```json
    "eslint.workingDirectories": [
        "backend",
        "frontend"
    ],
```

### Additional rules
Developers are free to add more ESLint rules that bring their project
in-line with norms specific to their language or framework of choice,
eg. typescript or React.

## Conventional Commits
Commit messages follow [conventional commits](https://conventionalcommits.org/).
This is enforced by commitlint, when pushing to remote branch.

### Commitizen
[Commitizen](https://github.com/commitizen/cz-cli) has been installed as a 
convenience for writing conventional commit messages, via `npm run cz`.
This may be removed to minimise project dependencies.

## Commit Hooks
Husky is used in tandem with:

- lint-staged to ensure files are linted on commit
- commitlint to ensure commits adhere to convention on push

The pre-push hook will interfere on initial push since commitlint
uses the remote branch as the lower bound in the commit range to inspect,
and there would be no remote branch. Bypass this the first time with
`git push --no-verify`.

## Continuous Integration
GitHub Actions is commonly used in OGP. Config at `.github/workflows` 
have been provided for convenience, which will run the following:

- `ci.yml`
  - unit tests
  - linting
  - deploying to AWS Elastic Beanstalk, if on specific branches

- `codeql.yml` - static analysis

Builds will fail if any of these tasks fail.

## Miscellany

### Dependabot
`.github/dependabot.yml` is in place so that npm dependencies will be 
regularly updated. Mergify has been configured to automatically
merge non-major releases, configured via `.github/mergify.yml`

## References

\[1\]: https://gist.github.com/tracker1/59f2c13044315f88bee9
