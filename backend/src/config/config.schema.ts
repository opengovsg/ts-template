import { addFormats, Schema } from 'convict'

export interface ConfigSchema {
  port: number
  environment: 'development' | 'staging' | 'production' | 'test'
  awsRegion: string
  database: {
    host: string
    username: string
    password: string
    port: number
    name: string
    logging: boolean
    minPool: number
    maxPool: number
    ca: string
  }
  session: {
    secret: string
    name: string
    cookie: {
      maxAge: number
    }
  }
  otp: {
    expiry: number
    secret: string
    numValidPastWindows: number
    numValidFutureWindows: number
    sender_name: string
    email: string
  }
  postmangovsgApiKey: string
  mailer: {
    auth: {
      type: 'login'
      user: string
      pass: string
    }
    host: string
    port: number
  }
  health: { heapSizeThreshold: number; rssThreshold: number }
}

addFormats({
  'required-string': {
    validate: (val?: string): void => {
      if (val == undefined || val === '') {
        throw new Error('Required value cannot be empty')
      }
    },
  },
})

export const schema: Schema<ConfigSchema> = {
  port: {
    doc: 'The port that the service listens on',
    env: 'PORT',
    format: 'int',
    default: 8080,
  },
  environment: {
    doc: 'The environment that Node.js is running in',
    env: 'NODE_ENV',
    format: ['development', 'staging', 'production', 'test'],
    default: 'development',
  },
  awsRegion: {
    doc: 'The AWS region for SES. Optional, logs mail to console if absent',
    env: 'AWS_REGION',
    format: '*',
    default: '',
  },
  database: {
    username: {
      env: 'DB_USERNAME',
      sensitive: true,
      default: '',
      format: 'required-string',
    },
    password: {
      env: 'DB_PASSWORD',
      sensitive: true,
      default: '',
      format: 'required-string',
    },
    host: {
      env: 'DB_HOST',
      default: 'localhost',
      format: 'required-string',
    },
    port: {
      env: 'DB_PORT',
      default: 5432,
      format: Number,
    },
    name: {
      env: 'DB_NAME',
      default: '',
      format: 'required-string',
    },
    logging: {
      env: 'DB_LOGGING',
      default: false,
    },
    minPool: {
      env: 'DB_MIN_POOL_SIZE',
      default: 10,
    },
    maxPool: {
      env: 'DB_MAX_POOL_SIZE',
      default: 100,
    },
    ca: {
      env: 'CA_CERT',
      default: '',
      format: String,
    },
  },
  session: {
    name: {
      doc: 'Name of session ID cookie to set in response',
      env: 'SESSION_NAME',
      default: 'ts-template.sid',
      format: String,
    },
    secret: {
      doc: 'A secret string used to generate sessions for users',
      env: 'SESSION_SECRET',
      default: 'toomanysecrets',
      format: String,
    },
    cookie: {
      maxAge: {
        doc: 'The maximum age for a cookie, expressed in ms',
        env: 'COOKIE_MAX_AGE',
        format: 'int',
        default: 24 * 60 * 60 * 1000, // 24 hours
      },
    },
  },
  otp: {
    expiry: {
      doc: 'The number of seconds that an OTP is valid for a user',
      env: 'OTP_EXPIRY',
      format: 'int',
      default: 300,
    },
    secret: {
      doc: 'A secret string used to generate TOTPs for users',
      env: 'OTP_SECRET',
      format: '*',
      default: 'toomanysecrets',
    },
    numValidPastWindows: {
      doc: 'The number of past windows for which tokens should be considered valid, where a window is the duration that an OTP is valid for, e.g. OTP expiry time.',
      env: 'OTP_NUM_VALID_PAST_WINDOWS',
      format: 'int',
      default: 1,
    },
    numValidFutureWindows: {
      doc: 'The number of future windows for which tokens should be considered valid, where a window is the duration that an OTP is valid for, e.g. OTP expiry time.',
      env: 'OTP_NUM_VALID_FUTURE_WINDOWS',
      format: 'int',
      default: 0,
    },
    sender_name: {
      doc: 'Name of email sender',
      env: 'OTP_SENDER_NAME',
      format: String,
      default: 'Starter Kit',
    },
    email: {
      doc: 'Email to send OTP emails from. If POSTMANGOVSG_API_KEY is set, ensure that this email is the one associated with the key',
      env: 'OTP_EMAIL',
      format: String,
      default: 'donotreply@mail.open.gov.sg',
    },
  },
  postmangovsgApiKey: {
    doc: 'The API key used to send emails via Postman',
    env: 'POSTMANGOVSG_API_KEY',
    format: String,
    default: '',
  },
  mailer: {
    doc:
      'Mailer configuration for SMTP mail services. ' +
      'If POSTMANGOVSG_API_KEY is present, this configuration is ignored and ' +
      'the mailer will use Postman instead.',
    auth: {
      type: {
        doc: 'The type of authentication used. Currently, only "login" is supported',
        format: ['login'],
        default: 'login',
      },
      user: {
        doc: 'The user to present to the SMTP service',
        env: 'MAILER_USER',
        format: String,
        default: 'mailer-user',
      },
      pass: {
        doc: 'The password to present to the SMTP service',
        env: 'MAILER_PASSWORD',
        format: String,
        default: 'mailer-password',
      },
    },
    host: {
      doc: 'The server hosting the SMTP service',
      env: 'MAILER_HOST',
      format: String,
      default: 'localhost',
    },
    port: {
      doc: 'The port for the SMTP service',
      env: 'MAILER_PORT',
      format: 'port',
      default: 1025,
    },
  },
  health: {
    heapSizeThreshold: {
      doc: 'Heap size threshold before healthcheck fails (in bytes).',
      env: 'HEAP_SIZE_THRESHOLD',
      format: 'int',
      // TODO: Set to a more reasonable value depending on the instance size used.
      default: 200 * 1024 * 1024, // 200MB
    },
    rssThreshold: {
      doc: 'Resident set size threshold before healthcheck fails (in bytes).',
      env: 'RSS_THRESHOLD',
      format: 'int',
      // TODO: Set to a more reasonable value depending on the instance size used.
      default: 3000 * 1024 * 1024, // 3000MB
    },
  },
}
