import { join } from 'path'
import { DataSource, DataSourceOptions } from 'typeorm'

import { base } from './ormconfig'

const config: DataSourceOptions = {
  ...base,
  migrations: [join(__dirname, 'seeds', '*{.js,.ts}')]
}

export const appDataSource = new DataSource(config)
