import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'

import { AppModule } from './app.module'
import { ConfigService } from 'config/config.service'
import { NodeEnv } from 'config/config.schema'
import { AppLogger } from 'logger/logger.service'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  })
  app.useLogger(app.get(AppLogger))

  app.setGlobalPrefix('/api')

  const config = app.get(ConfigService)
  const environment = config.get('environment')
  if ([NodeEnv.Staging, NodeEnv.Prod].includes(environment)) {
    app.set('trust proxy', 1)
  }

  await app.listen(config.get('port'))
}

bootstrap()
