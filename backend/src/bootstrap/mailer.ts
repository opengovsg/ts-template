import nodemailer, { SendMailOptions, Transporter } from 'nodemailer'
import { SES } from 'aws-sdk'

import config from '../config'

const region = config.get('awsRegion')

export const mailer: Pick<Transporter, 'sendMail'> = region
  ? nodemailer.createTransport({
      SES: new SES({
        region,
        httpOptions: {
          connectTimeout: 20000,
        },
      }),
    })
  : {
      sendMail: (options: SendMailOptions) => {
        console.log(JSON.stringify(options, null, 2))
        return Promise.resolve(options)
      },
    }
export default mailer
