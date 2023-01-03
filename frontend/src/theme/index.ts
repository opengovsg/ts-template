import { extendTheme } from '@chakra-ui/react'
// Importing from main so @chakra-cli can work properly without complaining about ESM.
import { theme as baseTheme } from '@opengovsg/design-system-react/build/main/theme/theme'

import { components } from './components'

/**
 * Design system themes can be found at
 * https://github.com/opengovsg/design-system/tree/main/token-gen/themes.
 * README for importing themes can be found at
 * https://github.com/opengovsg/design-system/tree/main/token-gen.
 */
export const theme = extendTheme(baseTheme, {
  components,
})
