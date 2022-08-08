import { useQuery } from '@tanstack/react-query'
import { HealthDto } from '@ts/shared'

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
