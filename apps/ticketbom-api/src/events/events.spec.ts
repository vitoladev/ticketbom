import { Test, TestingModule } from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from '../app/app.module';
import { EventsModule } from './events.module';
import { faker } from '@faker-js/faker';
import { EventEntity, EventStatus } from './entities/event.entity';
import { ValidationPipe } from '@nestjs/common';

const eventFactory = (): EventEntity => ({
  title: faker.lorem.words(3),
  description: faker.lorem.paragraph(),
  date: faker.date.future().toISOString(),
  status: faker.helpers.arrayElement([
    'UPCOMING',
    'ONGOING',
    'FINISHED',
  ] as EventStatus[]),
  location: faker.location.streetAddress(),
});

describe('Events', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, EventsModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter()
    );
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/events (POST)', () => {
    it('should create a new event', async () => {
      const eventInput = eventFactory();

      const response = await app.inject({
        method: 'POST',
        url: '/events',
        payload: eventInput,
      });

      expect(response.statusCode).toBe(201);
      expect(response.json()).toMatchObject<EventEntity>(eventInput);
    });

    it('should throw a validation error if required fields are missing', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/events',
        payload: {
          title: '',
          description: '',
          date: '',
          location: '',
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it('should throw a validation error if date is in the past', async () => {
      const eventInput = eventFactory();

      const response = await app.inject({
        method: 'POST',
        url: '/events',
        payload: {
          ...eventInput,
          date: faker.date.past().toISOString(),
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it('should throw a validation error if status is invalid', async () => {
      const eventInput = eventFactory();

      const response = await app.inject({
        method: 'POST',
        url: '/events',
        payload: {
          ...eventInput,
          status: 'INVALID_STATUS',
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it('should throw a 409 conflict error if event with same title and date already exists', async () => {
      const eventInput = eventFactory();

      // create an event with the same title and date
      const alreadyCreatedResponse = await app.inject({
        method: 'POST',
        url: '/events',
        payload: eventInput,
      });

      expect(alreadyCreatedResponse.statusCode).toBe(201);
      expect(alreadyCreatedResponse.json()).toMatchObject<EventEntity>(eventInput);

      const response = await app.inject({
        method: 'POST',
        url: '/events',
        payload: eventInput,
      });

      expect(response.statusCode).toBe(409);
    });
  });

  describe('/events (GET)', () => {
    it('should return all events', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/events',
        query: {
          page: '1',
          pageSize: '10',
        },
      });
      const responseData = response.json();

      console.log({ responseData });

      expect(response.statusCode).toBe(200);
      expect(responseData.data.length).toBeGreaterThan(0);
      expect(responseData.totalRecords).toBeGreaterThan(0);
      expect(responseData.totalPages).toBeGreaterThan(0);
    });
  });

  // describe('/events/:id (GET)', () => {
  //     it('should return a single event', async () => {
  //         const eventId = 1;
  //         const response = await app.inject({
  //             method: 'GET',
  //             url: `/events/${eventId}`,
  //         });

  //         expect(response.statusCode).toBe(200);
  //         expect(response.json()).toEqual(response.body);
  //     });
  // });
});
