import { api } from '~lib/api'
import type { WhoAmIResponseDto } from '~shared/types/auth.dto'

/**
 * Fetches the user from the server using the current session cookie.
 *
 * @returns the logged in user if session is valid, will throw 401 error if not.
 */
export const fetchUser = async () => {
  return api.url('/auth/whoami').get().json<WhoAmIResponseDto>()
}
