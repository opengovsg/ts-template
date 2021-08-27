import { GenerateOtpDto } from './generate-otp.dto'

export class VerifyOtpDto extends GenerateOtpDto {
  token!: string
}
