import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Flex, Spinner } from '@chakra-ui/react'

import { PrivateRoute } from '~/app/PrivateRoute'
import { PublicRoute } from '~/app/PublicRoute'

import { routes } from '~constants/routes'

import { LoginPage } from '~features/auth/LoginPage'

const WorkspacePage = lazy(() => import('~features/dashboard/DashboardPage'))
const HealthPage = lazy(() => import('~features/health/HealthPage'))

export const AppRouter = (): JSX.Element => {
  return (
    <Suspense
      fallback={
        <Flex w="full" h="full" justify="center" align="center">
          <Spinner />
        </Flex>
      }
    >
      <Routes>
        <Route
          path={routes.index}
          element={
            <PrivateRoute>
              <WorkspacePage />
            </PrivateRoute>
          }
        ></Route>
        <Route
          path={routes.login}
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path={routes.health}
          element={
            <PrivateRoute>
              <HealthPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </Suspense>
  )
}
