import { Test, TestingModule } from '@nestjs/testing'
import { getModelToken } from '@nestjs/sequelize'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { ConfigModule } from '../config/config.module'
import { OtpModule } from '../otp/otp.module'
import { MailerModule } from '../mailer/mailer.module'
import { User } from '../database/models'

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
      ],
    }).compile()

    controller = module.get<AuthController>(AuthController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
