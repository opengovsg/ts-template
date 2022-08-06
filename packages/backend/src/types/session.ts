import { Session, SessionData } from 'express-session'

export type UserSession = Session & Partial<SessionData>
