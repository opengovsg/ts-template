import { Injectable } from '@nestjs/common'
import {
  SequelizeModuleOptions,
  SequelizeOptionsFactory,
} from '@nestjs/sequelize'
import { Client } from 'pg'

import { ConfigService } from '../config/config.service'

import { User } from './models'

@Injectable()
export class DatabaseConfigService implements SequelizeOptionsFactory {
  constructor(private readonly config: ConfigService) {}

  private async createDatabase() {
    const client = new Client({
      host: this.config.get('database.host'),
      port: this.config.get('database.port'),
      user: this.config.get('database.username'),
      password: this.config.get('database.password'),
    })
    await client.connect()

    const res = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1;',
      [this.config.get('database.name')],
    )
    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE ${this.config.get('database.name')}`)
    }
    await client.end()
  }

  async createSequelizeOptions(): Promise<SequelizeModuleOptions> {
    // Create database, remove in production
    await this.createDatabase()

    return {
      dialect: 'postgres',
      host: this.config.get('database.host'),
      port: this.config.get('database.port'),
      username: this.config.get('database.username'),
      password: this.config.get('database.password'),
      database: this.config.get('database.name'),
      models: [User],
      autoLoadModels: true, // TO-DO: remove in production
      synchronize: true, // TO-DO: remove in production
      pool: {
        min: this.config.get('database.minPool'),
        max: this.config.get('database.maxPool'),
      },
      logging: this.config.get('database.logging'),
    }
  }
}
