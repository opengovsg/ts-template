import { api } from '~lib/api'

export const logout = async (): Promise<void> => {
  return api.url('/auth/logout').post().json()
}
