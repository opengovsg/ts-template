import express, { Express } from 'express'
import session from 'express-session'
import bodyParser from 'body-parser'
import { Sequelize, SequelizeOptions } from 'sequelize-typescript'
import SequelizeStoreFactory from 'connect-session-sequelize'

// Sequelize-related imports
import { databaseConfigType, nodeEnvType } from '../types/sequelize-config'
import * as sequelizeConfig from '../database/config/config'
import { User } from '../database/models/User'

import minimatch from 'minimatch'
import { totp as totpFactory } from 'otplib'

import config from '../config'
import api from '../api'
import { AuthController, AuthService } from '../auth'

import mailer from './mailer'

const step = config.get('otpExpiry') / 2

const totp = totpFactory.clone({ step, window: [1, 0] })

const mailSuffix = config.get('mailSuffix')

const emailValidator = new minimatch.Minimatch(mailSuffix, {
  noext: true,
  noglobstar: true,
  nobrace: true,
  nonegate: true,
})

export async function bootstrap(): Promise<{
  app: Express
  sequelize: Sequelize
}> {
  // Create Sequelize instance and add models
  const nodeEnv = config.get('nodeEnv') as nodeEnvType
  const options: SequelizeOptions = (sequelizeConfig as databaseConfigType)[
    nodeEnv
  ]

  console.log('Creating Sequelize instance and adding models')
  const sequelize = new Sequelize(options)
  sequelize.addModels([User])

  const auth = new AuthController({
    service: new AuthService({
      secret: config.get('otpSecret'),
      appHost: config.get('appHost'),
      emailValidator,
      totp,
      mailer,
    }),
  })

  const SequelizeStore = SequelizeStoreFactory(session.Store)

  const secure = ['production', 'staging'].includes(config.get('nodeEnv'))

  const sessionMiddleware = session({
    store: new SequelizeStore({
      db: sequelize,
      tableName: 'sessions',
    }),
    resave: false, // can set to false since touch is implemented by our store
    saveUninitialized: false, // do not save new sessions that have not been modified
    cookie: {
      httpOnly: true,
      sameSite: 'strict',
      secure,
      maxAge: config.get('cookieMaxAge'),
    },
    secret: config.get('sessionSecret'),
    name: 'ts-template',
  })

  const app = express()

  if (secure) {
    app.set('trust proxy', 1)
  }

  const apiMiddleware = [sessionMiddleware, bodyParser.json()]
  app.use('/api/v1', apiMiddleware, api({ auth }))

  console.log('Connecting to Sequelize')
  await sequelize.authenticate()
  return { app, sequelize }
}

export default bootstrap
