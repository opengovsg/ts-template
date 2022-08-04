import { exit } from 'process'

import { User } from '../entities'
import dataSource from '../ormconfig'

const main = async () => {
  const _connection = await dataSource.initialize()
  // Add your stuff here
  _connection.getRepository(User)

  exit(0)
}

void main()
