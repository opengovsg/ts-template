import { Container, Heading, Stack, Text } from '@chakra-ui/react'

export const Welcome = (): JSX.Element => {
  return (
    <Container maxW="container.xl" py={10}>
      <Stack spacing="1.5rem">
        <Stack spacing=".5rem">
          <Heading
            as="h1"
            textStyle="display-1"
            color="primary.800"
            fontSize="4rem"
          >
            Welcome To Storybook 🚢
          </Heading>
          <Text textStyle="body-1">
            Storybook helps us build and showcase UI components in isolation.
          </Text>
        </Stack>
      </Stack>
    </Container>
  )
}
