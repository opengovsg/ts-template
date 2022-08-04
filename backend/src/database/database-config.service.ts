import { Injectable } from '@nestjs/common'
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'
import { Client } from 'pg'

import { ConfigService } from '../config/config.service'

import { getOrmConfig } from './ormconfig'

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
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

  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    // Create database, remove in production
    await this.createDatabase()

    return getOrmConfig(this.config.config)
  }
}
