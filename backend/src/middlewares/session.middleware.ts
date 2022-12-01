import { Injectable, NestMiddleware } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { TypeormStore } from 'connect-typeorm'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import session from 'express-session'
import { DataSource } from 'typeorm'

import { ConfigService } from '../config/config.service'
import { Session } from '../database/entities'

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  private readonly middleware: RequestHandler

  constructor (
    private readonly config: ConfigService,
    @InjectDataSource()
    private readonly dataSource: DataSource
  ) {
    const sessionRepository = dataSource.getRepository(Session)

    this.middleware = session({
      resave: false, // can set to false since touch is implemented by our store
      saveUninitialized: false, // do not save new sessions that have not been modified
      secret: this.config.get('session.secret'),
      name: this.config.get('session.name'),
      cookie: {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: this.config.get('session.cookie.maxAge'),
        secure: !config.isDevEnv // disable in local dev env
      },
      store: new TypeormStore({
        // for every new session, remove this many expired ones. Defaults to 0
        cleanupLimit: 2
      }).connect(sessionRepository)
    })
  }

  use (req: Request, res: Response, next: NextFunction): void {
    this.middleware(req, res, next)
  }
}
