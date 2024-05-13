import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../common/database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
  constructor(@Inject('DB_DEV') private db: NodePgDatabase<typeof schema>) {}

  async create({ name, email, type }: CreateUserDto) {
    const user = await this.db
      .insert(schema.users)
      .values({
        name,
        email,
        type,
      })
      .returning()
      .execute();

    return user[0];
  }

  async findAll() {
    return await this.db.select().from(schema.users).execute();
  }

  async findOne(id: number) {
    const user = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id))
      .execute();

    return user;
  }

  async update(id: number, { name, email }: UpdateUserDto) {
    const user = await this.db
      .update(schema.users)
      .set({ name, email })
      .where(eq(schema.users.id, id))
      .returning()
      .execute();

    return user[0];
  }

  async remove(id: number) {
    await this.db.delete(schema.users).where(eq(schema.users.id, id)).execute();
  }
}
