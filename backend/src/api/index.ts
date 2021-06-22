import express, { Router } from 'express'
import { AuthController } from '../auth/AuthController'

export default (options: { auth: AuthController }): Router => {
  const { auth } = options
  const api = express.Router()

  // Heartbeat check
  api.get('/ping', (req, res) => {
    res.status(200).json({ message: 'pong' })
  })

  // Authentication and implicit account creation
  api.post('/auth', auth.sendOTP)
  api.post('/auth/verify', auth.verifyOTP)
  api.get('/auth/whoami', auth.whoami)
  api.post('/auth/logout', auth.logout)

  return api
}
