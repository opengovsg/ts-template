import wretch from 'wretch'

const API_BASE_URL = process.env.REACT_APP_BASE_URL ?? '/api/v1'

// Create own instance with defaults.
const ApiService = wretch(API_BASE_URL)

export default ApiService
