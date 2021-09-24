import { Module, Global } from '@nestjs/common'

import { ConfigModule } from '../config/config.module'

import { MailerService } from './mailer.service'

@Global()
@Module({
  imports: [ConfigModule],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
