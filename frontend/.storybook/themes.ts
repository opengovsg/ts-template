import { create } from '@storybook/theming'

import PackageInfo from '../package.json'

export const StorybookTheme = {
  manager: create({
    base: 'light',
    brandTitle: `ts-template v${PackageInfo.version}`,
    // UI
    appBg: '#f6f7fc', // primary.100,
    appBorderColor: '#DADCE3',
    appBorderRadius: 0,
    // Typography
    fontBase: '"Inter", san-serif',
    // Text colours
    textColor: '#445072', // secondary.500,
    textInverseColor: '#445072', // secondary.500,
    colorPrimary: '#4A61C0', // primary.500,
    colorSecondary: '#4A61C0', // primary.500,

    // Toolbar default and active colors
    barTextColor: '#445072', // secondary.500,,
    barSelectedColor: '#4A61C0', // primary.500,
  }),
  docs: create({
    base: 'light',
    fontBase: '"Inter", san-serif',
  }),
}
