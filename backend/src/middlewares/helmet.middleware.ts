import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction, RequestHandler } from 'express'
import helmet from 'helmet'

@Injectable()
export class HelmetMiddleware implements NestMiddleware {
  private middleware: RequestHandler

  constructor() {
    this.middleware = helmet()
  }

  use(req: Request, res: Response, next: NextFunction): void {
    this.middleware(req, res, next)
  }
}
