import { registerDecorator, ValidationOptions, isEmail } from 'class-validator'

export const isGovSgEmail = (value: unknown, options?: ValidationOptions): boolean => {
  return (
    typeof value === 'string' &&
    isEmail(value, options) &&
    value.toString().endsWith('.gov.sg')
  )
}

export const IsGovSgEmail = (options?: ValidationOptions) => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (object: Object, propertyName: string): void => {
    registerDecorator({
      name: 'isGovSgEmail',
      target: object.constructor,
      propertyName,
      options,
      validator: {
        validate: (value: unknown) => isGovSgEmail(value, options)
      }
    })
  }
}
