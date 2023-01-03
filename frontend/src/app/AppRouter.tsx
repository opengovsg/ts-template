import { PropsWithChildren, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Box } from '@chakra-ui/react'

import { routes } from '~constants/routes'
import { lazyImport } from '~utils/lazyImport'

const { AuthRoutes } = lazyImport(() => import('~features/auth'), 'AuthRoutes')
const { DashboardRoutes } = lazyImport(
  () => import('~features/dashboard'),
  'DashboardRoutes',
)
const { HealthRoutes } = lazyImport(
  () => import('~features/health'),
  'HealthRoutes',
)

const router = createBrowserRouter([
  {
    path: routes.index,
    element: <DashboardRoutes />,
  },
  {
    path: routes.login,
    element: <AuthRoutes />,
  },
  {
    path: routes.health,
    element: <HealthRoutes />,
  },
  {
    path: '*',
    element: <div>404</div>,
  },
])

const WithSuspense = ({ children }: PropsWithChildren) => (
  <Suspense fallback={<Box bg="neutral.100" minH="$100vh" w="100vw" />}>
    {children}
  </Suspense>
)

export const AppRouter = (): JSX.Element => {
  return (
    <WithSuspense>
      <RouterProvider router={router} />
    </WithSuspense>
  )
}
