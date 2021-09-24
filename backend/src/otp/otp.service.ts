import { Injectable } from '@nestjs/common'
import { totp as totpFactory } from 'otplib'

import { ConfigService } from '../config/config.service'

const NUM_MINUTES_IN_AN_HOUR = 60

@Injectable()
export class OtpService {
  constructor(private config: ConfigService) {}

  private totp = totpFactory.clone({
    step: this.config.get('otp.expiry'),
    window: [
      this.config.get('otp.numValidPastWindows'),
      this.config.get('otp.numValidFutureWindows'),
    ],
  })

  private concatSecretWithEmail(email: string): string {
    return this.config.get('otp.secret') + email
  }

  generateOtp(email: string): { token: string; timeLeft: number } {
    const token = this.totp.generate(this.concatSecretWithEmail(email))
    const timeLeft = this.totp.options.step
      ? Math.floor(this.totp.options.step / NUM_MINUTES_IN_AN_HOUR) // Round down to minutes
      : NaN
    return { token, timeLeft }
  }

  verifyOtp(email: string, token: string): boolean {
    return this.totp.verify({
      secret: this.concatSecretWithEmail(email),
      token,
    })
  }
}
