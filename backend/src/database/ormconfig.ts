import 'reflect-metadata'

import convict from 'convict'
import { join } from 'path'
import { DataSource, DataSourceOptions } from 'typeorm'

import { schema } from '../config/config.schema'

const config = convict(schema)

export const base = {
  type: 'postgres',
  host: config.get('database.host'),
  port: config.get('database.port'),
  username: config.get('database.username'),
  password: config.get('database.password'),
  database: config.get('database.name'),
  logging: config.get('database.logging'),
  // https://docs.nestjs.com/techniques/database#auto-load-entities
  synchronize: true, // do not automatically sync entities
  migrationsRun: false,
  // js for runtime, ts for typeorm cli
  entities: [join(__dirname, 'entities', '*.entity{.js,.ts}')],
  // ref: https://github.com/typeorm/typeorm/issues/3388 to set pool size
  extra: {
    min: config.get('database.minPool'),
    max: config.get('database.maxPool'),
  },
} as DataSourceOptions

const dataSource = new DataSource(base)
export default dataSource
