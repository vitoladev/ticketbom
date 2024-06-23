import { EventsModule } from './events.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { faker } from '@faker-js/faker';
import { EventsService } from './events.service';
import { randomUUID } from 'crypto';
import {
  EventFactoryEntity,
  eventFactory,
  setupTestAppConfig,
  setupTestModuleFixture,
} from '../../../test';
import { TicketsModule } from '@modules/tickets/tickets.module';
import { TestingModule } from '@nestjs/testing';

describe('EventsModule', () => {
  let app: NestFastifyApplication;
  let testModule: TestingModule;
  beforeAll(async () => {
    testModule = await setupTestModuleFixture([TicketsModule, EventsModule]);
    app = testModule.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter()
    );

    await setupTestAppConfig(app);
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    await app.close();
    await testModule.close();
    console.log('Closed test Events module');
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
      expect(response.json()).toMatchObject<EventFactoryEntity>(eventInput);
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
      expect(alreadyCreatedResponse.json()).toMatchObject<EventFactoryEntity>(
        eventInput
      );

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

      expect(response.statusCode).toBe(200);
      expect(responseData.data.length).toBeGreaterThan(0);
      expect(responseData.totalRecords).toBeGreaterThan(0);
      expect(responseData.totalPages).toBeGreaterThan(0);
    });
  });

  describe('/events/:id (GET)', () => {
    it('should return a single event', async () => {
      const eventsService = app.get(EventsService);
      const eventsInput = eventFactory();
      const event = await eventsService.create(eventsInput);

      const response = await app.inject({
        method: 'GET',
        url: `/events/${event.id}`,
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toMatchObject<EventFactoryEntity>(eventsInput);
    });

    it('should return a 400 bad request error if id is invalid', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/events/invalid-uuid',
      });

      expect(response.statusCode).toBe(400);
    });

    it('should return a 404 not found error if event does not exist', async () => {
      const invalidId = randomUUID();
      const response = await app.inject({
        method: 'GET',
        url: `/events/${invalidId}`,
      });

      expect(response.statusCode).toBe(404);
    });
  });
});
