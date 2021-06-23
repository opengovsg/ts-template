import { SequelizeOptions } from 'sequelize-typescript'

export type nodeEnvType = 'development' | 'staging' | 'production'

export type databaseConfigType = {
  development: SequelizeOptions
  staging: SequelizeOptions
  production: SequelizeOptions
}
