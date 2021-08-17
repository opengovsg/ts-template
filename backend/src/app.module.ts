import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'

import { AppController } from './app.controller'
import { AppService } from './app.service'

import { HelmetMiddleware } from 'middlewares/helmet.middleware'
import { SessionMiddleware } from 'middlewares/session.middleware'
import { ConfigModule } from 'config/config.module'

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [ConfigModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    // Apply global middlewares
    consumer.apply(HelmetMiddleware, SessionMiddleware).forRoutes('*')
  }
}
