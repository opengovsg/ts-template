import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction, RequestHandler } from 'express'
import session from 'express-session'

import { ConfigService } from 'config/config.service'

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  private middleware: RequestHandler

  constructor(private config: ConfigService) {
    const secure = ['staging', 'production'].includes(
      this.config.get('environment')
    )
    this.middleware = session({
      resave: false, // can set to false since touch is implemented by our store
      saveUninitialized: false, // do not save new sessions that have not been modified
      secret: this.config.get('session.secret'),
      cookie: {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: this.config.get('session.cookie.maxAge'),
        secure,
      },
    })
  }

  use(req: Request, res: Response, next: NextFunction): void {
    this.middleware(req, res, next)
  }
}
