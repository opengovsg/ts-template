import { Navigate, NavigateProps, useLocation } from 'react-router-dom'

import { routes } from '~constants/routes'

import { useAuth } from '~features/auth'

interface PrivateElementProps {
  /**
   * Route to redirect to when user is not authenticated. Defaults to
   * `LOGIN_ROUTE` if not provided.
   */
  redirectTo?: NavigateProps['to']
  element: React.ReactElement
}

export const PrivateElement = ({
  element,
  redirectTo = routes.login,
}: PrivateElementProps): React.ReactElement => {
  const location = useLocation()

  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return element
  }

  return <Navigate replace to={redirectTo} state={{ from: location }} />
}
