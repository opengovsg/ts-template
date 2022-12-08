import { IsGovSgEmail } from '../decorators/is-gov-sg-email'
export class GenerateOtpDto {
  @IsGovSgEmail({
    message: 'This does not appear to be a gov.sg email address',
  })
  email: string
}

export interface VerifyOtpDto {
  token: string
  email: string
}

export type SendLoginOtpRequestDto = GenerateOtpDto

export interface SendLoginOtpResponseDto {
  message: string
}

export type VerifyOtpRequestDto = VerifyOtpDto

export interface VerifyOtpResponseDto {
  message: string
}

export interface WhoAmIResponseDto {
  id: number
  email: string
}
