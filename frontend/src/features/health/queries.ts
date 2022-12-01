import { useQuery } from '@tanstack/react-query'

import { HealthDto } from '~shared/types/health.dto'

import { api } from '~/api'

export function useHealth (): { data?: HealthDto } {
  const { data } = useQuery(
    ['health'],
    // eslint-disable-next-line
    async () => await api.url('/health').get().json<HealthDto>(),
    {
      suspense: true
    }
  )
  return { data }
}
