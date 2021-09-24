import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { GenerateOtpDto, VerifyOtpDto } from './dto/index'
import { User } from '../database/models'
import { Logger } from '@nestjs/common'
import { OtpService } from '../otp/otp.service'
import { MailerService } from '../mailer/mailer.service'

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private otpService: OtpService,
    private mailerService: MailerService
  ) {}

  async generateOtp(generateOtpDto: GenerateOtpDto): Promise<void> {
    const { email } = generateOtpDto
    const { token, timeLeft } = this.otpService.generateOtp(email)

    const html = `Your OTP is <b>${token}</b>. It will expire in ${timeLeft} minutes.
    Please use this to login to your account.
    <p>If your OTP does not work, please request for a new one.</p>`

    // TODO: Replace the `from` and `subject` fields with content specific to your application
    const mail = {
      to: email,
      from: 'Starter Kit <donotreply@mail.open.gov.sg>',
      subject: 'One-Time Password (OTP) for Starter Kit',
      html,
    }

    Logger.log(`Sending mail to ${email}`)
    return this.mailerService.sendMail(mail)
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<User | undefined> {
    const { email, token } = verifyOtpDto
    const isVerified = this.otpService.verifyOtp(email, token)
    const [user] = isVerified
      ? await this.userModel.findOrCreate({ where: { email } })
      : []

    return user
  }
}
