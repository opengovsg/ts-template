import { useMediaQuery, UseMediaQueryOptions, useTheme } from '@chakra-ui/react'
import { get } from '@chakra-ui/utils'

export const useIsDesktop = (opts?: UseMediaQueryOptions): boolean => {
  const theme = useTheme()
  const lgBreakpoint = String(get(theme, 'breakpoints.lg', '64em'))
  const [isAtLeastLg] = useMediaQuery(`(min-width: ${lgBreakpoint})`, opts)

  return isAtLeastLg
}
