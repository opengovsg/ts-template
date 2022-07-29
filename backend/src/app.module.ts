import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { ServeStaticModule } from '@nestjs/serve-static'
import { TerminusModule } from '@nestjs/terminus'
import { AuthModule } from 'auth/auth.module'
import { ConfigModule } from 'config/config.module'
import { MailerModule } from 'mailer/mailer.module'
import { HelmetMiddleware } from 'middlewares/helmet.middleware'
import { SessionMiddleware } from 'middlewares/session.middleware'
import { OtpModule } from 'otp/otp.module'
import { join } from 'path'

import { ConfigService } from './config/config.service'
import { DatabaseConfigService } from './database/database-config.service'
import { HealthModule } from './health/health.module'

const FRONTEND_PATH = join(
  __dirname,
  '..',
  '..',
  '..',
  '..',
  'frontend',
  'build',
)

@Module({
  imports: [
    ConfigModule,
    OtpModule,
    MailerModule,
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useClass: DatabaseConfigService,
    }),
    AuthModule,
    TerminusModule,
    HealthModule,
    ServeStaticModule.forRoot({
      rootPath: FRONTEND_PATH,
      exclude: ['/api*'], // Return 404 for non-existent API routes
      serveStaticOptions: {
        maxAge: 2 * 60 * 60 * 1000, // 2 hours, same as cloudflare
        setHeaders: function (res, path) {
          // set maxAge to 0 for root index.html
          if (path === join(FRONTEND_PATH, 'index.html')) {
            res.setHeader('Cache-control', 'public, max-age=0')
          }
        },
      },
    }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(HelmetMiddleware, SessionMiddleware).forRoutes('*')
  }
}
