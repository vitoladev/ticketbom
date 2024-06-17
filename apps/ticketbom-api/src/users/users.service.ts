import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as schema from '@ticketbom/database';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
  constructor(@Inject('DB_DEV') private db: schema.DrizzleDatabase) {}

  async create({ name, email, birthDate, document }: CreateUserDto) {
    const user = await this.db
      .insert(schema.users)
      .values({ email, name })
      .returning()
      .execute();

    return user[0];
  }

  async findAll() {
    return await this.db.select().from(schema.users).execute();
  }

  async findOne(id: string) {
    const user = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id))
      .execute();

    return user;
  }

  async update(id: string, { name, email }: UpdateUserDto) {
    const user = await this.db
      .update(schema.users)
      .set({ name, email })
      .where(eq(schema.users.id, id))
      .returning()
      .execute();

    return user[0];
  }

  async remove(id: string) {
    await this.db.delete(schema.users).where(eq(schema.users.id, id)).execute();
  }
}
