import {
  VerifyOtpRequestDto,
  VerifyOtpResponseDto,
} from '~shared/types/auth.dto'

import { api } from '~lib/api'

export const verifyLoginOtp = async (params: VerifyOtpRequestDto) => {
  return api.url('/auth/verify').post(params).json<VerifyOtpResponseDto>()
}
