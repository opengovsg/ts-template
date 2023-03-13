import { FormControl, Link, Stack } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  FormErrorMessage,
  FormLabel,
  Input,
} from '@opengovsg/design-system-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { useIsDesktop } from '~hooks/useIsDesktop'
import { isGovSgEmail } from '~shared/decorators/is-gov-sg-email'

const schema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Please enter an email address.')
    .email({ message: 'Please enter a valid email address.' })
    .refine(isGovSgEmail, {
      message: 'Please sign in with a gov.sg email address.',
    }),
})

export type LoginFormInputs = {
  email: string
}
interface LoginFormProps {
  onSubmit: (inputs: LoginFormInputs) => Promise<void>
}

export const LoginForm = ({ onSubmit }: LoginFormProps): JSX.Element => {
  const onSubmitForm = async (inputs: LoginFormInputs) => {
    return onSubmit(inputs).catch((e: { json: { message: string } }) => {
      setError('email', { type: 'server', message: e.json.message })
    })
  }

  const { handleSubmit, register, formState, setError } =
    useForm<LoginFormInputs>({
      resolver: zodResolver(schema),
    })

  const isDesktop = useIsDesktop()

  return (
    <form noValidate onSubmit={void handleSubmit(onSubmitForm)}>
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
          {...register('email')}
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
