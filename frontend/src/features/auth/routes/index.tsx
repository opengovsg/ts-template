import { PublicElement } from '~/app/PublicElement'

import { LoginPage } from './LoginPage'

export const AuthRoutes = () => {
  return <PublicElement strict element={<LoginPage />} />
}
