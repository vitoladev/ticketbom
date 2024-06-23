import { ConfigurableModuleBuilder } from '@nestjs/common';
import { DrizzlePGConfig } from './drizzle.interface';
import { DrizzleDatabase } from '@ticketbom/database';

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<DrizzlePGConfig>()
  .setExtras(
    {
      tag: DrizzleDatabase,
    },
    (definition, extras) => ({
      ...definition,
      tag: extras.tag,
    })
  )
  .build();
