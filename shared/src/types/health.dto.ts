export interface HealthDto {
  status: string
  info?: Record<string, unknown>
  error?: Record<string, unknown>
  details: Record<string, unknown>
}
