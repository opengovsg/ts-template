import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

import { PrivateRoute } from '~/app/PrivateRoute'
import { PublicRoute } from '~/app/PublicRoute'
import { routes } from '~constants/routes'

const WorkspacePage = lazy(() => import('~features/dashboard/DashboardPage'))
const HealthPage = lazy(() => import('~features/health/HealthPage'))
const LoginPage = lazy(() => import('~features/auth/LoginPage'))

export const AppRouter = (): JSX.Element => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
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
