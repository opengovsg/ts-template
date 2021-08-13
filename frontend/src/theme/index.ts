import { extendTheme } from '@chakra-ui/react'

import { components } from './components'
import { colours } from './foundations/colours'
import { textStyles } from './textStyles'

export const theme = extendTheme({
  colors: colours,
  textStyles,
  components,
})
