import { StorybookTheme } from './themes'
import { ChakraProvider } from '@chakra-ui/react'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  docs: {
    theme: StorybookTheme.docs,
    inlineStories: true,
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

export const decorators = [
  (storyFn) => <ChakraProvider>{storyFn()}</ChakraProvider>,
]
