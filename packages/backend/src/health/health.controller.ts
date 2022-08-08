import { Controller, Get } from '@nestjs/common'
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus'
import { HealthDto } from '@ts/shared'

import { ConfigService } from '../config/config.service'

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private config: ConfigService,
    // Refer to https://github.com/nestjs/terminus/blob/master/sample/ for
    // examples of how to add other services/databases to healthcheck.
    private db: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  async check(): Promise<HealthDto> {
    return this.health.check([
      async () => this.db.pingCheck('database'),
      async () =>
        this.memory.checkHeap(
          'memory_heap',
          this.config.get('health.heapSizeThreshold'),
        ),
      async () =>
        this.memory.checkRSS(
          'memory_rss',
          this.config.get('health.rssThreshold'),
        ),
    ])
  }
}
