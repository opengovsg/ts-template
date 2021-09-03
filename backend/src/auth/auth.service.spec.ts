import { Test, TestingModule } from '@nestjs/testing'
import { getModelToken } from '@nestjs/sequelize'
import { AuthService } from './auth.service'
import { ConfigService } from '../config/config.service'
import { OtpService } from '../otp/otp.service'
import { MailerService } from '../mailer/mailer.service'
import { User } from '../database/models'

describe('AuthService', () => {
  let service: AuthService
  const mockModel = {}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        ConfigService,
        OtpService,
        MailerService,
        {
          provide: getModelToken(User),
          useValue: mockModel,
        },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
