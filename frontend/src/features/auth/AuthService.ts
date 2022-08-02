import {
  SendLoginOtpRequestDto,
  SendLoginOtpResponseDto,
  VerifyOtpRequestDto,
  VerifyOtpResponseDto,
  WhoAmIResponseDto,
} from '~shared/types/auth.dto'

import { api } from '~/api'

/**
 * Fetches the user from the server using the current session cookie.
 *
 * @returns the logged in user if session is valid, will throw 401 error if not.
 */
export const fetchUser = async () => {
  return api.url('/auth/whoami').get().json<WhoAmIResponseDto>()
}

export const sendLoginOtp = async (params: SendLoginOtpRequestDto) => {
  params.email = params.email.toLowerCase()
  return api.url('/auth').post(params).json<SendLoginOtpResponseDto>()
}

export const verifyLoginOtp = async (params: VerifyOtpRequestDto) => {
  return api.url('/auth/verify').post(params).json<VerifyOtpResponseDto>()
}

export const logout = async (): Promise<void> => {
  return api.url('/logout').post().json()
}
