import { Injectable } from '@nestjs/common'
import { SES } from 'aws-sdk'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import nodemailer, {
  SendMailOptions,
  SentMessageInfo,
  Transporter,
} from 'nodemailer'

import { ConfigService } from '../config/config.service'

@Injectable()
export class MailerService {
  constructor(
    private config: ConfigService,
    @InjectPinoLogger(MailerService.name)
    private readonly logger: PinoLogger,
  ) {}

  // FIXME: Once mail services are available, remove this block:
  private mailer: Pick<Transporter, 'sendMail'> = !this.config.isDevEnv
    ? {
        sendMail: (mailOptions: SendMailOptions) => {
          this.logger.warn(
            `REMOVE ME ONCE ${SES.name} OR MAIL IS IN PLACE Logging mail: ${
              mailOptions.html?.toString() ?? ''
            }`,
          )
          return Promise.resolve()
        },
      }
    : nodemailer.createTransport({
        ...this.config.get('mailer'),
        secure: !this.config.isDevEnv,
        ignoreTLS: this.config.isDevEnv,
      })

  // FIXME: Once mail services are available, uncomment this block:
  // private mailer: Pick<Transporter, 'sendMail'> = this.config.get('awsRegion')
  //   ? nodemailer.createTransport({
  //       SES: new SES({
  //         region: this.config.get('awsRegion'),
  //         httpOptions: {
  //           connectTimeout: 20000,
  //         },
  //       }),
  //     })
  //   : nodemailer.createTransport({
  //       ...this.config.get('mailer'),
  //       secure: !this.config.isDevEnv,
  //       ignoreTLS: this.config.isDevEnv,
  //     })

  sendMail = async (mailOptions: SendMailOptions): Promise<SentMessageInfo> => {
    this.logger.info('Sending mail')
    return this.mailer.sendMail(mailOptions)
  }
}
