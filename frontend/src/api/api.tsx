import wretch from 'wretch'

import { UNAUTHORIZED_EVENT } from '~constants/events'

/**
 * Default API client pointing to backend.
 * Automatically catches 403 errors and invalidates authentication state.
 */
export const api = wretch('/api')
  .catcher(403, (err) => {
    window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
    throw err
  })
  .errorType('json')
