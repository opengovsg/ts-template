# JavaScript Project Files Template for OGP

## Folder Structure
Mostly taken from [^1]. Notably, we distinguish between
`lib/` and `src/` directories, the latter for files that we have 
to process (eg, transpile) into `build/` or `dist/`. 

## Linting
Done with ESLint, using the following rule configs:

- `eslint:recommended` 
- `plugin:prettier/recommended`

Prettier is further configured using the rules in `.prettierrc.js`

## Commit Hooks
Husky is used in tandem with:
  - lint-staged to ensure files are linted on commit
  - commitlint to ensure commits follow the 
    [conventional commits](https://conventionalcommits.org/) 
    specification on push

## Miscellany

### WhiteSource Renovate
A `renovate.json` file is in place so that for repositories where
Renovatebot is enabled, npm dependencies will be regularly updated.

### Gitpod
A `.gitpod.yml` has been configured to run `npm install` for 
Gitpod users creating workspaces from the repository.

## References

[^1]: https://gist.github.com/tracker1/59f2c13044315f88bee9