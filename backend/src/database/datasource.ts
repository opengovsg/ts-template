import { join } from 'path'
import { DataSource, DataSourceOptions } from 'typeorm'

import { base } from './ormconfig'

export const config: DataSourceOptions = {
  ...base,
  migrations: [join(__dirname, 'migrations', '*{.js,.ts}')],
}

// For CLI migrations.
// TypeORM Module instantiates its own datasource which should be injected as necessary.
export const appDataSource = new DataSource(config)
