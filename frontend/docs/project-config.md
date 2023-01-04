# ⚙️ Project Configuration

The template has been bootstrapped using `Create React App`. To eject the app and customize the configuration, follow the [official documentation](https://create-react-app.dev/docs/available-scripts/#npm-run-eject).

The following tools are configured and used in this template:

#### ESLint

ESLint is a linting tool for JavaScript.
Specific configuration has been defined in [`.eslintrc.js`](../.eslintrc.js). The linter enforces consistency in the codebase and reduces bugs. It also helps to avoid common mistakes and enforce best practices.

[ESLint Configuration](../.eslintrc.js)

> 💡: If you are using VSCode, you can install the [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) for instant feedback on your code using the ESLint rules set in the configuration file.

#### Prettier

Prettier is a code formatting tool. Prettier takes care of your code formatting, ESLint takes care of your code style and quality.

[Prettier Configuration](../../.prettierrc.js)

> 💡: If you are using VSCode, you can install the [Prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) for instant feedback on your code using the Prettier rules set in the configuration file.

> You can also enable the "format on save" feature in your IDE to automatically format the code based on the configuration. It will also give you good feedback when something is wrong with the code. If the auto-format doesn't work, something is wrong with the code.

#### TypeScript

ESLint is great for catching some of the bugs related to the language, but since JavaScript is a dynamic language ESLint cannot check data that run through the applications, which can lead to bugs, especially on larger projects.

That is why TypeScript should be used. It is very useful during large refactors because it reports any issues you might miss otherwise.

When refactoring, change the type declaration first, then fix all the TypeScript errors throughout the project and you are done. One thing you should keep in mind is that TypeScript does not protect your application from failing during runtime, it only does type checking during build time, but it increases development confidence drastically anyways. Here is a [great resource on using TypeScript with React](https://react-typescript-cheatsheet.netlify.app/).

#### Husky

Husky is a tool for executing git hooks. Use Husky to run your code validations before every commit, thus making sure the code is in the best shape possible at any point of time and no faulty commits get into the repo. It can run linting, code formatting and type checking, etc. before it allows pushing the code. You can check how to configure it [here](https://typicode.github.io/husky/#/?id=usage).

This repository has a [pre-commit hook](../../.husky/pre-commit) that runs the linter and prettier before every commit. If there are any errors, the commit will fail and you will have to fix them before you can commit.

[Husky configuration](../../.husky)

#### Absolute imports

Absolute imports should always be configured and used because it makes it easier to move files around and avoid messy import paths such as `../../../Component`. Wherever you move the file, all the imports will remain intact.

This repository has absolute imports configured as follows:

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "~shared/*": ["../shared/src/*"],
      "~contexts/*": ["./src/contexts/*"],
      "~constants/*": ["./src/constants/*"],
      "~components/*": ["./src/components/*"],
      "~templates/*": ["./src/templates/*"],
      "~features/*": ["./src/features/*"],
      "~hooks/*": ["./src/hooks/*"],
      "~utils/*": ["./src/utils/*"],
      "~pages/*": ["./src/pages/*"],
      "~services/*": ["./src/services/*"],
      "~/*": ["./src/*"]
    }
  }
}
```

> 💡: There are also ESLint rules that rely on these paths. If you change the paths in the TypeScript config, make sure they are also changed in the [ESLint configuration](../.eslintrc.js#L25-L56).

In this project, the tsconfig file `tsconfig.paths.json` is used to configure the paths and merge it with the base configuration, because CRA overrides the `paths` key in the `tsconfig.json` file.

The `~` symbol is used as the base path for all the imports. Whenever possible, use the named paths such as `~components` instead of `~/component` as [ESLint has been set up](../.eslintrc.js#L25-L56) to automatically sort imports based on the path's perceived importance.

[Paths Configuration](../tsconfig.paths.json)

#### React App Rewired

[react-app-rewired](https://www.npmjs.com/package/react-app-rewired) is a tool that allows you to customize the configuration of the `Create React App` without having to eject the app.
It is used in this application to configure the absolute imports and the TypeScript paths.

[React App Rewired Configuration](../config-overrides.js)

#### Storybook

[Storybook](https://storybook.js.org/) is a tool for developing UI components in isolation. It is a great tool for developing and testing components in isolation without having to worry about the application's state and context. It also helps to document the components and their usage.

Contrary to popular belief where Storybook is used solely for components, you can also use it to render entire pages and features. APIs can also be mocked in Storybook using the [`msw-storybook-addon`](https://www.npmjs.com/package/msw-storybook-addon) package, amongst other addons which can be found [here](https://storybook.js.org/addons).

This repository has Storybook configured and you can run it using the following command:

```bash
npm run storybook
```

You can then access the Storybook UI at http://localhost:6006. There are some stories already written for the components in the application. You can add more stories for the components you create.
