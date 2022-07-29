import { Box } from '@chakra-ui/react'

import { useHealth } from '~features/health/queries'

const HealthPage = (): JSX.Element => {
  const health = useHealth()

  return <Box>{JSON.stringify(health)}</Box>
}

export default HealthPage
