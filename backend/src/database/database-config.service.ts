import { Injectable } from '@nestjs/common'
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'
import { Client } from 'pg'

import { ConfigService } from '../config/config.service'

import { base } from './ormconfig'

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
  constructor (private readonly config: ConfigService) { }

  private async createDatabase (): Promise<void> {
    const client = new Client({
      host: this.config.get('database.host'),
      port: this.config.get('database.port'),
      user: this.config.get('database.username'),
      password: this.config.get('database.password'),
      database: this.config.get('database.name'),
      ...(this.config.get('database.ca') !== undefined &&
        this.config.get('database.ca') !== null &&
        this.config.get('database.ca') !== ''
        ? { ssl: { ca: this.config.get('database.ca') } }
        : {})
    })
    await client.connect()

    const res = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1;',
      [this.config.get('database.name')]
    )
    const dbName = this.config.get('database')
    if (res.rowCount === 0) {
      // eslint-disable-next-line
      await client.query(`CREATE DATABASE ${dbName}`)
    }
    await client.end()
  }

  async createTypeOrmOptions (): Promise<TypeOrmModuleOptions> {
    // Create database, remove in production
    await this.createDatabase()

    return base
  }
}
