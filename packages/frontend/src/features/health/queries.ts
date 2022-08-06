import { HealthDto } from '@opengovsg/shared'
import { useQuery } from '@tanstack/react-query'

import { api } from '~/api'

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
