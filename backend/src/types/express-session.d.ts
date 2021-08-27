import User from '../database/models'

declare module 'express-session' {
  interface SessionData {
    user: User
  }
}
