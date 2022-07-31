import { useQuery } from 'react-query'

import { HealthDto } from '~shared/types/health.dto'

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
