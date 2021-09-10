import { BrowserRouter } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'

import { AuthProvider } from '~features/auth'

import { AppRouter } from './AppRouter'

export const App = (): JSX.Element => (
  <ChakraProvider resetCSS>
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  </ChakraProvider>
)
