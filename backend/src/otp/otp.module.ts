import { Module, Global } from '@nestjs/common'

import { ConfigModule } from '../config/config.module'
import { OtpService } from './otp.service'

@Global()
@Module({
  imports: [ConfigModule],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
