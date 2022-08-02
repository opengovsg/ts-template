import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { ServeStaticModule } from '@nestjs/serve-static'
import { TerminusModule } from '@nestjs/terminus'
import { AuthModule } from 'auth/auth.module'
import { ConfigModule } from 'config/config.module'
import { MailerModule } from 'mailer/mailer.module'
import { HelmetMiddleware } from 'middlewares/helmet.middleware'
import { SessionMiddleware } from 'middlewares/session.middleware'
import { LoggerModule } from 'nestjs-pino'
import { OtpModule } from 'otp/otp.module'
import { join } from 'path'
import { TraceIdProvider } from 'providers/trace-id.provider'

import { ConfigService } from './config/config.service'
import { User } from './database/models'
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
    LoggerModule.forRootAsync({
      providers: [TraceIdProvider],
      inject: [TraceIdProvider],
      useFactory: (traceProvider: TraceIdProvider) => ({
        pinoHttp: {
          genReqId: traceProvider.getTraceId.bind(undefined),
          customProps: (req) => {
            const context = {
              trace_id: req.headers['x-datadog-trace-id'],
              xray_id: req.headers['x-amzn-trace-id'],
            }
            return { context, scope: 'NestApplication' }
          },
          customSuccessMessage: (req, res) => {
            return `${req.method ?? ''} ${req.url ?? ''} ${res.statusCode}`
          },
          customErrorMessage: (req, res, err) => {
            return `${req.method ?? ''} ${req.url ?? ''} ${res.statusCode}: (${
              err.name
            }) ${err.message}`
          },
        },
        renameContext: 'scope',
      }),
    }),
    ConfigModule,
    OtpModule,
    MailerModule,
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        dialect: 'postgres',
        host: config.get('database.host'),
        port: config.get('database.port'),
        username: config.get('database.username'),
        password: config.get('database.password'),
        database: config.get('database.name'),
        models: [User],
        autoLoadModels: true, // TO-DO: remove in production
        synchronize: true, // TO-DO: remove in production
        pool: {
          min: config.get('database.minPool'),
          max: config.get('database.maxPool'),
        },
        logging: config.get('database.logging'),
      }),
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
