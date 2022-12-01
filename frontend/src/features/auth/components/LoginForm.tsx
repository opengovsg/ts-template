import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Link,
  Stack,
  Text,
  useBreakpointValue
} from '@chakra-ui/react'

import { isGovSgEmail } from '~shared/decorators/is-gov-sg-email'

export interface LoginFormInputs {
  email: string
}

interface LoginFormProps {
  onSubmit: (inputs: LoginFormInputs) => Promise<void>
}

export const LoginForm = ({ onSubmit }: LoginFormProps): JSX.Element => {
  const { handleSubmit, register, formState, setError } =
    useForm<LoginFormInputs>()

  const validateEmail = useCallback((value: string) => {
    const isGovDomain = isGovSgEmail(value)
    return isGovDomain || 'Please sign in with a gov.sg email address.'
  }, [])

  const onSubmitForm = async (inputs: LoginFormInputs): Promise<void> => {
    return await onSubmit(inputs).catch((e) => {
      setError('email', { type: 'server', message: e.json.message })
    })
  }

  const isMobile = useBreakpointValue({ base: true, xs: true, lg: false })

  return (
    // eslint-disable-next-line
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <FormControl
        isInvalid={!(formState.errors.email == null)}
        isReadOnly={formState.isSubmitting}
        mb='2.5rem'
      >
        <FormLabel htmlFor='email' fontSize={{ base: '1.125rem', lg: '1rem' }}>
          <Text mb='0.25rem'>Email</Text>
          <Text textStyle='body-2' mb='0.75rem'>
            Only available for use by public officers with a gov.sg email
          </Text>
        </FormLabel>
        <Input
          autoComplete='email'
          autoFocus
          placeholder='e.g. user@agency.gov.sg'
          {...register('email', {
            required: 'Please enter an email address',
            validate: validateEmail
          })}
        />
        {(formState.errors.email != null) && (
          <FormErrorMessage>{formState.errors.email.message}</FormErrorMessage>
        )}
      </FormControl>
      <Stack
        direction={{ base: 'column', lg: 'row' }}
        spacing={{ base: '1.5rem', lg: '2.5rem' }}
        align='center'
      >
        <Button
          width={isMobile ?? false ? '100%' : undefined}
          isLoading={formState.isSubmitting}
          type='submit'
        >
          Sign in
        </Button>
        <Link>Have a question?</Link>
      </Stack>
    </form>
  )
}
