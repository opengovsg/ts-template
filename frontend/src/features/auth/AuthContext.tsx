import { createContext, ReactNode, useCallback, useContext } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { WhoAmIResponseDto } from '~shared/types/auth.dto'

import { LOGGED_IN_KEY, useLocalStorage } from '~features/localStorage'

import * as AuthService from './AuthService'

type AuthContextProps = {
  isAuthenticated?: boolean
  user?: WhoAmIResponseDto
  isLoading: boolean
  sendLoginOtp: typeof AuthService.sendLoginOtp
  verifyLoginOtp: (params: { token: string; email: string }) => Promise<void>
  logout: typeof AuthService.logout
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

/**
 * Provider component that wraps your app and makes auth object available to any
 * child component that calls `useAuth()`.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useProvideAuth()

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

/**
 * Hook for components nested in ProvideAuth component to get the current auth object.
 */
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error(`useAuth must be used within a AuthProvider component`)
  }
  return context
}

// Provider hook that creates auth object and handles state
const useProvideAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage<boolean>(LOGGED_IN_KEY)
  const queryClient = useQueryClient()

  const { data: user, isLoading } = useQuery(
    ['currentUser'],
    () => AuthService.fetchUser(),
    // 10 minutes staletime, do not need to retrieve so often.
    { staleTime: 600000, enabled: !!isLoggedIn },
  )

  const verifyLoginOtp = useCallback(
    async (params: { token: string; email: string }) => {
      await AuthService.verifyLoginOtp(params)
      setIsLoggedIn(true)
    },
    [setIsLoggedIn],
  )

  const logout = useCallback(async () => {
    await AuthService.logout()
    if (isLoggedIn) {
      // Clear logged in state.
      setIsLoggedIn(undefined)
    }
    queryClient.clear()
  }, [isLoggedIn, queryClient, setIsLoggedIn])

  // Return the user object and auth methods
  return {
    isAuthenticated: isLoggedIn,
    user: isLoggedIn ? user : undefined,
    isLoading,
    sendLoginOtp: AuthService.sendLoginOtp,
    verifyLoginOtp: verifyLoginOtp,
    logout,
  }
}
