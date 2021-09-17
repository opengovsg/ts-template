import { Test, TestingModule } from '@nestjs/testing'
import { getModelToken } from '@nestjs/sequelize'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { ConfigModule } from '../config/config.module'
import { User } from '../database/models'
import { AppLogger } from '../logger/logger.service'

describe('AuthController', () => {
  let controller: AuthController
  const mockModel = {}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      controllers: [AuthController],
      providers: [
        AuthService,
        AppLogger,
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
