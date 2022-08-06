import { Injectable } from '@nestjs/common'
import { SES } from 'aws-sdk'
import nodemailer, { SendMailOptions, Transporter } from 'nodemailer'

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
        port: 1025,
        host: 'localhost',
        ignoreTLS: true,
      })

  sendMail = async (mailOptions: SendMailOptions): Promise<void> => {
    return this.mailer.sendMail(mailOptions)
  }
}
