# 🗄️ Project Structure

> 📝: Some folders may be missing from the project structure as there the template does not include all the features. The structure is meant to be a guide and not a strict rule.

Most of the code lives in the `src` folder and looks like this:

```sh
├── src/
│   ├── assets/       # assets folder can contain all the static files such as images, fonts, etc.
│   ├── components/   # shared components used across the entire application
│   ├── config/       # all the global configuration, env variables etc. get exported from here and used in the app
│   ├── constants/    # shared constants used across the entire application
│   ├── features/     # feature based modules
│   ├── hooks/        # shared hooks used across the entire application
│   ├── lib/          # re-exporting different libraries preconfigured for the application
│   ├── providers/    # all of the application providers
│   ├── routes/       # routes configuration
│   ├── stores/       # global state stores
│   ├── test/         # test utilities and mock server
│   ├── types/        # base types used across the application
│   ├── utils/        # shared utility functions
```

In order to scale the application in the easiest and most maintainable way, keep most of the code inside the `features` folder, which should contain different feature-based modules. Every `feature` folder should contain domain specific code for a given feature. This will allow you to keep functionalities scoped to a feature and not mix its declarations with shared modules. This is much easier to maintain than a flat folder structure with many files.

A feature could have the following structure:

```sh
├── src/features/awesome-feature/
│   ├── api/          # exported API request declarations and api hooks related to a specific feature
│   ├── assets/       # assets folder can contain all the static files for a specific feature
│   ├── components/   # components scoped to a specific feature
│   ├── hooks/        # hooks scoped to a specific feature
│   ├── routes/       # route components for a specific feature pages
│   ├── stores/       # state stores for a specific feature
│   ├── types/        # typescript types for TS specific feature domain
│   ├── utils/        # utility functions for a specific feature
│   ├── constants.ts  # constants scoped to a specific feature
│   ├── index.ts      # entry point for the feature, it should serve as the public API of the given feature and exports everything that should be used outside the feature
```

Everything from a feature should be exported from the `index.ts` file which behaves as the public API of the feature.

You should import stuff from other features only by using:

`import { AwesomeComponent } from "~features/awesome-feature"`

and not

`import { AwesomeComponent } from "~features/awesome-feature/components/AwesomeComponent`

> 📝: If you want to be extra-strict, this can also be configured in the ESLint configuration to disallow the later import by the following rule:

```js
{
  rules: {
    'no-restricted-imports': [
      'error',
        {
          patterns: ['~features/*/*'],
        },
      ],
  }
  // ...rest of the configuration
}
```

This was inspired by how [NX](https://nx.dev/) handles libraries that are isolated but available to be used by the other modules. Think of a feature as a library or a module that is self-contained but can expose different parts to other features via its entry point.
