import { TerminusModule } from '@nestjs/terminus'
import { Test, TestingModule } from '@nestjs/testing'

import { ConfigModule } from '../../config/config.module'
import { HealthController } from '../health.controller'

describe('HealthController', () => {
  let controller: HealthController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, TerminusModule],
      controllers: [HealthController],
    }).compile()

    controller = module.get<HealthController>(HealthController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
