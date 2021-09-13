import { render, screen, waitFor } from '@testing-library/react'

import { App } from '../App'

test('renders page', async () => {
  render(<App />)

  await waitFor(() =>
    expect(screen.getByText('This is a mock login page')).toBeInTheDocument(),
  )
})
