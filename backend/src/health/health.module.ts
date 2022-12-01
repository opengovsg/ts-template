import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'
import { TypeOrmModule } from '@nestjs/typeorm'

import { HealthController } from './health.controller'

@Module({
  imports: [TerminusModule, TypeOrmModule],
  controllers: [HealthController]
})
export class HealthModule {}
