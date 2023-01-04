import { render, screen, waitFor } from '@testing-library/react'

import { App } from '../App'

test('renders page', async () => {
  render(<App />)

  await waitFor(() =>
    expect(
      screen.getAllByText('Scaffold a starter project in minutes').length,
    ).toEqual(2),
  )
})
