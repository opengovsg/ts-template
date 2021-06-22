import { IMinimatch } from 'minimatch'
import { SendMailOptions, SentMessageInfo, Transporter } from 'nodemailer'
import { totp as totpGlobal } from 'otplib'

import { User } from '../types/user'
import { User as UserModel } from '../database/models/User'
import config from '../config'

export class AuthService {
  private secret: string
  private appHost: string
  private emailValidator: IMinimatch
  private totp: Pick<typeof totpGlobal, 'generate' | 'verify' | 'options'>
  private mailer: Pick<Transporter, 'sendMail'>
  private UserModel: typeof UserModel

  constructor({
    secret,
    appHost,
    emailValidator,
    totp,
    mailer,
  }: {
    secret: string
    appHost: string
    emailValidator: IMinimatch
    totp: Pick<typeof totpGlobal, 'generate' | 'verify' | 'options'>
    mailer: Pick<Transporter, 'sendMail'>
  }) {
    this.secret = secret
    this.appHost = appHost
    this.emailValidator = emailValidator
    this.totp = totp
    this.mailer = mailer
    this.UserModel = UserModel
  }

  private secretFrom: (email: string) => string = (email) => this.secret + email

  private formatEmail: (email: string) => string = (email) =>
    email.toLowerCase()

  sendOTP: (email: string, ip: string) => Promise<SentMessageInfo> = async (
    email,
    ip
  ) => {
    email = this.formatEmail(email)

    if (!this.emailValidator.match(email)) {
      throw new Error('Invalid email')
    }
    const otp = this.totp.generate(this.secretFrom(email))
    const timeLeft = this.totp.options.step
      ? Math.floor(this.totp.options.step / 60) // Round down to minutes
      : NaN
    const html = `Your OTP is <b>${otp}</b>. It will expire in ${timeLeft} minutes.
    Please use this to login to your account.
    <p>If your OTP does not work, please request for a new one from ${this.appHost}.</p>
    <p>This login attempt was made from the IP: ${ip}. If you did not attempt to log in, you may choose to ignore this email or investigate this IP address further.</p>`

    const mail: SendMailOptions = {
      to: email,
      from: `${config.get('projectName')}.gov.sg <donotreply@mail.${config.get('projectName')}.gov.sg>`,
      subject: `One-Time Password (OTP) for ${config.get('projectName')}`,
      html,
    }

    return this.mailer.sendMail(mail)
  }

  verifyOTP: (email: string, token: string) => Promise<User | undefined> =
    async (email, token) => {
      email = this.formatEmail(email)

      const isVerified = this.totp.verify({
        secret: this.secretFrom(email),
        token,
      })
      const [user] = isVerified
        ? await this.UserModel.findOrCreate({ where: { email } })
        : []

      return user
    }
}

export default AuthService
