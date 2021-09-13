import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Button, ButtonGroup, Flex } from '@chakra-ui/react'

import { LOGGED_IN_KEY, useLocalStorage } from '~features/localStorage'

const DashboardPage = (): JSX.Element => {
  const [, setIsAuthenticated] = useLocalStorage<boolean>(LOGGED_IN_KEY)

  const logout = useCallback(() => {
    setIsAuthenticated(undefined)
  }, [setIsAuthenticated])

  return (
    <Flex flexDir="column">
      YOU ARE NOW AUTHENTICATED. Replace this page with the root page of your
      application.
      <ButtonGroup>
        <Button onClick={logout}>Logout</Button>
        <Button>
          <Link to="/login">
            Attempt to go to login page (and see nothing happen)
          </Link>
        </Button>
      </ButtonGroup>
    </Flex>
  )
}

// Required to be default due to using dynamic import for lazy loading.
export default DashboardPage
