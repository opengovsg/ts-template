import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

import { IsGovSgEmail } from '~shared/decorators/is-gov-sg-email'

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
    id: number

  @Column('varchar', { length: 255 })
  @Index('user_email_idx', {
    unique: true,
    where: '"deletedAt" IS NULL'
  })
  @IsGovSgEmail()
    email: string

  @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date

  @DeleteDateColumn({ type: 'timestamptz' })
    deletedAt: Date | null
}
