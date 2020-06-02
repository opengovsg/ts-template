# JavaScript Project Files Template for OGP

## Folder Structure
Mostly taken from \[1\]. Notably, we distinguish between
`lib/` and `src/` directories, the latter for files that we have 
to process (eg, transpile) into `build/` or `dist/`. 

## Linting
Done with ESLint, using the following rule configs:

- `eslint:recommended` 
- `plugin:prettier/recommended`

Prettier is further configured using the rules in `.prettierrc.js`.

### Additional rules
Developers are free to add more ESLint rules that bring their project
in-line with norms specific to their language or framework of choice,
eg. typescript or React.

## Conventional Commits
Commit messages follow [conventional commits](https://conventionalcommits.org/).
This is enforced by commitlint, when pushing to remote branch.

## Commit Hooks
Husky is used in tandem with:
  - lint-staged to ensure files are linted on commit
  - commitlint to ensure commits adhere to convention on push

The pre-push hook will interfere on initial push since commitlint
uses the remote branch as the lower bound in the commit range to inspect,
and there would be no remote branch. Bypass this the first time with the
`--no-verify` flag.

## Miscellany

### WhiteSource Renovate
A `renovate.json` file is in place so that for repositories where
Renovatebot is enabled, npm dependencies will be regularly updated.

### Gitpod
A `.gitpod.yml` has been configured to run `npm install` for 
Gitpod users creating workspaces from the repository.

## References

\[1\]: https://gist.github.com/tracker1/59f2c13044315f88bee9
