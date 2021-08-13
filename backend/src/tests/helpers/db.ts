import { Sequelize, SequelizeOptions, ModelCtor } from 'sequelize-typescript'

/**
 * This helper function creates a new test database connection
 */
export async function createTestDatabase(
  models: ModelCtor[]
): Promise<Sequelize> {
  const {
    POSTGRES_DB,
    POSTGRES_HOST,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    JEST_WORKER_ID,
  } = process.env

  const config: Partial<SequelizeOptions> = {
    dialect: 'postgres',
    host: POSTGRES_HOST || 'localhost',
    port: 5432,
    username: POSTGRES_USER || '',
    password: POSTGRES_PASSWORD || '',
    logging: undefined,
  }

  // As jest workers run in parallel each worker will make use of a separate
  // database that is postfixed with their worker id
  const database = `ts_template_test_${JEST_WORKER_ID}`

  // Connect to default database and create test worker database
  const initDb = new Sequelize({
    ...config,
    database: POSTGRES_DB || 'postgres',
  })
  await initDb.query(`DROP DATABASE IF EXISTS ${database}`)
  await initDb.query(`CREATE DATABASE ${database}`)
  await initDb.close()

  // Create test database and sync schemas of provided models
  const sequelize = new Sequelize({
    ...config,
    database,
    models,
  })
  await sequelize.sync()

  return sequelize
}
