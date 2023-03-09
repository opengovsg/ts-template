import 'dotenv/config'

import { BadRequestException, Injectable, ValidationPipe } from '@nestjs/common'
import { ValidationError } from 'class-validator'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'

@Injectable()
export class LoggedValidationPipe extends ValidationPipe {
  constructor(
    @InjectPinoLogger(ValidationPipe.name)
    private readonly logger: PinoLogger,
  ) {
    super({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        errors = this.flattenErrors(errors).filter(
          (errors) => !!errors.constraints,
        )
        this.logger.info(JSON.stringify(errors))
        const allErrors = errors
          .flatMap((e) => Object.values(e.constraints ?? {}))
          .join('\n')
        return new BadRequestException(allErrors)
      },
    })
  }

  private flattenErrors(
    errors: ValidationError[],
  ): Omit<ValidationError, 'children'>[] {
    const result = errors.flatMap(({ children, ...error }) => {
      return [error].concat(this.flattenErrors(children || []))
    })
    return result
  }
}
