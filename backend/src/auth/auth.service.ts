import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { GenerateOtpDto, VerifyOtpDto } from './dto/index'
import { User } from '../database/models'
import { Logger } from '@nestjs/common'
import { totp as totpFactory } from 'otplib'

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User
  ) {}

  // TO-DO: Get the totp secret and expiry from config
  private readonly secret = 'test'
  private readonly totpExpiry = 1000
  // TO-DO: Import the totp instance as a module
  private totp = totpFactory.clone({ step: this.totpExpiry, window: [1, 0] })

  private generateSecret(email: string) {
    return this.secret + email
  }

  async generateOtp(generateOtpDto: GenerateOtpDto): Promise<void> {
    const otp = this.totp.generate(this.generateSecret(generateOtpDto.email))
    const timeLeft = this.totp.options.step
      ? Math.floor(this.totp.options.step / 60) // Round down to minutes
      : NaN

    // TO-DO: Make this log only in development - read env from config
    Logger.log(
      `Your OTP token is ${otp}. It will expire in ${timeLeft} minutes`
    )
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
