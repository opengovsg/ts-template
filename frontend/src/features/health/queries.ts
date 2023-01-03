import { useQuery } from '@tanstack/react-query'

import { HealthDto } from '~shared/types/health.dto'

import { api } from '~lib/api'

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
