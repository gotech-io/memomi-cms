import { DBLogicBase, DBType } from '@testomate/framework'
import { InferSelectModel, sql } from 'drizzle-orm'
import { mysqlTable, serial, varchar } from 'drizzle-orm/mysql-core'
import { MySql2Database } from 'drizzle-orm/mysql2'

const mysqlUsers = mysqlTable('users', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name', { length: 255 }),
  lastName: varchar('last_name', { length: 255 }),
  email: varchar('email', { length: 255 }),
  passwordHash: varchar('password_hash', { length: 255 }),
})

export type MySQLUser = InferSelectModel<typeof mysqlUsers>

// MySQL implementation of Logic
export class MySQLUserDBLogic extends DBLogicBase<MySql2Database> {
  constructor() {
    super(DBType.MySQL)
  }

  public async getByFirstName(firstName: string): Promise<MySQLUser[]> {
    const users = await this.connection
      .select()
      .from(mysqlUsers)
      .where(sql`first_name = ${firstName}`)

    return users
  }
}
