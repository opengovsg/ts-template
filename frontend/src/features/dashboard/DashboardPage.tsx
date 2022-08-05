import { Link } from 'react-router-dom'
import {
  Box,
  Button,
  ButtonGroup,
  chakra,
  Flex,
  HStack,
  VStack,
} from '@chakra-ui/react'

import { ReactComponent as BrandLogoSvg } from '~assets/svgs/brand-hort-colour.svg'
import { routes } from '~constants/routes'

import { useAuth } from '~features/auth'

const BrandLogo = chakra(BrandLogoSvg)

export const Navbar = (): JSX.Element => {
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
        <BrandLogo lineHeight={8} title="Makeshift template logo" h="2rem" />
      </HStack>

      <HStack spacing={6}>
        <Button onClick={logout}>Logout</Button>
      </HStack>
    </Flex>
  )
}

const DashboardPage = (): JSX.Element => {
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

// Required to be default due to using dynamic import for lazy loading.
export default DashboardPage
