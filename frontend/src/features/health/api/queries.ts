import { useQuery } from '@tanstack/react-query'

import { api } from '~lib/api'
import { HealthDto } from '~shared/types/health.dto'

export function useHealth() {
  const { data } = useQuery(
    ['health'],
    () => api.url(`/health`).get().json<HealthDto>(),
    {
      suspense: true,
    },
  )
  return { data }
}
