import { User } from '../database/entities'

declare module 'express' {
  export interface Request {
    user: User
  }
}
