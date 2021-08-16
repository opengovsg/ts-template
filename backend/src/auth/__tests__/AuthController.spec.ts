import express from 'express'
import session from 'express-session'
import request from 'supertest'

import { AuthController } from '..'

describe('AuthController', () => {
  const service = {
    sendOTP: jest.fn(),
    verifyOTP: jest.fn(),
  }

  const controller = new AuthController({ service })
  const sessionMiddleware = session({
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'strict',
      secure: false,
      maxAge: 1800000,
    },
    secret: 'toomanysecrets',
    name: 'ts-template',
  })

  const app = express()
  app.use(express.json(), sessionMiddleware)
  app.post('/auth', controller.sendOTP)
  app.post('/auth/verify', controller.verifyOTP)
  app.get('/auth/whoami', controller.whoami)
  app.post('/auth/logout', controller.logout)

  const email = 'user@agency.gov.sg'

  describe('sendOTP', () => {
    beforeEach(() => {
      service.sendOTP.mockReset()
    })

    it('sends OTP on request', async () => {
      const response = await request(app)
        .post('/auth')
        .send({ email })
        .expect(200)

      expect(response.body).toMatchObject({ message: expect.any(String) })
      expect(service.sendOTP).toHaveBeenCalledWith(email, expect.any(String))
    })

    it('reports bad request on sendOTP error', async () => {
      const message = 'Error message'
      service.sendOTP.mockRejectedValue(new Error(message))

      const response = await request(app)
        .post('/auth')
        .send({ email })
        .expect(400)
      expect(response.body).toMatchObject({ message })
      expect(service.sendOTP).toHaveBeenCalledWith(email, expect.any(String))
    })
  })

  describe('verifyOTP', () => {
    const token = '111111'
    beforeEach(() => {
      service.verifyOTP.mockReset()
    })

    it('indicates successful verification', async () => {
      const user = { id: 1, email }
      service.verifyOTP.mockResolvedValue(user)

      const response = await request(app)
        .post('/auth/verify')
        .send({ email, token })
        .expect(200)
      expect(response.headers['set-cookie']).toBeDefined()
      expect(response.body).toMatchObject({ message: expect.any(String) })
    })

    it('reports unauthorized on failed verification', async () => {
      service.verifyOTP.mockResolvedValue(undefined)

      const response = await request(app)
        .post('/auth/verify')
        .send({ email, token })
        .expect(401)
      expect(response.headers['set-cookie']).not.toBeDefined()
      expect(response.body).toMatchObject({ message: expect.any(String) })
    })

    it('reports bad request on verifyOTP error', async () => {
      const message = 'Error message'
      service.verifyOTP.mockRejectedValue(new Error(message))

      const response = await request(app)
        .post('/auth/verify')
        .send({ email, token })
        .expect(400)
      expect(response.headers['set-cookie']).not.toBeDefined()
      expect(response.body).toMatchObject({ message })
      expect(service.verifyOTP).toHaveBeenCalledWith(email, expect.any(String))
    })
  })

  describe('whoami', () => {
    const token = '111111'
    beforeEach(() => {
      service.verifyOTP.mockReset()
    })

    it('returns nothing if not authenticated', async () => {
      const response = await request(app).get('/auth/whoami').expect(200)
      expect(response.body).toBeNull()
    })

    it('returns user object if authenticated', async () => {
      const user = { id: 1, email }
      service.verifyOTP.mockResolvedValue(user)

      const verify = await request(app)
        .post('/auth/verify')
        .send({ email, token })
        .expect(200)
      expect(verify.headers['set-cookie']).toBeDefined()
      const response = await request(app)
        .get('/auth/whoami')
        .set('Cookie', verify.headers['set-cookie'])
        .expect(200)
      expect(response.body).toMatchObject(user)
    })
  })

  describe('logout', () => {
    it('logs the user out', async () => {
      await request(app).post('/auth/logout').expect(200)
    })
  })
})
