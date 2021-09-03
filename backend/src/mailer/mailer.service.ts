import { Injectable } from '@nestjs/common'
import { Logger } from '@nestjs/common'
import nodemailer, { SendMailOptions, Transporter } from 'nodemailer'
import { SES } from 'aws-sdk'

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
    : {
        sendMail: (options: SendMailOptions) => {
          Logger.log(JSON.stringify(options, null, 2))
          return Promise.resolve(options)
        },
      }

  sendMail = async (mailOptions: SendMailOptions): Promise<void> => {
    return this.mailer.sendMail(mailOptions)
  }
}
