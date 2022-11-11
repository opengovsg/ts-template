// https://docs.datadoghq.com/tracing/trace_collection/dd_libraries/nodejs/

import tracer from 'dd-trace'

tracer.init({ logInjection: true }) // initialized in a different file to avoid hoisting.

export { TraceIdProvider } from './trace-id.provider'
export default tracer
