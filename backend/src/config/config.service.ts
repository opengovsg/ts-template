import { Injectable } from '@nestjs/common'
import convict, { Config, Path } from 'convict'

import { ConfigSchema, schema } from './config.schema'

@Injectable()
export class ConfigService {
  config: Config<ConfigSchema>

  constructor () {
    this.config = convict(schema)
    this.config.validate()
  }

  // We want to implicitly use the return type of convict get method.
  // eslint-disable-next-line
  get<K extends Path<ConfigSchema>>(key: K) {
    return this.config.get(key)
  }

  get isDevEnv (): boolean {
    return this.config.get('environment') === 'development'
  }
}
