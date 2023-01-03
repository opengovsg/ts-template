import { api } from '~/api'

export const logout = async (): Promise<void> => {
  return api.url('/auth/logout').post().json()
}
