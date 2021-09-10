import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Button, ButtonGroup, Flex, Heading } from '@chakra-ui/react'

import { LOGGED_IN_KEY, useLocalStorage } from '~features/localStorage'

const LoginPage = (): JSX.Element => {
  const [, setIsAuthenticated] = useLocalStorage<boolean>(LOGGED_IN_KEY)

  const login = useCallback(() => {
    setIsAuthenticated(true)
  }, [setIsAuthenticated])

  return (
    <Flex flexDir="column">
      <Heading>This is a mock login page</Heading>
      <ButtonGroup>
        <Button onClick={login}>Log in</Button>

        <Button>
          <Link to="/">
            Attempt to go to restricted route (and see nothing happen)
          </Link>
        </Button>
      </ButtonGroup>
    </Flex>
  )
}

// Required to be default due to using dynamic import for lazy loading.
export default LoginPage
