import { PrivateElement } from '~/app/PrivateElement'

import { HealthPage } from './HealthPage'

export const HealthRoutes = () => {
  return <PrivateElement element={<HealthPage />} />
}
