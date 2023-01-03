import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { FormControl, Link, Stack } from '@chakra-ui/react'
import {
  Button,
  FormErrorMessage,
  FormLabel,
  Input,
} from '@opengovsg/design-system-react'

import { isGovSgEmail } from '~shared/decorators/is-gov-sg-email'

import { useIsDesktop } from '~hooks/useIsDesktop'

export type LoginFormInputs = {
  email: string
}

interface LoginFormProps {
  onSubmit: (inputs: LoginFormInputs) => Promise<void>
}

export const LoginForm = ({ onSubmit }: LoginFormProps): JSX.Element => {
  const { handleSubmit, register, formState, setError } =
    useForm<LoginFormInputs>()

  const validateEmail = useCallback((value: string) => {
    return (
      isGovSgEmail(value.trim()) ||
      'Please sign in with a gov.sg email address.'
    )
  }, [])

  const onSubmitForm = async ({ email }: LoginFormInputs) => {
    return onSubmit({ email: email.trim() }).catch((e) => {
      setError('email', { type: 'server', message: e.json.message })
    })
  }

  const isDesktop = useIsDesktop()

  return (
    <form noValidate onSubmit={handleSubmit(onSubmitForm)}>
      <FormControl
        isRequired
        isInvalid={!!formState.errors.email}
        isReadOnly={formState.isSubmitting}
        mb="2.5rem"
      >
        <FormLabel
          description="Only available for use by public officers with a gov.sg email"
          htmlFor="email"
          fontSize={{ base: '1.125rem', lg: '1rem' }}
        >
          Email
        </FormLabel>
        <Input
          autoComplete="email"
          autoFocus
          placeholder="e.g. user@agency.gov.sg"
          {...register('email', {
            required: 'Please enter an email address',
            validate: validateEmail,
          })}
        />
        <FormErrorMessage>{formState.errors.email?.message}</FormErrorMessage>
      </FormControl>
      <Stack
        direction={{ base: 'column', lg: 'row' }}
        spacing={{ base: '1.5rem', lg: '2.5rem' }}
        align="center"
      >
        <Button
          isFullWidth={!isDesktop}
          isLoading={formState.isSubmitting}
          type="submit"
        >
          Sign in
        </Button>
        <Link>Have a question?</Link>
      </Stack>
    </form>
  )
}
