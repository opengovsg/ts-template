import { FC, PropsWithChildren, useState } from 'react'
import { Box, Flex, GridItem, GridProps, Text } from '@chakra-ui/react'

import { AppFooter } from '~/app/AppFooter'
import { AppGrid } from '~/templates/AppGrid'

import { useIsDesktop } from '~hooks/useIsDesktop'

import { LoginForm, LoginFormInputs } from './components/LoginForm'
import { LoginImageSvgr } from './components/LoginImageSvgr'
import { OtpForm, OtpFormInputs } from './components/OtpForm'
import { useAuth } from './AuthContext'

export type LoginOtpData = {
  email: string
}

// Component for the split blue/white background.
const BackgroundBox: FC<PropsWithChildren> = ({ children }) => (
  <Flex
    flex={1}
    overflow={{ lg: 'auto' }}
    flexDir="column"
    h="inherit"
    bgGradient={{
      md: 'linear(to-b, brand.primary.500 20.5rem, white 0)',
      lg: 'linear(to-r, brand.primary.500 calc(41.6667% - 4px), white 0)',
    }}
  >
    {children}
  </Flex>
)

// Component that controls the various grid areas according to responsive breakpoints.
const BaseGridLayout = (props: GridProps) => (
  <AppGrid templateRows={{ md: 'auto 1fr auto', lg: '1fr auto' }} {...props} />
)

// Grid area styling for the login form.
const LoginGridArea: FC<PropsWithChildren> = ({ children }) => (
  <GridItem
    gridColumn={{ base: '1 / 5', md: '2 / 12', lg: '7 / 12' }}
    py="4rem"
    display="flex"
    alignItems={{ base: 'initial', lg: 'center' }}
    justifyContent="center"
  >
    {children}
  </GridItem>
)

// Grid area styling for the footer.
const FooterGridArea: FC<PropsWithChildren> = ({ children }) => (
  <GridItem
    alignSelf="end"
    gridColumn={{ base: '1 / 5', md: '2 / 12' }}
    pb={{ base: 0, lg: '2.5rem' }}
    bg={{ base: 'base.canvas.brandLight', lg: 'transparent' }}
  >
    {children}
  </GridItem>
)

// Grid area styling for the left sidebar that only displays on tablet and desktop breakpoints.
const NonMobileSidebarGridArea: FC<PropsWithChildren> = ({ children }) => (
  <GridItem
    display={{ base: 'none', md: 'flex' }}
    gridColumn={{ md: '1 / 13', lg: '2 / 6' }}
    h={{ md: '20.5rem', lg: 'auto' }}
    pt={{ base: '1.5rem', md: '2.5rem', lg: '3rem' }}
    pb={{ lg: '3rem' }}
    flexDir="column"
    alignItems={{ base: 'center', lg: 'flex-end' }}
    justifyContent="center"
  >
    {children}
  </GridItem>
)

export const LoginPage = (): JSX.Element => {
  const { sendLoginOtp, verifyLoginOtp } = useAuth()
  const isDesktop = useIsDesktop()

  const [email, setEmail] = useState<string>()

  const handleSendOtp = async ({ email }: LoginFormInputs) => {
    const trimmedEmail = email.trim()
    await sendLoginOtp({ email: trimmedEmail })
    return setEmail(trimmedEmail)
  }

  const handleVerifyOtp = async ({ token }: OtpFormInputs) => {
    // Should not happen, since OtpForm component is only shown when there is
    // already an email state set.
    if (!email) {
      throw new Error('Something went wrong')
    }
    return verifyLoginOtp({ token, email })
  }

  const handleResendOtp = async () => {
    // Should not happen, since OtpForm component is only shown when there is
    // already an email state set.
    if (!email) {
      throw new Error('Something went wrong')
    }
    await sendLoginOtp({ email })
  }

  return (
    <BackgroundBox>
      <BaseGridLayout flex={1}>
        <NonMobileSidebarGridArea>
          <LoginImageSvgr maxW="100%" aria-hidden />
        </NonMobileSidebarGridArea>
        <LoginGridArea>
          <Box minH={{ base: 'auto', lg: '17.25rem' }} w="100%">
            <Flex mb={{ base: '2.5rem', lg: 0 }} flexDir="column">
              <Text
                display={{ base: 'none', lg: 'initial' }}
                textStyle="responsive-heading.heavy-1280"
                mb="2.5rem"
              >
                Scaffold a starter project in minutes
              </Text>
              <Box display={{ base: 'initial', lg: 'none' }}>
                <Box mb={{ base: '0.75rem', lg: '1.5rem' }}>
                  <Text textStyle="h3">Starter Kit</Text>
                </Box>
                <Text
                  textStyle={{
                    base: 'responsive-heading.heavy',
                    md: 'responsive-heading.heavy-480',
                    lg: 'responsive-heading.heavy-1280',
                  }}
                >
                  Scaffold a starter project in minutes
                </Text>
              </Box>
            </Flex>
            {!email ? (
              <LoginForm onSubmit={handleSendOtp} />
            ) : (
              <OtpForm
                email={email}
                onSubmit={handleVerifyOtp}
                onResendOtp={handleResendOtp}
              />
            )}
          </Box>
        </LoginGridArea>
      </BaseGridLayout>
      <BaseGridLayout
        bg={{ base: 'base.canvas.brandLight', lg: 'transparent' }}
      >
        <FooterGridArea>
          <AppFooter
            variant={{ lg: 'compact' }}
            colorMode={isDesktop ? 'dark' : 'light'}
          />
        </FooterGridArea>
      </BaseGridLayout>
    </BackgroundBox>
  )
}
