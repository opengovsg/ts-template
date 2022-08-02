import { getModelToken } from '@nestjs/sequelize'
import { Test, TestingModule } from '@nestjs/testing'
import { PinoLogger } from 'nestjs-pino'

import { ConfigModule } from '../config/config.module'
import { User } from '../database/models'
import { MailerModule } from '../mailer/mailer.module'
import { OtpModule } from '../otp/otp.module'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

describe('AuthController', () => {
  let controller: AuthController
  const mockModel = {}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, OtpModule, MailerModule],
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: getModelToken(User),
          useValue: mockModel,
        },
        {
          provide: `${PinoLogger.name}:${AuthController.name}`,
          useValue: console,
        },
        {
          provide: `${PinoLogger.name}:${AuthService.name}`,
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
