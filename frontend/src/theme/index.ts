import { extendTheme } from '@chakra-ui/react'
import { theme as baseTheme } from '@opengovsg/design-system-react'

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
