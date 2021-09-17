import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { TerminusModule } from '@nestjs/terminus'
import { HealthController } from './health.controller'

@Module({
  imports: [SequelizeModule, TerminusModule],
  controllers: [HealthController],
})
export class HealthModule {}
