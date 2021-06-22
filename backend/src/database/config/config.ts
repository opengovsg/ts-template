import config from '../../config'

// We have to manually parse database URL because sequelize-typescript requires explicit
// connection parameters.
const connectionConfig = {
  host: config.get('dbHost'),
  username: config.get('dbUsername'),
  port: config.get('dbPort'),
  password: config.get('dbPassword'),
  database: config.get('dbName'),
  dialect: config.get('dbDialect'),
}

module.exports = {
  development: {
    seederStorage: 'sequelize',
    ...connectionConfig,
  },
  staging: {
    timezone: '+08:00',
    seederStorage: 'sequelize',
    ...connectionConfig,
  },
  production: {
    timezone: '+08:00',
    seederStorage: 'sequelize',
    ...connectionConfig,
  },
}
