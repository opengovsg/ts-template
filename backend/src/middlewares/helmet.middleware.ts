import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import helmet from 'helmet'

@Injectable()
export class HelmetMiddleware implements NestMiddleware {
  private middleware: RequestHandler

  constructor() {
    this.middleware = helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          baseUri: ["'self'"],
          blockAllMixedContent: [],
          connectSrc: ["'self'"],
          workerSrc: [],
          // for google fonts
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          frameSrc: [],
          frameAncestors: ["'none'"],
          imgSrc: ["'self'", 'data:'],
          objectSrc: ["'none'"],
          // for google fonts
          styleSrc: [
            "'self'",
            "'unsafe-inline'",
            'https://fonts.googleapis.com',
          ],
          scriptSrcAttr: ["'none'"],
          scriptSrc: ["'self'"],
          upgradeInsecureRequests: null, // set to [] in production
        },
      },
    })
  }

  use(req: Request, res: Response, next: NextFunction): void {
    this.middleware(req, res, next)
  }
}
