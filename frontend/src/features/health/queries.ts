import { useQuery } from 'react-query'

import { api } from '~/api'

export function useHealth() {
  const { data } = useQuery(['health'], () => api.url(`/health`).get().json(), {
    suspense: true,
  })
  return { data }
}
