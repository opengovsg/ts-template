import { lazy, PropsWithChildren, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Box } from '@chakra-ui/react'

import { routes } from '~constants/routes'

const { AuthRoutes } = lazyImport(() => import('~features/auth'), 'AuthRoutes')

import { lazyImport } from '~utils/lazyImport'

import { PrivateElement } from './PrivateElement'

const WorkspacePage = lazy(() => import('~features/dashboard/DashboardPage'))
const HealthPage = lazy(() => import('~features/health/HealthPage'))

const router = createBrowserRouter([
  {
    path: routes.index,
    element: <PrivateElement element={<WorkspacePage />} />,
  },
  {
    path: routes.login,
    element: <AuthRoutes />,
  },
  {
    path: routes.health,
    element: <PrivateElement element={<HealthPage />} />,
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
