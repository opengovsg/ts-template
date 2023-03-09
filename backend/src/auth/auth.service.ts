import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { FindOneOptions, Repository } from 'typeorm'

import { GenerateOtpDto, VerifyOtpDto } from '~shared/types/auth.dto'

import { ConfigService } from '../config/config.service'
import { Session, User } from '../database/entities'
import { MailerService } from '../mailer/mailer.service'
import { OtpService } from '../otp/otp.service'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    private otpService: OtpService,
    private mailerService: MailerService,
    private config: ConfigService,
    @InjectPinoLogger(AuthService.name)
    private readonly logger: PinoLogger,
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
      from: `${this.config.get('otp.sender_name')} <${this.config.get(
        'otp.email',
      )}>`,
      subject: `One-Time Password (OTP) for ${this.config.get(
        'otp.sender_name',
      )}`,
      html,
    }

    this.logger.info(`Sending mail to ${email}`)
    await this.mailerService.sendMail(mail)
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<User | undefined> {
    const { token } = verifyOtpDto
    let { email } = verifyOtpDto
    email = email.toLowerCase()
    const isVerified = this.otpService.verifyOtp(email, token)
    return isVerified
      ? await this.findOrCreate(
          { where: { email } },
          {
            email,
          },
        )
      : undefined
  }

  async findOrCreate(
    query: FindOneOptions<Partial<User>>,
    create: Partial<Omit<User, 'id'>>,
  ): Promise<User> {
    const user = await this.usersRepository.findOne(query)
    return user ?? (await this.usersRepository.save(create))
  }
}
