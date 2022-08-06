import { User } from '../database/entities'

declare module 'express-session' {
  interface SessionData {
    user?: User
  }
}
