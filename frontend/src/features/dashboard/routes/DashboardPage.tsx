import { Box, ButtonGroup, Flex, HStack, Text, VStack } from '@chakra-ui/react'
import { Button } from '@opengovsg/design-system-react'
import { Link } from 'react-router-dom'

import { routes } from '~constants/routes'
import { useAuth } from '~lib/auth'

const Navbar = (): JSX.Element => {
  const { logout } = useAuth()

  return (
    <Flex
      flexDir="row"
      px={8}
      h={16}
      justifyContent="space-between"
      borderBottom="1px"
      borderBottomColor="#F0F0F1"
      w="full"
    >
      <HStack spacing={8}>
        <Text>Starter Kit</Text>
      </HStack>

      <HStack spacing={6}>
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <Button onClick={logout}>Logout</Button>
      </HStack>
    </Flex>
  )
}

export const DashboardPage = (): JSX.Element => {
  const { user } = useAuth()

  return (
    <VStack alignItems="left" spacing="0px">
      <Navbar />
      <VStack pt={16} spacing={8} align={'center'}>
        <Box>Welcome {user?.email}.</Box>
        <Box>
          YOU ARE NOW AUTHENTICATED. Replace this page with the root page of
          your application.
        </Box>
        <ButtonGroup>
          <Button>
            <Link to={routes.health}>See backend health</Link>
          </Button>
        </ButtonGroup>
      </VStack>
    </VStack>
  )
}
