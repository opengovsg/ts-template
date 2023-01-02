import { ResponsiveValue } from '@chakra-ui/react'
import { RestrictedFooter } from '@opengovsg/design-system-react'

// TODO: Extend from RestrictedFooterProps instead when they are exported by the package in the future.
interface AppFooterProps {
  variant?: ResponsiveValue<'full' | 'compact'>
  colorMode?: 'light' | 'dark'
}

export const AppFooter = (props: AppFooterProps): JSX.Element => {
  return (
    <RestrictedFooter
      appLink={window.location.origin}
      appName="Starter Kit"
      containerProps={{
        px: 0,
        bg: 'transparent',
      }}
      {...props}
    />
  )
}
