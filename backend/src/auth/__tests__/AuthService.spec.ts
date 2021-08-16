import minimatch from 'minimatch'
import { Sequelize } from 'sequelize-typescript'
import { AuthService } from '..'
import { User } from '../../database/models'
import { createTestDatabase } from '../../tests/helpers/db'

describe('AuthService', () => {
  let sequelize: Sequelize

  const totp = {
    generate: jest.fn(),
    verify: jest.fn(),
    options: { step: 60 },
  }

  const secret = 'toomanysecrets'
  const appHost = 'default.gov.sg'
  const emailValidator = new minimatch.Minimatch('*.gov.sg')
  const mailer = { sendMail: jest.fn() }

  const service = new AuthService({
    secret,
    appHost,
    emailValidator,
    totp,
    mailer,
    User,
  })

  beforeAll(async () => {
    sequelize = await createTestDatabase([User])
  })

  afterAll(async () => {
    await sequelize.close()
  })

  describe('sendOTP', () => {
    beforeEach(() => {
      totp.generate.mockReset()
      mailer.sendMail.mockReset()
    })

    it('sends mail on valid email', () => {
      const email = 'user@agency.gov.sg'
      const otp = '111111'
      const ip = '192.168.0.1'
      totp.generate.mockReturnValue(otp)

      // We deliberately skip the await here, as jest
      // does not want to play nicely with Node's util.promisify
      service.sendOTP(email, ip)

      expect(totp.generate).toHaveBeenCalledWith(secret + email)
      expect(mailer.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: email,
          html: expect.stringContaining(otp),
        })
      )
      expect(mailer.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: email,
          html: expect.stringContaining(ip),
        })
      )
      expect(mailer.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: email,
          html: expect.stringContaining(
            Math.floor(totp.options.step / 60) + ' minutes'
          ),
        })
      )
    })

    it('rejects invalid email', async () => {
      const email = 'nongovernment@polytechnic.edu.sg'
      const otp = '111111'
      const ip = '192.168.0.1'
      totp.generate.mockReturnValue(otp)

      await expect(() => service.sendOTP(email, ip)).rejects.toThrowError()
      expect(totp.generate).not.toHaveBeenCalled()
      expect(mailer.sendMail).not.toHaveBeenCalled()
    })
  })

  describe('verifyOTP', () => {
    const user = { email: 'user@agency.gov.sg' }
    const token = '111111'

    beforeEach(async () => {
      await User.truncate()
    })

    it('returns user on successful verify', async () => {
      totp.verify.mockReturnValue(true)

      await expect(service.verifyOTP(user.email, token)).resolves.toMatchObject(
        user
      )
      expect(totp.verify).toHaveBeenCalledWith({
        secret: secret + user.email,
        token,
      })
      const created = await User.findOne({ where: user })
      expect(created).not.toBeNull()
    })

    it('returns nothing on failed verify', async () => {
      totp.verify.mockReturnValue(false)

      await expect(
        service.verifyOTP(user.email, token)
      ).resolves.toBeUndefined()
      expect(totp.verify).toHaveBeenCalledWith({
        secret: secret + user.email,
        token,
      })
      const created = await User.findOne({ where: user })
      expect(created).toBeNull()
    })
  })
})
