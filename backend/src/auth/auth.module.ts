import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ConfigModule } from '../config/config.module'
import { Session, User } from '../database/entities'
import { MailerModule } from '../mailer/mailer.module'
import { OtpModule } from '../otp/otp.module'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [
    ConfigModule,
    OtpModule,
    MailerModule,
    TypeOrmModule.forFeature([User, Session]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
