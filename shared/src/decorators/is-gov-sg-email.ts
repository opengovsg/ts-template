import { isEmail, registerDecorator, ValidationOptions } from 'class-validator'

export const isGovSgEmail = (value: unknown) => {
  return (
    typeof value === 'string' &&
    isEmail(value) &&
    value.toString().endsWith('.gov.sg')
  )
}

export const IsGovSgEmail = (options?: ValidationOptions) => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'isGovSgEmail',
      target: object.constructor,
      propertyName,
      options,
      validator: {
        validate: (value: unknown) => isGovSgEmail(value),
      },
    })
  }
}
