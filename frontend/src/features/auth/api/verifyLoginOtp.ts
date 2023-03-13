import { api } from '~lib/api'
import {
  VerifyOtpRequestDto,
  VerifyOtpResponseDto,
} from '~shared/types/auth.dto'

export const verifyLoginOtp = async (params: VerifyOtpRequestDto) => {
  return api.url('/auth/verify').post(params).json<VerifyOtpResponseDto>()
}
