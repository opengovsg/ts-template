import { inspect } from 'util'
import { format } from 'winston'

/**
 * This is required as JSON.stringify(new Error()) returns an empty object. This
 * function converts the error in `info.error` into a readable JSON stack trace.
 *
 * Function courtesy of
 * https://github.com/winstonjs/winston/issues/1243#issuecomment-463548194.
 */
export const jsonErrorReplacer = (_key: string, value: unknown) => {
  if (value instanceof Error) {
    return Object.getOwnPropertyNames(value).reduce((all, valKey) => {
      if (valKey === 'stack') {
        const errStack = value.stack ?? ''
        return {
          ...all,
          at: errStack
            .split('\n')
            .filter((va) => va.trim().slice(0, 5) !== 'Error')
            .map((va, i) => `stack ${i} ${va.trim()}`),
        }
      } else {
        return {
          ...all,
          [valKey]: value[valKey as keyof Error],
        }
      }
    }, {})
  } else {
    return value
  }
}

/**
 * Formats the error in the transformable info to a console.error-like format.
 */
export const errorPrinter = format((info) => {
  if (!info.error) return info

  // Handle case where Error has no stack.
  const errorMsg = info.error.stack || info.error.toString()
  info.message += `\n${errorMsg}`

  return info
})

/**
 * A custom formatter for winston. Transforms winston's info object into a
 * string representation, mainly used for console logging.
 */
export const formatLogMessage = format.printf((info) => {
  // Handle multiple arguments passed into logger
  // e.g. logger.info('param1', 'param2')
  // The second parameter onwards will be passed into the `splat` key and
  // require formatting (because that is just how the library is written).
  const splatSymbol = Symbol.for('splat') as unknown as string
  const splatArgs = info[splatSymbol] || []
  const rest = splatArgs
    .map((data: unknown) => formatWithInspect(data))
    .join(' ')
  return `${info.timestamp} ${info.level} [${info.label}]: ${formatWithInspect(
    info.message
  )}\t${rest}`
})

/**
 * Formats a log message for readability.
 * Adapted from
 * https://github.com/winstonjs/winston/issues/1427#issuecomment-583199496
 */
const formatWithInspect = (val: unknown): string => {
  // We have a custom method for printing errors, so ignore errors here
  if (val instanceof Error) {
    return ''
  }
  const formattedVal =
    typeof val === 'string' ? val : inspect(val, { depth: null, colors: true })

  return isPrimitive(val) ? formattedVal : `\n${formattedVal}`
}

const isPrimitive = (val: unknown): boolean => {
  return val === null || (typeof val !== 'object' && typeof val !== 'function')
}
