import 'inter-ui/inter.css'
import '@fontsource/ibm-plex-mono'

import { ThemeProvider } from '@opengovsg/design-system-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { theme } from '~/theme'
import { AuthProvider } from '~lib/auth'

import { AppRouter } from './AppRouter'

export const queryClient = new QueryClient()

export const App = (): JSX.Element => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme} resetCSS>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
)
