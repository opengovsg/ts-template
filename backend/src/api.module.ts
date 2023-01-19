import { Module } from '@nestjs/common'
import { RouterModule } from '@nestjs/core'
import { TerminusModule } from '@nestjs/terminus'

import { AuthModule } from './auth/auth.module'
import { HealthModule } from './health/health.module'
import { MailerModule } from './mailer/mailer.module'
import { OtpModule } from './otp/otp.module'

const apiModules = [
  AuthModule,
  TerminusModule,
  HealthModule,
  OtpModule,
  MailerModule,
]

@Module({
  imports: [
    ...apiModules,
    RouterModule.register([
      {
        path: 'api',
        children: [
          {
            path: 'v1',
            children: apiModules,
          },
        ],
      },
    ]),
  ],
})
export class ApiModule {}
