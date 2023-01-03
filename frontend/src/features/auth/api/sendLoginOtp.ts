import type {
  SendLoginOtpRequestDto,
  SendLoginOtpResponseDto,
} from '~shared/types/auth.dto'

import { api } from '~/api'

export const sendLoginOtp = async (params: SendLoginOtpRequestDto) => {
  params.email = params.email.toLowerCase()
  return api.url('/auth').post(params).json<SendLoginOtpResponseDto>()
}
