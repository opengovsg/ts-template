import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { HelmetMiddleware } from 'middlewares/helmet.middleware'
import { SessionMiddleware } from 'middlewares/session.middleware'
import { ConfigModule } from 'config/config.module'
import { AuthModule } from 'auth/auth.module'

@Module({
  imports: [
    ConfigModule,
    SequelizeModule.forRoot({
      dialect: 'sqlite', // TO-DO: change to production database dialect
      autoLoadModels: true, // TO-DO: remove in production
      synchronize: true, // TO-DO: remove in production
    }),
    AuthModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    // Apply global middlewares
    consumer.apply(HelmetMiddleware, SessionMiddleware).forRoutes('*')
  }
}
