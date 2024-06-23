import { Global, DynamicModule } from '@nestjs/common';
import {
  ASYNC_OPTIONS_TYPE,
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
} from './drizzle.definition';
import { DrizzlePGService } from './drizzle.service';
import { DrizzlePGConfig } from './drizzle.interface';
import { DrizzleDatabase } from '@ticketbom/database';

@Global()
export class DrizzlePGModule extends ConfigurableModuleClass {
  static register(options: typeof OPTIONS_TYPE): DynamicModule {
    const { providers = [], exports = [], ...props } = super.register(options);
    return {
      ...props,
      providers: [
        ...providers,
        DrizzlePGService,
        {
          provide: DrizzleDatabase,
          useFactory: async (drizzleService: DrizzlePGService) => {
            return await drizzleService.getDrizzle(options);
          },
          inject: [DrizzlePGService],
        },
      ],
      exports: [...exports, options?.tag || 'default'],
    };
  }
  static registerAsync(options: typeof ASYNC_OPTIONS_TYPE): DynamicModule {
    const {
      providers = [],
      exports = [],
      ...props
    } = super.registerAsync(options);
    return {
      ...props,
      providers: [
        ...providers,
        DrizzlePGService,
        {
          provide: DrizzleDatabase,
          useFactory: async (
            drizzleService: DrizzlePGService,
            config: DrizzlePGConfig
          ) => {
            return await drizzleService.getDrizzle(config);
          },
          inject: [DrizzlePGService, MODULE_OPTIONS_TOKEN],
        },
      ],
      exports: [...exports, DrizzleDatabase],
    };
  }
}
