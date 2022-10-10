import { Injectable } from '@nestjs/common'
import { SES } from 'aws-sdk'
import nodemailer, {
  SendMailOptions,
  SentMessageInfo,
  Transporter,
} from 'nodemailer'

import { ConfigService } from '../config/config.service'

@Injectable()
export class MailerService {
  constructor(private config: ConfigService) {}

  private mailer: Pick<Transporter, 'sendMail'> = this.config.get('awsRegion')
    ? nodemailer.createTransport({
        SES: new SES({
          region: this.config.get('awsRegion'),
          httpOptions: {
            connectTimeout: 20000,
          },
        }),
      })
    : nodemailer.createTransport({
        ...this.config.get('mailer'),
        secure: !this.config.isDevEnv,
        ignoreTLS: this.config.isDevEnv,
      })

  sendMail = async (mailOptions: SendMailOptions): Promise<SentMessageInfo> => {
    return this.mailer.sendMail(mailOptions)
  }
}
