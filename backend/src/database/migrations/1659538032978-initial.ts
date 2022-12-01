import { MigrationInterface, QueryRunner } from 'typeorm'

export class initial1659538032978 implements MigrationInterface {
  name = 'initial1659538032978'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "sessions" ("id" character varying(255) NOT NULL, "expiredAt" bigint NOT NULL, "json" text NOT NULL DEFAULT \'\', CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY ("id"))'
    )
    await queryRunner.query(
      'CREATE INDEX "sessions_expiredAt_idx" ON "sessions" ("expiredAt") '
    )
    await queryRunner.query(
      'CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying(255) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))'
    )
    await queryRunner.query(
      'CREATE UNIQUE INDEX "user_email_idx" ON "users" ("email") WHERE "deletedAt" IS NULL'
    )
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "public"."user_email_idx"')
    await queryRunner.query('DROP TABLE "users"')
    await queryRunner.query('DROP INDEX "public"."sessions_expiredAt_idx"')
    await queryRunner.query('DROP TABLE "sessions"')
  }
}
