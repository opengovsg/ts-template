import { Navigate } from 'react-router-dom'

import { routes } from '~constants/routes'

import { useAuth } from '~features/auth'

export const PrivateRoute = ({ children }: { children: JSX.Element }): JSX.Element => {
  const authContext = useAuth()
  const isAuthenticated: boolean = authContext.isAuthenticated ?? false

  if (!isAuthenticated) return <Navigate to={routes.login} />
  return children
}
