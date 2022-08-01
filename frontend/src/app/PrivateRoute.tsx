import { Navigate } from 'react-router-dom'

import { routes } from '~constants/routes'

import { useAuth } from '~features/auth'

export const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) return <Navigate to={routes.login} />
  return children
}
