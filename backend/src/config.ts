/**
 * @file Configuration
 * All defaults can be changed
 */
import convict from 'convict'

/**
 * To require an env var without setting a default,
 * use
 *    default: '',
 *    format: 'required-string',
 *    sensitive: true,
 */
convict.addFormats({
  'required-string': {
    validate: (val: unknown): void => {
      if (val === '') {
        throw new Error('Required value cannot be empty')
      }
    },
    coerce: <T extends unknown>(val: T): T | undefined => {
      if (val === null) {
        return undefined
      }
      return val
    },
  },
})

const config = convict({
  port: {
    doc: 'The port that the service listens on',
    env: 'PORT',
    format: 'int',
    default: 8080,
  },
})

export default config
