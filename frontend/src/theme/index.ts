import { extendTheme } from '@chakra-ui/react'

import { components } from './components'

/**
 * Design system themes can be found at
 * https://github.com/opengovsg/design-system/tree/main/token-gen/themes.
 */
export const theme = extendTheme({
  global: {
    body: {
      fontFeatureSettings: "'tnum' on, 'cv05' on",
      WebkitFontSmoothing: 'antialiased',
    },
  },
  components,
})
