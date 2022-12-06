import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { getLoggerToken } from 'nestjs-pino'

import { ConfigModule } from '../../config/config.module'
import { Session, User } from '../../database/entities'
import { MailerService } from '../../mailer/mailer.service'
import { OtpModule } from '../../otp/otp.module'
import { AuthController } from '../auth.controller'
import { AuthService } from '../auth.service'

describe('AuthController', () => {
  let controller: AuthController
  const mockModel = {}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, OtpModule],
      controllers: [AuthController],
      providers: [
        AuthService,
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
          provide: getLoggerToken(AuthController.name),
          useValue: console,
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

    controller = module.get<AuthController>(AuthController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
