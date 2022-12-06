import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { getLoggerToken } from 'nestjs-pino'

import { ConfigService } from '../../config/config.service'
import { Session, User } from '../../database/entities'
import { MailerService } from '../../mailer/mailer.service'
import { OtpService } from '../../otp/otp.service'
import { AuthService } from '../auth.service'

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
          provide: getRepositoryToken(User),
          useValue: mockModel,
        },
        {
          provide: getRepositoryToken(Session),
          useValue: mockModel,
        },
        {
          provide: getLoggerToken(AuthService.name),
          useValue: console,
        },
        {
          provide: getLoggerToken(MailerService.name),
          useValue: console,
        },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
