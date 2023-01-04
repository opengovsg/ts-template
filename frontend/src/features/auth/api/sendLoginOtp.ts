import type {
  SendLoginOtpRequestDto,
  SendLoginOtpResponseDto,
} from '~shared/types/auth.dto'

import { api } from '~lib/api'

export const sendLoginOtp = async (params: SendLoginOtpRequestDto) => {
  params.email = params.email.toLowerCase()
  return api.url('/auth').post(params).json<SendLoginOtpResponseDto>()
}
