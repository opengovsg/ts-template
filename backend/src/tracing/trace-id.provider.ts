import { Injectable } from '@nestjs/common'
import { randomUUID } from 'crypto'
import { IncomingMessage } from 'http'

@Injectable()
export class TraceIdProvider {
  getTraceId (req: IncomingMessage): string {
    const extractHeader = (headerName: string): string | undefined => {
      const header = req.headers[headerName.toLowerCase()]
      const headerValue = ([] as string[]).concat(header ?? '').join('')
      return headerValue === '' ? undefined : headerValue
    }
    return (
      extractHeader('x-datadog-trace-id') ??
      extractHeader('x-amzn-trace-id') ??
      extractHeader('x-request-id') ??
      randomUUID()
    )
  }
}
