import { PrivateElement } from '~/app/PrivateElement'

import { DashboardPage } from './DashboardPage'

export const DashboardRoutes = () => {
  return <PrivateElement element={<DashboardPage />} />
}
