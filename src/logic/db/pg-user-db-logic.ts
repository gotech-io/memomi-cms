import { DBLogicBase, DBType } from '@testomate/framework'
import { InferSelectModel, sql } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { pgTable, serial, varchar } from 'drizzle-orm/pg-core'

const pgUsers = pgTable('users', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name'),
  lastName: varchar('last_name'),
  email: varchar('email'),
  passwordHash: varchar('password_hash'),
})

export type PgUser = InferSelectModel<typeof pgUsers>

// PG implementation of Logic
export class PgUserDBLogic extends DBLogicBase<NodePgDatabase> {
  constructor() {
    super(DBType.PG)
  }

  public async getByFirstName(firstName: string): Promise<PgUser[]> {
    const users: PgUser[] = await this.connection
      .select()
      .from(pgUsers)
      .where(sql`first_name = ${firstName}`)

    return users
  }
}
