import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Box, Button, ButtonGroup, Flex } from '@chakra-ui/react'

import { routes } from '~constants/routes'

import { useAuth } from '~features/auth'
import { LOGGED_IN_KEY, useLocalStorage } from '~features/localStorage'

const DashboardPage = (): JSX.Element => {
  const auth = useAuth()
  const [, setIsAuthenticated] = useLocalStorage<boolean>(LOGGED_IN_KEY)

  const logout = useCallback(async () => {
    setIsAuthenticated(undefined)
    await auth.logout()
  }, [setIsAuthenticated])

  return (
    <Flex flexDir="column">
      <Box>Welcome {auth.user?.email}</Box>
      YOU ARE NOW AUTHENTICATED. Replace this page with the root page of your
      application.
      <ButtonGroup>
        <Button onClick={logout}>Logout</Button>
        <Button>
          <Link to={routes.login}>
            Attempt to go to login page (and see nothing happen)
          </Link>
        </Button>
        <Button>
          <Link to={routes.health}>See backend health</Link>
        </Button>
      </ButtonGroup>
    </Flex>
  )
}

// Required to be default due to using dynamic import for lazy loading.
export default DashboardPage
