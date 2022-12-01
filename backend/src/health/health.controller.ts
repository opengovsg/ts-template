import { Controller, Get } from '@nestjs/common'
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator
} from '@nestjs/terminus'

import { HealthDto } from '~shared/types/health.dto'

import { ConfigService } from '../config/config.service'

@Controller('health')
export class HealthController {
  constructor (
    private readonly health: HealthCheckService,
    private readonly config: ConfigService,
    // Refer to https://github.com/nestjs/terminus/blob/master/sample/ for
    // examples of how to add other services/databases to healthcheck.
    private readonly db: TypeOrmHealthIndicator,
    private readonly memory: MemoryHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  async check (): Promise<HealthDto> {
    return await this.health.check([
      async () => await this.db.pingCheck('database'),
      async () =>
        await this.memory.checkHeap(
          'memory_heap',
          this.config.get('health.heapSizeThreshold')
        ),
      async () =>
        await this.memory.checkRSS(
          'memory_rss',
          this.config.get('health.rssThreshold')
        )
    ])
  }
}
