import config from '../../config'

// We have to manually parse database URL because sequelize-typescript requires explicit
// connection parameters.
const connectionConfig = config.get('db')

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
