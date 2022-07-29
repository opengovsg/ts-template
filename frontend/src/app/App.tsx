import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'

import { AppRouter } from './AppRouter'

import { AuthProvider } from '~features/auth'

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
