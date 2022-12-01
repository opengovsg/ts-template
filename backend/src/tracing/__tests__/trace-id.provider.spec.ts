import { Test, TestingModule } from '@nestjs/testing'
import { randomUUID } from 'crypto'
import { IncomingMessage } from 'http'

import { TraceIdProvider } from '../trace-id.provider'

describe('TraceIdProvider', () => {
  let traceIdProvider: TraceIdProvider

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TraceIdProvider]
    }).compile()

    traceIdProvider = module.get<TraceIdProvider>(TraceIdProvider)
  })

  it('generates its own id if no headers available', () => {
    const req = {
      headers: {}
    } as unknown as IncomingMessage
    const id = traceIdProvider.getTraceId(req)
    expect(id).toBeTruthy()
  })

  it('uses request id if available', () => {
    const requestId = randomUUID()
    const req = {
      headers: {
        'x-request-id': requestId
      }
    } as unknown as IncomingMessage
    const id = traceIdProvider.getTraceId(req)
    expect(id).toBe(requestId)
  })

  it('uses AWS X-Ray id if available', () => {
    const requestId = randomUUID()
    const req = {
      headers: {
        'x-amzn-trace-id': requestId,
        'x-request-id': 'x-request-id'
      }
    } as unknown as IncomingMessage
    const id = traceIdProvider.getTraceId(req)
    expect(id).toBe(requestId)
  })

  it('uses Datadog trace id if available', () => {
    const requestId = randomUUID()
    const req = {
      headers: {
        'x-datadog-trace-id': requestId,
        'x-amzn-trace-id': 'x-amzn-trace-id',
        'x-request-id': 'x-request-id'
      }
    } as unknown as IncomingMessage
    const id = traceIdProvider.getTraceId(req)
    expect(id).toBe(requestId)
  })
})
