import { AppModule } from './../app/app.module';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { DrizzlePGModule } from '../common/drizzle/drizzle.module';
import * as schema from '../common/database/schema';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DrizzlePGModule.register({
          tag: 'DB_DEV',
          pg: {
            connection: 'client',
            config: {
              host: process.env.DB_HOST,
              port: parseInt(process.env.DB_PORT),
              user: process.env.DB_USER,
              password: process.env.DB_PASSWORD,
              database: process.env.DB_NAME,
            },
          },
          config: { schema: { ...schema } },
        }),
      ],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const user = await service.create({
      name: 'John Doe',
      email: 'johndoe@test.com',
      type: 'ORGANIZER',
    });

    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('johndoe@test.com');
    expect(user.type).toBe('ORGANIZER');
  });
});
