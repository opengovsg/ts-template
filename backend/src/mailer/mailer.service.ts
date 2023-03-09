import { Injectable } from '@nestjs/common'
import { PostmanNodemailerTransport } from '@opengovsg/postmangovsg-client'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import {
  createTransport,
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

  private chooseTransporter(): Pick<Transporter, 'sendMail'> {
    if (this.config.get('postmangovsgApiKey')) {
      return createTransport(
        new PostmanNodemailerTransport(this.config.get('postmangovsgApiKey')),
      )
    } else if (this.config.isDevEnv) {
      return createTransport({
        ...this.config.get('mailer'),
        secure: !this.config.isDevEnv,
        ignoreTLS: this.config.isDevEnv,
      })
    } else {
      // FIXME: Once mail services are available, remove this block:
      return {
        sendMail: (mailOptions: SendMailOptions) => {
          this.logger.warn(
            `REMOVE ME ONCE POSTMAN OR MAIL IS IN PLACE Logging mail: ${
              mailOptions.html?.toString() ?? ''
            }`,
          )
          return Promise.resolve()
        },
      }
    }
  }

  private mailer: Pick<Transporter, 'sendMail'> = this.chooseTransporter()

  sendMail = async (mailOptions: SendMailOptions): Promise<SentMessageInfo> => {
    this.logger.info('Sending mail')
    return this.mailer.sendMail(mailOptions)
  }
}
