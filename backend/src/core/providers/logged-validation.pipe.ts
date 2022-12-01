import 'dotenv/config'

import { BadRequestException, Injectable, ValidationPipe } from '@nestjs/common'
import { ValidationError } from 'class-validator'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'

@Injectable()
export class LoggedValidationPipe extends ValidationPipe {
  constructor (
    @InjectPinoLogger(ValidationPipe.name)
    private readonly logger: PinoLogger
  ) {
    super({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        errors = this.flattenErrors(errors).filter(
          (errors) => !(errors.constraints == null)
        )
        this.logger.info(JSON.stringify(errors))
        const allErrors = errors
          .flatMap((e) => Object.values(e.constraints ?? {}))
          .join('\n')
        return new BadRequestException(allErrors)
      }
    })
  }

  private flattenErrors (
    errors: ValidationError[]
  ): Array<Omit<ValidationError, 'children'>> {
    const children: Array<Omit<ValidationError, 'children'>> = errors
      .filter((error) => error.children?.length)
      // Filter guarantees that error.children is non-null
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .map((error) => this.flattenErrors(error.children!))
      .flat()
    const result: Array<Omit<ValidationError, 'children'>> = errors.map((error) => {
      const { children, ...rest } = error
      return rest
    })
    result.push(...children)
    return result
  }
}
