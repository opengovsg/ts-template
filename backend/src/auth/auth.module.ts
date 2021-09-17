import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { ConfigModule } from '../config/config.module'
import { User } from '../database/models'
import { LoggerModule } from 'logger/logger.module'

@Module({
  imports: [ConfigModule, SequelizeModule.forFeature([User]), LoggerModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
