import { ISession } from 'connect-typeorm'
import { Column, DeleteDateColumn, Entity, Index, PrimaryColumn } from 'typeorm'

@Entity({ name: 'sessions' })
export class Session implements ISession {
  @PrimaryColumn('varchar', { length: 255 })
  id!: string

  @Index('sessions_expiredAt_idx')
  @Column('bigint')
  expiredAt = Date.now()

  @Column('text', { default: '' })
  json!: string

  @DeleteDateColumn()
  destroyedAt?: Date
}
