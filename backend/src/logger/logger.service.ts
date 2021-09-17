import { ConsoleLogger, Injectable, Scope } from '@nestjs/common'
import {
  createLogger,
  format,
  Logger as WinstonLogger,
  transports,
} from 'winston'
import { NodeEnv } from '../config/config.schema'
import { ConfigService } from '../config/config.service'
import {
  errorPrinter,
  formatLogMessage,
  jsonErrorReplacer,
} from './logger.utils'
/**
 * Type of object passed to logger. We wrap Winston's logger methods
 * in a custom function which forces consumers to log in this shape.
 */
type AppLoggerParams = {
  message: string
  meta: {
    // Name of logging function
    function: string
    [other: string]: unknown
  }
  error?: unknown
}

@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger extends ConsoleLogger {
  /**
   * Internal Winston logger instance
   */
  #logger: WinstonLogger

  constructor(private configService: ConfigService) {
    super()
    const environment = this.configService.get('environment')
    this.#logger = createLogger({
      level: 'info',
      format: format.combine(
        format.errors({ stack: true }),
        format.timestamp(),
        environment === NodeEnv.Prod
          ? format.json({ replacer: jsonErrorReplacer })
          : format.combine(format.colorize(), errorPrinter(), formatLogMessage)
      ),
      transports: [
        new transports.Console({
          silent: environment === NodeEnv.Test,
        }),
      ],
    })
  }
  /**
   * Write a 'log' level log.
   */
  log(params: Omit<AppLoggerParams, 'error'>): void {
    const { message, meta } = params
    this.#logger.info(message, { meta })
  }

  /**
   * Write an 'error' level log.
   */
  error(params: AppLoggerParams): void {
    const { message, meta, error } = params
    if (error) {
      this.#logger.error(message, { meta }, error)
    } else {
      this.#logger.error(message, { meta })
    }
  }

  /**
   * Write a 'warn' level log.
   */
  warn(params: AppLoggerParams): void {
    const { message, meta, error } = params
    if (error) {
      this.#logger.error(message, { meta }, error)
    } else {
      this.#logger.error(message, { meta })
    }
  }
}
