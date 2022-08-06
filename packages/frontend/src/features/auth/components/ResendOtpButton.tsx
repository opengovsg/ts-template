import { useState } from 'react'
import { Button } from '@chakra-ui/react'
import { useMutation } from '@tanstack/react-query'

import { useInterval } from '../../../hooks/useInterval'

export interface ResendOtpButtonProps {
  onResendOtp: () => Promise<void>
}

export const ResendOtpButton = ({
  onResendOtp,
}: ResendOtpButtonProps): JSX.Element => {
  // The counter
  const [timer, setTimer] = useState(0)

  const resendOtpMutation = useMutation(onResendOtp, {
    // On success, restart the timer before this can be called again.
    onSuccess: () => setTimer(60),
  })

  useInterval(
    () => setTimer(timer - 1),
    // Stop interval if timer hits 0.
    timer <= 0 ? null : 1000,
  )

  return (
    <Button
      isDisabled={resendOtpMutation.isLoading || timer > 0}
      type="button"
      variant="clear"
      colorScheme="primary"
      onClick={() => resendOtpMutation.mutate()}
    >
      <u>
        Resend OTP
        {timer > 0 && ` in ${timer}s`}
      </u>
    </Button>
  )
}
