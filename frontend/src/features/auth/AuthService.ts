import {
  SendLoginOtpRequestDto,
  SendLoginOtpResponseDto,
  VerifyOtpRequestDto,
  VerifyOtpResponseDto,
  WhoAmIResponseDto
} from '~shared/types/auth.dto'

import { api } from '~/api'

/**
 * Fetches the user from the server using the current session cookie.
 *
 * @returns the logged in user if session is valid, will throw 401 error if not.
 */
export const fetchUser = async (): Promise<WhoAmIResponseDto> => {
  return await api.url('/auth/whoami').get().json<WhoAmIResponseDto>()
}

export const sendLoginOtp = async (params: SendLoginOtpRequestDto): Promise<SendLoginOtpResponseDto> => {
  params.email = params.email.toLowerCase()
  return await api.url('/auth').post(params).json<SendLoginOtpResponseDto>()
}

export const verifyLoginOtp = async (params: VerifyOtpRequestDto): Promise<VerifyOtpResponseDto> => {
  return await api.url('/auth/verify').post(params).json<VerifyOtpResponseDto>()
}

export const logout = async (): Promise<void> => {
  return await api.url('/auth/logout').post().json()
}
