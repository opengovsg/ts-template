import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { GenerateOtpDto, VerifyOtpDto } from './dto/index'
import { User } from '../database/models'
import { totp as totpFactory } from 'otplib'
import { ConfigService } from '../config/config.service'
import { AppLogger } from '../logger/logger.service'

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private config: ConfigService,
    private readonly logger: AppLogger
  ) {
    this.logger.setContext(AuthService.name)
  }

  private totp = totpFactory.clone({
    step: this.config.get('otp.expiry'),
    window: [1, 0],
  })

  private generateSecret(email: string) {
    return this.config.get('otp.secret') + email
  }

  async generateOtp(generateOtpDto: GenerateOtpDto): Promise<void> {
    const otp = this.totp.generate(this.generateSecret(generateOtpDto.email))
    const timeLeft = this.totp.options.step
      ? Math.floor(this.totp.options.step / 60) // Round down to minutes
      : NaN

    // TO-DO: Make this log only in development - read env from config
    this.logger.log({
      message: `Your OTP token is ${otp}. It will expire in ${timeLeft} minutes`,
      meta: {
        function: 'generateOtp',
      },
    })
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<User | undefined> {
    const { email, token } = verifyOtpDto
    const isVerified = this.totp.verify({
      secret: this.generateSecret(email),
      token,
    })
    const [user] = isVerified
      ? await this.userModel.findOrCreate({ where: { email } })
      : []

    return user
  }
}
