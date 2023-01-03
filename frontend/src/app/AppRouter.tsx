import { lazy, PropsWithChildren, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Box } from '@chakra-ui/react'

import { routes } from '~constants/routes'

import { LoginPage } from '~features/auth/LoginPage'

import { PrivateElement } from './PrivateElement'
import { PublicElement } from './PublicElement'

const WorkspacePage = lazy(() => import('~features/dashboard/DashboardPage'))
const HealthPage = lazy(() => import('~features/health/HealthPage'))

const router = createBrowserRouter([
  {
    path: routes.index,
    element: <PrivateElement element={<WorkspacePage />} />,
  },
  {
    path: routes.login,
    element: <PublicElement strict element={<LoginPage />} />,
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
