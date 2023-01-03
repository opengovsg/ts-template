import { Box } from '@chakra-ui/react'

import { useHealth } from '../api/queries'

export const HealthPage = (): JSX.Element => {
  const health = useHealth()

  return <Box>{JSON.stringify(health)}</Box>
}
