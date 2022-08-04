import { BrowserRouter } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { AuthProvider } from '~features/auth'

import { AppRouter } from './AppRouter'

export const queryClient = new QueryClient()
export const App = (): JSX.Element => (
  <QueryClientProvider client={queryClient}>
    <ChakraProvider resetCSS>
      <BrowserRouter>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </BrowserRouter>
    </ChakraProvider>
  </QueryClientProvider>
)
