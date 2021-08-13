import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { ChakraProvider, Button } from '@chakra-ui/react'

import { AuthProvider, useAuth } from './features/auth/AuthContext'
import { LoginPage } from './pages/login/LoginPage'
import { theme } from './theme'

const queryClient = new QueryClient()

function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <ChakraProvider theme={theme} resetCSS>
        <AuthProvider>
          <InnerApp />
        </AuthProvider>
      </ChakraProvider>
    </QueryClientProvider>
  )
}

export default App

export const InnerApp = () => {
  const { user, isLoading, logout } = useAuth()

  if (isLoading) {
    return <div>...Loading...</div>
  }

  if (!user) {
    return <LoginPage />
  }

  return (
    <div>
      Logged in: {JSON.stringify(user)}
      <Button onClick={logout}>Logout</Button>
    </div>
  )
}
