module.exports = {
  features: {
    emotionAlias: false,
    storyStoreV7: true,
    previewMdx2: true,
  },
  stories: [
    './introduction/Welcome/Welcome.stories.tsx',
    '../src/**/*.stories.@(js|jsx|ts|tsx|mdx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/preset-create-react-app',
  ],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5',
    disableTelemetry: true,
  },
  refs: {
    '@chakra-ui/react': {
      disable: true,
    },
  },
}
